#!/usr/bin/env node

var http = require('http'),
	sys = require('sys'),
	request = require('request'),
	HTML5 = require('html5'),
  Script = process.binding('evals').Script,
  fs = require('fs'),
  jsdom = require('jsdom'),
  window = jsdom.jsdom(null, null, {parser: HTML5}).createWindow(),
	parser = new HTML5.Parser({document: window.document});
	
parser.parse("<body><h1>Page title</h1><hgroup><h3>Subheading</h3><h2>Test</h2></hgroup><h1>One more H1</h1></body>");
console.log(HTML5Outline(window.document.body).sections);
/*
describe("array test", function() {
	it('test Array.prototype.indexOf function with return value -1',function(){
			expect(-1).toEqual([1,2,3,4,5,6].indexOf(9));
	});
	
	it('test Array.prototype.indexOf function',function(){
			expect(3).toEqual([1,2,3,4,5,6].indexOf(4));
	});

	it('test Array.prototype.indexOf function with formIndex',function(){
			expect(4).toEqual([1,2,3,4,5,6].indexOf(5,3));
	});
});
*/
//sys.puts(window.document.innerHTML);