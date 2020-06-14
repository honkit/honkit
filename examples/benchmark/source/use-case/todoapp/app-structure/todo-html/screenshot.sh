#!/usr/bin/env bash

declare projectDir=$(git rev-parse --show-toplevel);
declare todoappDir="${projectDir}/source/use-case/todoapp"
declare currentSectionDir="${todoappDir}/app-structure"
declare currentDir="${todoappDir}/app-structure/todo-html"
declare screenshot="${projectDir}/tools/applescript/lib/src/screenshot.js";
declare screenshotDevTools="${projectDir}/tools/applescript/lib/src/screenshot-dev-tools.js";
declare launchFirefox="${projectDir}/tools/applescript/lib/src/launch-firefox.js";
declare screenshotOnly="${projectDir}/tools/applescript/lib/src/screenshot-only.js";

# スクショ
mkdir -p "${currentSectionDir}/img/"
npx -q @js-primer/local-server . & serverPID=$!
npx -q wait-on http://localhost:3000 \
&& node "${screenshot}" --url "http://localhost:3000/" --output "${currentSectionDir}/img/todo-html.png" 

# server 終了
function finish {
  echo "Shutting down the server..."
  kill $serverPID
}
trap finish INT KILL TERM EXIT
