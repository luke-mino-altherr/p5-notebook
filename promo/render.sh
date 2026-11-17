#!/bin/sh
# Exports each promo page as a PNG (2160 x 2700, crisp on high-resolution screens).
# Needs Google Chrome. Run from anywhere: ./promo/render.sh
# The PNGs are written to promo/images/.

cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
mkdir -p images
PROFILE=$(mktemp -d)

for page in *.html; do
  name="${page%.html}"
  "$CHROME" --headless=new --user-data-dir="$PROFILE" --hide-scrollbars \
    --window-size=1080,1350 --force-device-scale-factor=2 --timeout=4000 \
    --screenshot="images/$name.png" "file://$PWD/$page" >/dev/null 2>&1 &
  pid=$!
  sleep 12 # Chrome sometimes doesn't exit on its own, so stop it after the screenshot is taken
  kill $pid 2>/dev/null
  echo "images/$name.png"
done

rm -rf "$PROFILE"
