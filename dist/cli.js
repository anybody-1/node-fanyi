#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var main_1 = require("./main");
commander_1.program
    .version("0.0.1")
    .name("fy")
    .usage("<english>")
    .arguments("<Word>")
    .action(function (word) {
    main_1.translate(word);
});
commander_1.program.parse(process.argv);
