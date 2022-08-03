#!/usr/bin/env zx
"use strict";
const isCode = process.argv.slice(-1)[0];
if (isCode) {
    await $ `code ~/Documents/work/oc/markdown-notes/markdown`;
}
else {
    await $ `cd ~/Documents/work/oc/markdown-notes/markdown && yarn start -p 3333`;
}
