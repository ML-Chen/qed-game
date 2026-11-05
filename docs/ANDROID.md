# Q.E.D.! on Android: one-time setup and releases

This page is for the owner of the GitHub repository ML-Chen/qed-game. It explains how to give GitHub the keys once, how to get an installable Android app (an APK) out of GitHub, and how to put it on a phone. You don't need Android Studio or the Android SDK on your computer. GitHub builds the app on its own servers.

GitHub needs three secrets:

| Secret name | What it is |
|---|---|
| `QED_UPDATE_KEY` | The private key that signs game updates. Installed apps only accept new game builds signed with it. |
| `QED_KEYSTORE_B64` | The Android release keystore, turned into text (base64). Android uses it to check that a new APK comes from the same author as the installed one. |
| `QED_KEYSTORE_PASSWORD` | The password of that keystore. |

You never put a public key into the repository. The app build works out the public half of the update key from `QED_UPDATE_KEY` by itself and builds it into the app.

## Reusing Holy Moly's keys

This is the normal setup: Q.E.D.! uses the same two key files you already made for Holy Moly!, so there is nothing new to make and nothing new to back up. You need the files from your Holy Moly! backup:

- `holymoly_update_key.pem` (the update key)
- `holymoly-release.jks` (the release keystore) and its password

The build already expects this. The key inside that keystore is called `holymoly` (its "alias"), and `android/build.sh` looks for exactly that name (the line `KEY_ALIAS_DEFAULT=holymoly`). Sharing the update key is safe: each app only downloads updates from its own website, and it also refuses any update whose signed manifest names the other game.

### Step 1: turn the keystore into text

Open a terminal in the folder with your backup files (NOT inside the repository) and run:

- Linux or Git Bash: `base64 -w0 holymoly-release.jks > holymoly-release.b64.txt`
- macOS: `base64 -i holymoly-release.jks -o holymoly-release.b64.txt`

### Step 2: add the three secrets to GitHub

In a web browser, open https://github.com/ML-Chen/qed-game and go to **Settings → Secrets and variables → Actions → New repository secret**. Add each one:

1. Name `QED_UPDATE_KEY`. Value: open `holymoly_update_key.pem` in a text editor, copy everything including the BEGIN and END lines, paste.
2. Name `QED_KEYSTORE_B64`. Value: copy everything in `holymoly-release.b64.txt`, paste. Line breaks in it don't matter; the build removes them.
3. Name `QED_KEYSTORE_PASSWORD`. Value: the Holy Moly! keystore password.

If you have the GitHub command-line tool (`gh`) and are logged in, these three commands do the same without copying and pasting (the last one asks you to type the password):

```
gh secret set QED_UPDATE_KEY -R ML-Chen/qed-game < holymoly_update_key.pem
gh secret set QED_KEYSTORE_B64 -R ML-Chen/qed-game < holymoly-release.b64.txt
gh secret set QED_KEYSTORE_PASSWORD -R ML-Chen/qed-game
```

After that you can delete `holymoly-release.b64.txt`. Then continue with "Turn on the web version" below.

## Making new keys instead (optional)

Only do this if you want Q.E.D.! to have keys of its own, separate from Holy Moly!. Then you have two more files to back up, and the build needs one small change.

### Make the update key

You need `openssl`. It is already installed on macOS and Linux. On Windows, use the "Git Bash" window that comes with Git for Windows. In a folder that is NOT inside the repository, run:

```
openssl ecparam -name prime256v1 -genkey -noout | openssl pkcs8 -topk8 -nocrypt -out qed_update_key.pem
```

The whole file `qed_update_key.pem`, including the BEGIN and END lines, goes into the secret `QED_UPDATE_KEY`.

### Make the release keystore

You need `keytool`, which comes with Java. If `keytool -help` says the command is not found, install a Java JDK first (for example Temurin 17 from adoptium.net, or `brew install openjdk@17` on a Mac).

```
keytool -genkeypair -v -keystore qed-release.jks -alias qed -keyalg RSA -keysize 4096 -validity 10000
```

It asks for a password (at least 6 characters; write it down), then your name and some optional details, which you can fill in or leave blank, then asks you to confirm with `yes`. If it asks for a separate key password, press Enter so the key uses the same password as the keystore. The build expects one password for both.

The key in this new keystore is called `qed`, so change the line `KEY_ALIAS_DEFAULT=holymoly` in `android/build.sh` to `KEY_ALIAS_DEFAULT=qed` and push that change.

Turn the keystore into text (`base64 -w0 qed-release.jks > qed-release.b64.txt`, or on macOS `base64 -i qed-release.jks -o qed-release.b64.txt`), and add the three secrets as in Step 2 above, using `qed_update_key.pem`, `qed-release.b64.txt` and the new password.

## Turn on the web version (GitHub Pages)

Each push to `main` that changes the game runs the workflow "Publish to GitHub Pages". It builds the game and puts it on a branch called `gh-pages`, together with the signed update that installed apps download. To start it the first time without pushing anything, go to **Actions → Publish to GitHub Pages → Run workflow**.

When that run has finished, go to **Settings → Pages**. Under "Build and deployment", set Source to **Deploy from a branch**, Branch to **gh-pages**, folder **/ (root)**, and click Save. A minute later the game is playable at https://ml-chen.github.io/qed-game/.

