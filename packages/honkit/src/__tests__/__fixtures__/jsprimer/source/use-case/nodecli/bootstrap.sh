#!/bin/bash
declare nodecliDir=$(pwd)
# npm install
cd "${nodecliDir}/argument-parse/src" && npm install
cd "${nodecliDir}/md-to-html/src" && npm install
cd "${nodecliDir}/read-file/src" && npm install
cd "${nodecliDir}/refactor-and-unittest/src" && npm install
