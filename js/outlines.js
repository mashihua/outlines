
(function(){
/*
Section class
*/

function Section(node){
    this.sections = [];
    this.node = node;
    this.heading = false;
}

Section.prototype.append = function(what){
    what.container = this;
    this.sections.push(what);
}

Section.prototype.toHTML = function(anchor){
    var value =  headingText(this.heading);
      if (anchor) {
          value = '<a href="#'+getId(this.node)+'">'+ value + '</a>';
      }
      return value + sectionToHTML(this.sections, anchor);

    return (value=='' ? value : '<ol>'+value+'</ol>');
}

function headingText(heading){
    if (isHeading(heading)) {
        if (getTagName(heading) == 'hgroup') {
            heading = heading.getElementsByTagName('h'+(-getHeadingRank(heading)))[0];
        }
        return heading.textContent || heading.innerText || "<i>No text inside "+heading.nodeName+"</i>";
    }
    return ""+haeding;
}

function sectionToHTML(sections, anchor){
    var value = '';
    for (var i=0; i < sections.length; i++) {
        value += '<li>'+sections[i].toHTML(anchor)+'</li>';
    }
    return (value=='' ? value : '<ol>'+value+'</ol>');
}


function getId(ele){
    var id = ele.getAttribute('id');
    if (id){
       return id; 
    }
    id = 'outlines-' + (Math.random() * (1 << 16)).toString(8).replace('.', '');
    ele.setAttribute('id', id);
    return id;
}
/*
get function to check element is in a categories
*/

function getChecker(reg){
    return function(ele){
        return ele && ele.tagName && reg.test(getTagName(ele));
    }
}

/*
get lower case element tag name
*/

function getTagName(ele){
    return ele.tagName.toLowerCase(); 
}

/*
get highest-ranked for heading content element.
*/

function getHeadingRank(ele){
    var name = getTagName(ele);
    if(name === 'hgroup'){
        for (var i = 1; i <= 6; i++) {
            if (ele.getElementsByTagName('H' + i).length > 0) {
                return -i;
            }
        }
    }else{
        return -parseInt(name.substr(1));
    }
}

/*
get last section from sections
*/

function getLastSection(sections){
    return sections[sections.length - 1];
}


/*
get rank form section
*/
function sectionHeadingRank(section){
    var heading = section.heading;
    return isHeading(heading) 
                    ? getHeadingRank(heading) 
                    : 1; 
}


var current_outline = null,
    current_section = null,
    stack = [],
    isHeading = getChecker(/^h[1-6]|hgroup$/i),
    isSectioningContent = getChecker(/^article|aside|nav|section$/i),
    isSectioningRoot = getChecker(/^blockquote|body|details|fieldset|figure|td$/i);

/*
entering an element
*/

function enter(ele){
    
    //If the top of the stack is a heading content element,do nothing.
    if(isHeading(stack[stack.length - 1])){
        return;
    }
    
    //When entering a sectioning content element or a sectioning root element
    if (isSectioningContent(ele) || isSectioningRoot(ele)) {
        //If current outlinee is not null, and the current section has no heading, 
        if (current_outline !== null && !current_section.heading) {
    
            //create an implied heading,let that be the heading for the current section.
            current_section.heading = current_section;
        }

        //If current outlinee is not null, push current outlinee onto the stack.
        if (current_outline !== null) {
          stack.push(current_outline);
        }
        
        //Let current outlinee be the element that is being entered.
        current_outline = ele;

        //Let current section be a newly created section for the current outlinee element.
        //Associate current outlinee with current section.
        current_section = new Section(ele);
        //Let there be a new outline for the new current outlinee, 
        //initialized with just the new current section as the only section in the outline.
        current_outline.outline = {
        sections: [current_section], 
        node: ele , 
        toHTML:function(anchor){
            return sectionToHTML(this.sections,anchor);
            }
        };
        return;
    }
    
    //If the current outlinee is null,do nothing
    if (current_outline === null){
        return;
    }
    
    // When entering a heading content element
    if (isHeading(ele)) {

        //If the current section has no heading, let the element being entered be the heading for the current section.
        if (!current_section.heading) {
    
        current_section.heading = ele;
        
        // Otherwise, if the element being entered has a rank equal to or greater than the heading of the last section of the outline of the current outlinee, 
        }else if (getHeadingRank(ele) >= sectionHeadingRank(getLastSection(current_outline.outline.sections))){
        
            // create a new section 
            var section = new Section(ele);
            
            //append it to the outline of the current outlinee element
            current_outline.outline.sections.push(section);
            
            //Let current section be that new section. 
            current_section = section;
            
            //Let the element being entered be the new heading for the current section.
            current_section.heading = ele;
        // Otherwise, run these substeps:
        } else {
            
            //Let candidate section be current section. 
            var abort = false,
                candidate_section = current_section;
                
            do{
                //If the element being entered has a rank  lower than the rank of the heading of the candidate section
                if (getHeadingRank(ele) < sectionHeadingRank(candidate_section)) {
                    
                    //append it to candidate section.
                    var section = new Section(ele);
    
                    // and append it to candidate section.(This does not change which section is the last section in the outline.)
                    candidate_section.append(section);
                    
                    // Let current section be this new section.
                    current_section = section;
                    
                    // Let the element being entered be the new heading for the current section.
                    current_section.heading = ele;
                    
                    // Abort these substeps.
                    abort = true;
                }
                
                // Let new candidate section be the section that contains candidate section in the outline of current outlinee.
                var new_candidate_section = candidate_section.container;
                    
                //Let candidate section be new candidate section.
                candidate_section = new_candidate_section;
                    
            //Return to step 2.
            }while(!abort)
            
        }
        // Push the element being entered onto the stack.
        stack.push(ele);
    }
    //Otherwise,do nothing. 
}


/*
exiting an element
*/

function exit(ele){
    
    // If the top of the stack is an element, and you are exiting that element
    //         Note:The element being exited is a heading content element.
    // Pop that element from the stack.
    var stackTop = stack[stack.length - 1];
    if (isHeading(stackTop)) {
        if (stackTop == ele) {
            stack.pop();
        }
        return;
    }
    
    //When exiting a sectioning content element, if the stack is not empty
    if (isSectioningContent(ele) && stack.length > 0) {
        
        //Pop the top element from the stack, and let the current outlinee be that element.
        current_outline = stack.pop();
        
        //Let current section be the last section in the outline of the current outlinee element.
        current_section = getLastSection(current_outline.outline.sections);
            
        // Append the outline of the sectioning content element being exited to the current section. (This does not change which section is the last section in the outline.)
        for (var i = 0, sections = ele.outline.sections, len = sections.length; i < len; i++) {
            current_section.append(sections[i]);
        }
        return;
  }
    
    //When exiting a sectioning root element, if the stack is not empty
    if( isSectioningRoot(ele) && stack.length ){
        
        //Pop the top element from the stack, and let the current outlinee be that element. 
        current_outline = stack.pop();
        //Let current section be the last section in the outline of the current outlinee element. 
        current_section = getLastSection(current_outline.outline.sections);
        
        //Finding the deepest child: If current section has no child sections, stop these steps. 
        while(current_section.length){
                        
            // Let current section be the last child section of the current current section.
            current_section = getLastSection(current_section);
                
        // Go back to the substep labeled finding the deepest child.
        }
        
    }
    
    // When exiting a sectioning content element or a sectioning root element
    //     Note:The current outlinee is the element being exited.
    if (isSectioningContent(ele) || isSectioningRoot(ele)) {
        // Let current section be the first section in the outline of the current outlinee element.
        current_section = current_outline.outline.sections[0];
         
        // Skip to the next step in the overall set of steps. (The walk is over.)
        return;
    }
    
    // If the current outlinee is null, do nothing
}


/*
Treenode Walker
*/

function treeNodeWalker(root, enter, exit) {
  var node = root;
  start: while (node) {
    enter(node);
    if (node.firstChild) {
      node = node.firstChild;
      continue start;
    }
    while (node) {
      exit(node);
      if (node.nextSibling) {
        node = node.nextSibling;
        continue start;
      }
      if (node == root) {
              node = null;
          }else {
              node = node.parentNode;
          }
    }
  }
}


function HTMLOutline(root){
    current_outline = null,current_section = null,stack = [];
    treeNodeWalker(root,enter,exit);
    return current_outline ? current_outline.outline : null;;
}

if(this.exports != undefined)
    exports.HTMLOutline = HTMLOutline;
else
    this.HTMLOutline = HTMLOutline;
}());