#!/usr/bin/env bash

declare projectDir=$(git rev-parse --show-toplevel);
declare currentDir=$(pwd)
declare screenshotDevTools="${projectDir}/tools/applescript/lib/src/screenshot-dev-tools.js";
declare screenshot="${projectDir}/tools/applescript/lib/src/screenshot.js";
declare launchFirefox="${projectDir}/tools/applescript/lib/src/launch-firefox.js";
declare screenshotOnly="${projectDir}/tools/applescript/lib/src/screenshot-only.js";
# setup
mkdir -p "${currentDir}/img/"
echo "local server 起動"
npx -q @js-primer/local-server src/ &
serverPID=$!
# screenshot
echo "screenshotを撮影"
npx -q wait-on http://localhost:3000 \
&& node "${launchFirefox}" --devTools --url "http://localhost:3000/" \
&& read -p "コンソールのスクショ: コンソールタブを開く -> Enter" \
&& node "${screenshotOnly}" --output "${currentDir}/img/index.png" \

# server 終了
function finish {
  echo "Shutting down the server..."
  kill $serverPID
}
trap finish INT KILL TERM EXIT
