#!/usr/bin/env node
let SpecReporter = require('jasmine-spec-reporter').SpecReporter;
var path = require('path'),
    Command = require('../node_modules/jasmine/lib/command.js'),
    Jasmine = require('../node_modules/jasmine/lib/jasmine.js');

var jasmine = new Jasmine({ projectBaseDir: path.resolve() });
jasmine.addReporter(new SpecReporter({  // add jasmine-spec-reporter
  spec: {
    displayPending: true
  }
}));
var examplesDir = path.join(path.dirname(require.resolve('jasmine-core')), 'jasmine-core', 'example', 'node_example');
var command = new Command(path.resolve(), examplesDir, console.log);

command.run(jasmine, process.argv.slice(2));
