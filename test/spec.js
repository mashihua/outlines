#!/usr/bin/env node


var path = require('path');
var fs  = require('fs');
var sys = require('sys');
require.paths.unshift(path.join(path.dirname(fs.realpathSync(__filename)), 'lib'));
var jasmine = require('jasmine-node');
var	jsdom = require('jsdom');


var SPEC_FOLDER = path.join(path.dirname(fs.realpathSync(__filename)),'../js'),
    HELPER_MATCHER_REGEX= ".+\.js",
		SPEC_MATH = ".+\.js",
		FILE = process.argv[2];
		
if(FILE) {
	if(fs.statSync(FILE).isFile()){
		HELPER_MATCHER_REGEX = path.basename(FILE,'.js').replace("_spec","\.js$");
		SPEC_MATH =  path.basename(FILE);
	}
} 


for (var key in jasmine)
  global[key] = jasmine[key];

var isVerbose = false;
var showColors = true;

jasmine.loadHelpersInFolder(SPEC_FOLDER, HELPER_MATCHER_REGEX);

jasmine.executeSpecsInFolder(path.join(path.dirname(fs.realpathSync(__filename)),'spec'), function(runner, log){
  if (runner.results().failedCount == 0) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}, isVerbose, showColors,SPEC_MATH);



