#!/usr/bin/env node
import { program } from "commander";
import { translate } from "./main";
program
  .version("0.0.1")
  .name("fy")
  .usage("<english>")
  .arguments("<Word>")
  .action(function (word) {
    translate(word);
  });
program.parse(process.argv);
