#! /usr/bin/env node

require("../lib/src/bin.js")
    .run()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
