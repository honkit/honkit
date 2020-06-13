#!/usr/bin/env bash

declare projectDir=$(git rev-parse --show-toplevel);
declare currentDir=$(pwd)
declare screenshotDevTools="${projectDir}/tools/applescript/lib/src/screenshot-dev-tools.js";
declare screenshot="${projectDir}/tools/applescript/lib/src/screenshot.js";
declare launchFirefox="${projectDir}/tools/applescript/lib/src/launch-firefox.js";
declare screenshotOnly="${projectDir}/tools/applescript/lib/src/screenshot-only.js";
# マニュアル操作が必要なもの
# formの内容をコンソールに表示するスクショ
mkdir -p "${currentDir}/img/"
npx -q @js-primer/local-server src/console & serverPID=$!
npx -q wait-on http://localhost:3000/ \
&& node "${launchFirefox}" --devTools --url "http://localhost:3000" \
&& read -p "コンソールのエラーを展開 -> Enter" \
&& node "${screenshotOnly}" --output  "${currentDir}/img/console.error.png"

# server 終了
function finish {
  echo "Shutting down the server..."
  kill $serverPID
}
trap finish INT KILL TERM EXIT
