#!/usr/bin/env bash
# Builds the Q.E.D.! Android app (an APK) from the current game build, without Gradle.
# Normally this runs in GitHub Actions (.github/workflows/android.yml); see docs/ANDROID.md.
#
#   android/build.sh [game.html] [out.apk]
#   APP=heureka android/build.sh [dist/heureka.html] [dist/heureka.apk]
#
# APP picks the app (default qed). Both apps share the Java shell in android/src. For APP=heureka the build copies
# it, renames the package to app.heureka and points it at Heurēka!'s own signed updates (see "App settings"
# below); the manifest and launcher icons come from heureka/android. The keys are the same for both apps.
#
# Needs: a JDK 17+ (javac), openssl, python3, zip, and the Android SDK build-tools and a platform.
#   ANDROID_BUILD_TOOLS  folder with aapt2, d8, zipalign, apksigner (default: newest in $ANDROID_HOME/build-tools)
#   ANDROID_PLATFORM     folder with android.jar                     (default: newest in $ANDROID_HOME/platforms)
# Update key (the app only installs game updates signed by it):
#   QED_UPDATE_KEY       the PEM private key. Only its PUBLIC half goes into the app: it is derived here and
#                        written into UpdateCheck.java in a temporary copy of the sources.
# Signing (the same keystore must sign every future version, or Android refuses to install it over the old one):
#   ANDROID_KEYSTORE, ANDROID_KEYSTORE_PASSWORD, ANDROID_KEY_ALIAS (default: KEY_ALIAS_DEFAULT below)
# The game file goes inside the APK, so the app works offline. Its version number is the commit time of src/
# (Heurēka!: src/ and heureka/), the same number the signed web updates use, so the app knows whether a downloaded update is newer.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
APP="${APP:-qed}"
# App settings. SRCS: the folders whose newest commit time is the game version (the same as tools/publish_pages.sh
# uses for the signed web updates). APP_SRCS: the same plus the Android code, for the app's own version.
case "$APP" in
  qed)
    APP_DIR="$HERE"; PACKAGE=qed
    SRCS="src"; APP_SRCS="src android" ;;
  heureka)
    APP_DIR="$ROOT/heureka/android"; PACKAGE=heureka
    SRCS="src heureka"; APP_SRCS="src heureka android"
    APP_TITLE='Heur\u0113ka!' # a Java string escape for "Heurēka!", so the source stays ASCII
    PAGES_URL="https://ml-chen.github.io/qed-game/heureka/"
    RAW_URL="https://raw.githubusercontent.com/ML-Chen/qed-game/gh-pages/heureka/" ;;
  *) echo "unknown APP=$APP (use qed or heureka)" >&2; exit 1 ;;
esac
GAME="${1:-$ROOT/dist/$APP.html}"
OUT="${2:-$ROOT/dist/$APP.apk}"
MANIFEST="$APP_DIR/AndroidManifest.xml"
RES="${ANDROID_RES_DIR:-$APP_DIR/res}" # ANDROID_RES_DIR: other launcher icons, only for local tests
SDK="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}"
# Newest stable build-tools (e.g. 36.0.0, not 36.0.0-rc1) and newest numbered platform (android-36, not android-36-ext19).
BT="${ANDROID_BUILD_TOOLS:-$(ls -d "$SDK"/build-tools/* 2>/dev/null | grep -E '/[0-9]+\.[0-9]+\.[0-9]+$' | sort -V | tail -1 || true)}"
PLATFORM="${ANDROID_PLATFORM:-$(ls -d "$SDK"/platforms/* 2>/dev/null | grep -E '/android-[0-9]+$' | sort -V | tail -1 || true)}"
ANDROID_JAR="$PLATFORM/android.jar"
# The name ("alias") of the signing key inside the release keystore. This is the only place it is set.
# It is "holymoly" because the owner signs Q.E.D.! with the same release keystore as Holy Moly!, and the key in that
# keystore is called holymoly. If you make a new keystore just for Q.E.D.! (docs/ANDROID.md, "Making new keys
# instead"), its alias is qed: change this line to KEY_ALIAS_DEFAULT=qed (or set ANDROID_KEY_ALIAS=qed).
KEY_ALIAS_DEFAULT=holymoly
ALIAS="${ANDROID_KEY_ALIAS:-$KEY_ALIAS_DEFAULT}"
for f in "$BT/aapt2" "$BT/d8" "$BT/zipalign" "$BT/apksigner" "$ANDROID_JAR"; do
  [ -e "$f" ] || { echo "missing: $f (set ANDROID_HOME, or ANDROID_BUILD_TOOLS and ANDROID_PLATFORM)" >&2; exit 1; }
