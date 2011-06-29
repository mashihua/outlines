#!/usr/bin/env node

var http = require('http'),
    sys = require('sys'),
    HTML5 = require('html5'),
    jsdom = require('jsdom');

describe("Headings and sections test", function() {
    var window = jsdom.jsdom(null, null, {parser: HTML5}).createWindow(),
        parser = new HTML5.Parser({document: window.document}),
        outlines;
    parser.parse("<body><h1>Foo</h1><h2>Bar</h2><blockquote><h3>Bla</h3></blockquote><p>Baz</p><h2>Quux</h2><section><h3>Thud</h3></section><p>Grunt</p></body>");
    outlines = HTMLOutline(window.document.body);
    
    it('should contant 1 section',function(){
        expect(1).toEqual(outlines.sections.length);
    });
    
    it('the section 1 should 3 sections ',function(){
        expect(3).toEqual(outlines.sections[0].sections.length);
    });
    
    it('this should return h2',function(){
        expect('h2').toEqual(outlines.sections[0].sections[0].heading.tagName.toLowerCase());
    });
    
    it('this should return h3',function(){
        expect('h3').toEqual(outlines.sections[0].sections[2].heading.tagName.toLowerCase());
    });
    
    it('the outline shoud equal',function(){
        expect('<ol><li>Foo<ol><li>Bar</li><li>Quux</li><li>Thud</li></ol></li></ol>').toEqual(outlines.toHTML());
    });
});




describe("hgroup test", function() {
    var window = jsdom.jsdom(null, null, {parser: HTML5}).createWindow(),
        parser = new HTML5.Parser({document: window.document}),
        outlines;
    parser.parse("<body><h1>H1</h1><hgroup><h3>Subheading</h3><h2>H2</h2></hgroup><h1>Other H1</h1></body>");
    outlines = HTMLOutline(window.document.body);
    
    it('should contant 2 section',function(){
        expect(2).toEqual(outlines.sections.length);
    });
    
    it('the section 1 should return h1 ',function(){
        expect('h1').toEqual(outlines.sections[0].heading.tagName.toLowerCase());
    });
    
    it('the section 1 of section 1 should return hgroup ',function(){
        expect('hgroup').toEqual(outlines.sections[0].sections[0].heading.tagName.toLowerCase());
    });
    
    it('the outline shoud equal',function(){
        expect('<ol><li>H1<ol><li>H2</li></ol></li><li>Other H1</li></ol>').toEqual(outlines.toHTML());
    });
});



describe("implied section test", function() {
    var window = jsdom.jsdom(null, null, {parser: HTML5}).createWindow(),
        parser = new HTML5.Parser({document: window.document}),
        outlines;
    parser.parse("<body><h1>A</h1><p>B</p><h2>C</h2><p>D</p><h2>E</h2><p>F</p></body>");
    outlines = HTMLOutline(window.document.body);
    
    it('should contant 1 section',function(){
        expect(1).toEqual(outlines.sections.length);
    });
    
    it('the section 1 should return h1 ',function(){
        expect('h1').toEqual(outlines.sections[0].heading.tagName.toLowerCase());
    });
    
    it('the section 1 of section 1 should return h2 ',function(){
        expect('h2').toEqual(outlines.sections[0].sections[0].heading.tagName.toLowerCase());
    });
    
    it('the outline shoud equal',function(){
        expect('<ol><li>A<ol><li>C</li><li>E</li></ol></li></ol>').toEqual(outlines.toHTML());
    });
});

describe("one more implied section test", function() {
    var window = jsdom.jsdom(null, null, {parser: HTML5}).createWindow(),
        parser = new HTML5.Parser({document: window.document}),
        outlines;
    parser.parse("<body><h4>Apples</h4><p>Apples are fruit.</p><section><h2>Taste</h2><p>They taste lovely.</p><h6>Sweet</h6><p>Red apples are sweeter than green ones.</p><h1>Color</h1><p>Apples come in various colors.</p></section></body>");
    outlines = HTMLOutline(window.document.body);
    
    it('should contant 1 section',function(){
        expect(1).toEqual(outlines.sections.length);
    });
    
    it('the section 1 should return h4',function(){
        expect('h4').toEqual(outlines.sections[0].heading.tagName.toLowerCase());
    });
    
    it('the section 1 of section 1 should return h2 ',function(){
        expect('h2').toEqual(outlines.sections[0].sections[0].heading.tagName.toLowerCase());
    });
    
    it('the section 1 of section 1 should have one section',function(){
        expect(1).toEqual(outlines.sections[0].sections[0].sections.length);
    });
    
    it('the outline shoud equal',function(){
        expect('<ol><li>Apples<ol><li>Taste<ol><li>Sweet</li></ol></li><li>Color</li></ol></li></ol>').toEqual(outlines.toHTML());
    });
});

describe("one more implied section test", function() {
    var window = jsdom.jsdom(null, null, {parser: HTML5}).createWindow(),
        parser = new HTML5.Parser({document: window.document}),
        outlines;
    parser.parse("<body><h4>Apples</h4><p>Apples are fruit.</p><section><h2>Taste</h2><p>They taste lovely.</p><h6>Sweet</h6><p>Red apples are sweeter than green ones.</p><h1>Color</h1><p>Apples come in various colors.</p></section></body>");
    outlines = HTMLOutline(window.document.body);
    
    it('should contant 1 section',function(){
        expect(1).toEqual(outlines.sections.length);
    });
    
    it('the section 1 should return h4',function(){
        expect('h4').toEqual(outlines.sections[0].heading.tagName.toLowerCase());
    });
    
    it('the section 1 of section 1 should return h2 ',function(){
        expect('h2').toEqual(outlines.sections[0].sections[0].heading.tagName.toLowerCase());
    });
    
    it('the section 1 of section 1 should have one section',function(){
        expect(1).toEqual(outlines.sections[0].sections[0].sections.length);
    });
    
    it('the outline shoud equal',function(){
        expect('<ol><li>Apples<ol><li>Taste<ol><li>Sweet</li></ol></li><li>Color</li></ol></li></ol>').toEqual(outlines.toHTML());
    });
});

/*
<section>   
  <h1>Forest elephants</h1>    
  <section>     
    <h2>Introduction</h2>     
    <p>In this section, we discuss the lesser known forest elephants
  </section>   
  <section>     
    <h2>Habitat</h2>
    <P>Forest elephants do not live in trees but among them. 
  </section>
   <aside>
    <p>advertising block
  </aside>
</section>
<footer>
  <p>(c) 2010 The Example company
</footer>
*/