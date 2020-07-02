#!/usr/bin/env bash

declare projectDir=$(git rev-parse --show-toplevel);
declare todoappDir="${projectDir}/source/use-case/todoapp"
declare currentSectionDir="${todoappDir}/entrypoint"
declare currentDir="${todoappDir}/entrypoint/first-entry"
declare screenshotDevTools="${projectDir}/tools/applescript/lib/src/screenshot-dev-tools.js";
declare screenshot="${projectDir}/tools/applescript/lib/src/screenshot.js";
declare launchFirefox="${projectDir}/tools/applescript/lib/src/launch-firefox.js";
declare screenshotOnly="${projectDir}/tools/applescript/lib/src/screenshot-only.js";

# スクリーンショット
mkdir -p "${currentSectionDir}/img/"
npx -q @js-primer/local-server . & serverPID=$!
npx -q wait-on http://localhost:3000 \
&& node "${screenshotDevTools}" --url "http://localhost:3000/" --output "${currentSectionDir}/img/first-entry.png"

# server 終了
function finish {
  echo "Shutting down the server..."
  kill $serverPID
}
trap finish INT KILL TERM EXIT