done
for f in "$GAME" "$MANIFEST" "$RES"; do
  [ -e "$f" ] || { echo "missing: $f (the game page, or the app's AndroidManifest.xml or res/ folder for APP=$APP)" >&2; exit 1; }
done
: "${QED_UPDATE_KEY:?set QED_UPDATE_KEY to the update signing key (PEM private key); see docs/ANDROID.md}"
: "${ANDROID_KEYSTORE:?set ANDROID_KEYSTORE to the release keystore}"
: "${ANDROID_KEYSTORE_PASSWORD:?set ANDROID_KEYSTORE_PASSWORD}"
# Fail early, before the slow steps, if the keystore can't be opened or has no key with that alias.
keytool -list -keystore "$ANDROID_KEYSTORE" -storepass:env ANDROID_KEYSTORE_PASSWORD -alias "$ALIAS" >/dev/null 2>&1 \
  || { echo "could not open $ANDROID_KEYSTORE with ANDROID_KEYSTORE_PASSWORD, or it has no key with the alias $ALIAS (see KEY_ALIAS_DEFAULT in android/build.sh)" >&2; exit 1; }
echo "app:         $APP"
echo "build-tools: $BT"
echo "platform:    $PLATFORM"
echo "key alias:   $ALIAS"

WORK="$(mktemp -d)"; trap 'rm -rf "$WORK"' EXIT
VERSION="$(git -C "$ROOT" log -1 --format=%ct -- $SRCS 2>/dev/null || true)"; VERSION="${VERSION:-$(date +%s)}"
# The app's own version (for Android's "is this an update?" check) also moves when only the Android code changes.
APP_VERSION="$(git -C "$ROOT" log -1 --format=%ct -- $APP_SRCS 2>/dev/null || true)"; APP_VERSION="${APP_VERSION:-$(date +%s)}"

# 1. The update public key, derived from the private key and written into a copy of the Java sources.
printf '%s\n' "$QED_UPDATE_KEY" > "$WORK/update_key.pem"
PUB_B64="$(openssl pkey -in "$WORK/update_key.pem" -pubout -outform DER | base64 -w0)" \
  || { echo "QED_UPDATE_KEY is not a readable PEM private key" >&2; exit 1; }
rm -f "$WORK/update_key.pem"
case "$PUB_B64" in
  MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE*) ;; # SubjectPublicKeyInfo header of an EC prime256v1 key
  *) echo "QED_UPDATE_KEY is not an ECDSA P-256 (prime256v1) key; see docs/ANDROID.md" >&2; exit 1 ;;
