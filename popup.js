// declare default variables
let el = null, 
    parentEl = null,
    tree = [];

    //hsla(100, 50%, 60%, 1)

// Declare function that builds a new node tree based on what you clicked on.
function findNodeTree(event) { 
    // if a tree already exists due to a previous click, call the clearNodeTree function
    if (tree.length > 0) {
        clearNodeTree();
    }

    // set variables to elements that you clicked on
    el = event.target;
    parentEl = el.parentNode;
    let hue = 150,
        lightness = 70,
        opacity = 1,
        hsla = null;

    // Push element into tree array
    //hsla = 'hsla(' + hue + ',100%,' + lightness + '%,'+ opacity + ')';
    hsla = 'hsla(' + hue + ',100%,50%' + opacity + ')';
    // setMultipleAttributes(el, { 'data-cbcopy': 'true', 'data-cbnode': tree.length,  'style': 'background-color:' + hsla});
    setMultipleAttributes(el, { 'data-cbcopy': 'true', 'data-cbnode': tree.length});
    hue += 10;
    lightness += 4;
    tree.push(el);
    getID(el);
    while(parentEl && parentEl.nodeName != '#document') {
        hsla = 'hsla(' + hue + ',100%,' + lightness + '%,'+ opacity + ')';
        // setMultipleAttributes(parentEl, { 'data-cbcopy': 'true', 'data-cbnode': tree.length,  'style': 'background-color:' + hsla });
        setMultipleAttributes(parentEl, { 'data-cbcopy': 'true', 'data-cbnode': tree.length });
        hue += 10;
        lightness += (lightness < 95) ? 4 : 0;
        tree.push(parentEl);
        parentEl = parentEl.parentNode;
    }

    // log the tree temporarily so we can see what we are looking at
    console.log(tree);

    // create visual representation of tree
    createRepresentationOfTree();

    // call text highlight function
    triggerHighlightFunction();
}

// Placeholder function used to call highlighter div
function triggerHighlightFunction() {
    console.log('placeholder');
}

// clear all data-cbnode and data-cbcopy attributes out of existing tree
function clearNodeTree() {
    let nav = document.querySelector('[data-nav]');
    nav.remove();
    for (let i = 0; i < tree.length; i++) {
        tree[i].removeAttribute('data-cbnode');
        // nukeMultipleAttributes(tree[i], { 'data-cbnode', '' })
        tree[i].removeAttribute('style');
        if (tree[i].hasAttribute('data-cbcopy')) 
            tree[i].removeAttribute('data-cbcopy');
    }
    // destroy the current tree
    tree = [];
}

// function that builds navigable representation of tree
function createRepresentationOfTree() {
    let nav = document.createElement('nav');
    nav.setAttribute('data-nav', '');
    nav.classList += 'data-nav';
    for (let i = 0; i < tree.length; i++) {
        let link = document.createElement('a');
        // setMultipleAttributes(link, { 'data-cbnode': tree[i].getAttribute('data-cbnode'), 'href': 'javascript:void(0)', 'onmouseover': 'moveHoverHighlight(this)' });
        setMultipleAttributes(link, { 'data-cbnode': tree[i].getAttribute('data-cbnode'), 'href': 'javascript:void(0)' });
        link.innerText = tree[i].nodeName.toString().toLowerCase();
        nav.prepend(link);
        if(i < tree.length - 1) {
            let separator = document.createElement('span');
            separator.className += 'separator';
            separator.innerText = '>';
            nav.prepend(separator)
        }
    }
    document.body.appendChild(nav);
}


// helper function to set multiple attributes at a time
// note that the function is looking for both an element and a map to be passed as variables
function setMultipleAttributes(el, attrMap) {
    for(let key in attrMap) {
        el.setAttribute(key, attrMap[key]);
    }
}

// Removes exisiting data-cbcopy attr and updates the selected element from breadcrumb popup
function moveCopyAttribute(el) {
    var cnodeval = (el).getAttribute('data-cbnode'),
        removecopy = document.querySelector("body [data-cbcopy]");
    removecopy.removeAttribute("data-cbcopy");
    let newNode = document.querySelector('[data-cbnode="'+cnodeval+'"]');
    newNode.setAttribute('data-cbcopy','true');
    getID(newNode);
}

// listen for click events in the window. On click, call findNodeTree function
window.addEventListener('click', () => {
    event.preventDefault();
    if(!event.target.parentNode.hasAttribute('data-nav') && !event.target.hasAttribute('data-nav'))
        findNodeTree(event);
    else if(event.target.hasAttribute('data-cbnode'))
        moveCopyAttribute(event.target);
});