If the update key secret is missing, this workflow still publishes the playable web game, shows a yellow warning, and leaves out the `update/` folder, so installed apps simply don't get that build.

## Build the Android app

The workflow "Build Android APK" runs by itself whenever a push to `main` changes something in the `android/` folder. It publishes a GitHub Release named `android-v1.<run number>` with `qed.apk` attached. The newest APK is always at:

https://github.com/ML-Chen/qed-game/releases/latest/download/qed.apk

That is the link in the README. To build without changing `android/` (for example the very first time, after adding the secrets), start it by hand. Only people with write access to the repository can do this.

- **From the website:** go to **Actions → Build Android APK → Run workflow**. Leave the "release" box empty for an automatic `android-v1.<run number>` release, or type a name such as `android-v2.0`.
- **With a tag from your computer:** `git tag android-v2.0` and then `git push origin android-v2.0`. Any tag that starts with `android-v` builds the app and publishes a Release with that name.

The build takes a few minutes. If a secret is missing, the run stops with a red error that names the missing secret. If the keystore password is wrong, or the keystore has no key with the alias in `android/build.sh`, the run stops with an error that says so.

Each run also keeps the APK under "Artifacts" on the run's page (`qed-apk`, a zip with `qed.apk` and its SHA-256 checksum). You must be logged in to GitHub to download that, and it is deleted after 90 days, so use the Releases link for phones.

## Install it on a phone

1. On the Android phone, open https://github.com/ML-Chen/qed-game/releases/latest/download/qed.apk in the browser. It downloads `qed.apk`.
2. Tap the downloaded file. The first time, Android says the browser isn't allowed to install apps. Tap **Settings**, turn on **Allow from this source**, and go back.
3. Tap **Install**. Google Play Protect may say it doesn't recognise the developer. Tap **More details → Install anyway**. This is normal for apps that don't come from the Play Store.
4. Open **Q.E.D.!** from the home screen. It plays without an internet connection.

To install a newer APK later, do the same steps. Android installs it over the old one and the saved progress (cards, best scores) stays. This only works if the new APK was signed with the same keystore.

## How game updates reach the phone

You don't need a new APK when you change the game. When the app is open and online, it checks https://ml-chen.github.io/qed-game/update/ at most every 3 hours for a newer signed build, downloads it, checks its signature and SHA-256 checksum, and starts using it the next time the app is opened. A new APK is only needed when something in the `android/` folder changes, and the workflow above makes one by itself when that happens.

## Heurēka! on Android

Heurēka! is a second app (`app.heureka`, called "Heurēka!" on the phone) built from the same Android code with `APP=heureka android/build.sh`. Its manifest and launcher icons are in `heureka/android`. It installs next to Q.E.D.!, not over it, and keeps its own saves.

- **Where the APK comes from:** the workflow "Build Heurēka! Android APK" (`.github/workflows/android-heureka.yml`). It runs by itself when a push to `main` changes `heureka/android/` or `android/`, and you can start it by hand the same ways as above: **Actions → Build Heurēka! Android APK → Run workflow**, or push a tag that starts with `heureka-android-v` (for example `git tag heureka-android-v2.0` and `git push origin heureka-android-v2.0`). Each run publishes a Release named `heureka-android-v1.<run number>` with `heureka.apk` attached.
- **The download link:** these releases are not marked "Latest", so the `releases/latest` link above keeps giving Q.E.D.!. To get Heurēka!, open https://github.com/ML-Chen/qed-game/releases on the phone, find the newest release whose name starts with "Heurēka! for Android", and tap `heureka.apk`. Then install it as described in "Install it on a phone".
- **Secrets:** none to add. It uses the same three secrets (`QED_UPDATE_KEY`, `QED_KEYSTORE_B64`, `QED_KEYSTORE_PASSWORD`) and the same key alias as Q.E.D.!.
- **Game updates:** the app checks https://ml-chen.github.io/qed-game/heureka/update/ (published by "Publish to GitHub Pages" along with Q.E.D.!) and only installs builds whose signed manifest says `"app": "heureka"`. Changes to the game itself don't need a new APK.

## Back up your keys

If you reuse Holy Moly's keys, your existing Holy Moly! backup already covers Q.E.D.!. If you made new keys, store `qed_update_key.pem`, `qed-release.jks` and the keystore password in a safe place outside the repository, for example a password manager plus an encrypted USB stick. GitHub never shows a secret's value again after you save it, so the GitHub secret is not a backup.

- **If you lose the keystore or its password,** you can't make an APK that installs over the existing app. Every phone would have to uninstall Q.E.D.! (which deletes its saved progress) and install a new app signed with a new keystore.
- **If you lose the update key,** installed apps stop receiving game updates. You can make a new update key and put it in `QED_UPDATE_KEY`, but each phone then needs a newly built APK, because the old app only trusts the old key.
- **If someone else gets the update key,** they could sign a game build that installed apps would accept if they could also get it onto the `gh-pages` branch. If you think it leaked, make a new one, replace the secret (in both repositories, if they share it), and build and install new APKs.

Never commit any of these files to the repository, and never paste them into an issue, a pull request or a chat.
