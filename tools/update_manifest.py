#!/usr/bin/env python3
"""Writes the update manifest for a game build: which file, its version, size and SHA-256.

    python3 tools/update_manifest.py dist/qed.html --version 1793773037 > manifest.json

The Android app trusts a downloaded build only if this manifest carries a valid signature from the
project's update key (made by tools/publish_pages.sh) and the downloaded file matches the size and hash
listed here. The version is the commit time of the game sources (src/), so newer commits get bigger numbers.
"""
import argparse
import hashlib
import json
import sys
from datetime import datetime, timezone

ap = argparse.ArgumentParser()
ap.add_argument('game')
ap.add_argument('--version', type=int, required=True)
args = ap.parse_args()

data = open(args.game, 'rb').read()
manifest = {
    'app': 'qed',  # the app refuses any other name (android/src/app/qed/UpdateCheck.java)
    'file': 'index.html',
    'version': args.version,
    'built': datetime.fromtimestamp(args.version, timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
    'size': len(data),
    'sha256': hashlib.sha256(data).hexdigest(),
}
sys.stdout.write(json.dumps(manifest, separators=(',', ':')) + '\n')