esac
mkdir -p "$WORK/src"
cp -R "$HERE/src/." "$WORK/src/"
if [ "$APP" != qed ]; then
  # The same shell as another app: new package, its own update address, app name check, and texts. Each
  # replacement must match exactly once (count given), so a change to the Java sources can't leave a Q.E.D.! value behind.
  J="$WORK/src/app/$PACKAGE"
  mv "$WORK/src/app/qed" "$J"
  swap() { # file count old new: replaces the literal text old with new, which must occur exactly count times
    python3 - "$@" <<'PY' || { echo "android/build.sh: could not adapt $1 for APP=$APP" >&2; exit 1; }
import sys
path, count, old, new = sys.argv[1], int(sys.argv[2]), sys.argv[3], sys.argv[4]
text = open(path, encoding='utf-8').read()
if text.count(old) != count:
    sys.exit(f'{path}: expected {count} x {old!r}, found {text.count(old)}')
open(path, 'w', encoding='utf-8').write(text.replace(old, new))
PY
  }
  for f in "$J"/*.java; do swap "$f" 1 'package app.qed;' "package app.$PACKAGE;"; done
  swap "$J/UpdateCheck.java" 1 '"qed".equals(json.getString("app"))' "\"$APP\".equals(json.getString(\"app\"))"
  swap "$J/Updater.java" 1 '"https://ml-chen.github.io/qed-game/",' "\"$PAGES_URL\","
  swap "$J/Updater.java" 1 '"https://raw.githubusercontent.com/ML-Chen/qed-game/gh-pages/",' "\"$RAW_URL\","
  swap "$J/Updater.java" 1 '"qed-updater"' "\"$APP-updater\""
  swap "$J/Updater.java" 1 'next time you open Q.E.D.!"' "next time you open $APP_TITLE\""
  swap "$J/MainActivity.java" 1 '"Q.E.D.! updated with new games"' "\"$APP_TITLE updated with new games\""
  if grep -rn 'app\.qed\|"qed"\|"qed-updater"\|qed-game/"\|gh-pages/"\|"[^"]*Q\.E\.D\.![^"]*"' "$J"; then
    echo "android/build.sh: Q.E.D.! values survived in the APP=$APP sources (above); refusing to build" >&2; exit 1
  fi
fi
CHECK="$WORK/src/app/$PACKAGE/UpdateCheck.java"
grep -q '@@UPDATE_PUBKEY_B64@@' "$CHECK" || { echo "placeholder @@UPDATE_PUBKEY_B64@@ not found in UpdateCheck.java" >&2; exit 1; }
sed -i "s|@@UPDATE_PUBKEY_B64@@|$PUB_B64|" "$CHECK"
if grep -rq '@@UPDATE_PUBKEY_B64@@' "$WORK/src"; then echo "the update key placeholder survived; refusing to build" >&2; exit 1; fi
echo "update key:  ${PUB_B64:36:12}... (public half, compiled into UpdateCheck)"

# 2. The game, as an asset, with a small manifest giving its version and hash.
mkdir -p "$WORK/assets/game"
cp "$GAME" "$WORK/assets/game/index.html"
python3 "$ROOT/tools/update_manifest.py" "$WORK/assets/game/index.html" --version "$VERSION" --app "$APP" > "$WORK/assets/game/manifest.json"

# 3. Resources (the launcher icons) and the manifest, compiled with aapt2.
"$BT/aapt2" compile --dir "$RES" -o "$WORK/res.zip"
"$BT/aapt2" link -o "$WORK/unsigned.apk" -I "$ANDROID_JAR" --manifest "$MANIFEST" \
  --version-code "$(( (APP_VERSION - 1700000000) / 60 ))" --version-name "$(date -u -d "@$APP_VERSION" +%Y.%m.%d.%H%M)" \
  -A "$WORK/assets" "$WORK/res.zip" --auto-add-overlay

# 4. Java -> class files -> Android bytecode (classes.dex).
mkdir -p "$WORK/classes"
javac -nowarn --release 11 -classpath "$ANDROID_JAR" -d "$WORK/classes" $(find "$WORK/src" -name '*.java')
"$BT/d8" --release --min-api 24 --lib "$ANDROID_JAR" --output "$WORK" $(find "$WORK/classes" -name '*.class')
(cd "$WORK" && zip -q -j unsigned.apk classes.dex)

# 5. Align and sign.
mkdir -p "$(dirname "$OUT")"
"$BT/zipalign" -f -p 4 "$WORK/unsigned.apk" "$WORK/aligned.apk"
"$BT/apksigner" sign --ks "$ANDROID_KEYSTORE" --ks-key-alias "$ALIAS" \
  --ks-pass env:ANDROID_KEYSTORE_PASSWORD --key-pass env:ANDROID_KEYSTORE_PASSWORD \
  --out "$OUT" "$WORK/aligned.apk"
"$BT/apksigner" verify --print-certs "$OUT" | head -3
echo "built $APP: $OUT ($(du -h "$OUT" | cut -f1)), game version $VERSION"
