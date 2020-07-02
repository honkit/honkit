#!/usr/bin/env bash

declare projectDir=$(git rev-parse --show-toplevel);
declare currentDir=$(pwd)
declare screenshotDevTools="${projectDir}/tools/applescript/lib/src/screenshot-dev-tools.js";
declare screenshot="${projectDir}/tools/applescript/lib/src/screenshot.js";
declare launchFirefox="${projectDir}/tools/applescript/lib/src/launch-firefox.js";
declare screenshotOnly="${projectDir}/tools/applescript/lib/src/screenshot-only.js";

# entry-pointのスクショ
mkdir -p "${currentDir}/img/"
node "${screenshotDevTools}" --url "https://jsprimer.net/basic/read-eval-print/src/empty/" --output "${currentDir}/img/web-console.png"
