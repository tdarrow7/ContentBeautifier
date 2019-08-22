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
    setMultipleAttributes(el, { 'data-copy': 'true', 'data-cNode': tree.length,  'style': 'background-color:' + hsla});
    hue += 10;
    lightness += 4;
    tree.push(el);
    while(parentEl && parentEl.nodeName != '#document') {
        hsla = 'hsla(' + hue + ',100%,' + lightness + '%,'+ opacity + ')';
        setMultipleAttributes(parentEl, { 'data-copy': 'true', 'data-cNode': tree.length,  'style': 'background-color:' + hsla });
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

// clear all data-cNode and data-copy attributes out of existing tree
function clearNodeTree() {
    let nav = document.querySelector('[data-nav]');
    nav.remove();
    for (let i = 0; i < tree.length; i++) {
        tree[i].removeAttribute('data-cNode');
        // nukeMultipleAttributes(tree[i], { 'data-cNode', '' })
        tree[i].removeAttribute('style');
        if (tree[i].hasAttribute('data-copy')) 
            tree[i].removeAttribute('data-copy');
    }
    // destroy the current tree
    tree = [];
}

// function that builds navigable representation of tree
function createRepresentationOfTree() {
    let nav = document.createElement('nav'),
        header = document.createElement('header');
    nav.setAttribute('data-nav', '');
    nav.classList += 'data-nav';
    header.innerText = 'Click on nodes to highlight';
    for (let i = 0; i < tree.length; i++) {
        let link = document.createElement('a');
        setMultipleAttributes(link, { 'data-cNode': tree[i].getAttribute('data-cNode'), 'href': 'javascript:void(0)' });
        link.innerText = tree[i].nodeName.toString().toLowerCase();
        nav.prepend(link);
        if(i < tree.length - 1) {
            let separator = document.createElement('span');
            separator.className += 'separator';
            separator.innerText = '>';
            nav.prepend(separator)
        }
    }
    nav.prepend(header);
    document.body.appendChild(nav);
}


// helper function to set multiple attributes at a time
// note that the function is looking for both an element and a map to be passed as variables
function setMultipleAttributes(el, attrMap) {
    for(let key in attrMap) {
        el.setAttribute(key, attrMap[key]);
    }
}

// helper function to remove multiple attributes at a time
// note that the function is looking for both an element and a map to be passed as variables
function nukeMultipleAttributes(el, attrMap) {
    for(let key in attrMap) {
        el.removeAttribute(key, attrMap[key]);
    }
}

function moveCopyAttribute(el) {
    console.log(el.nodeName);
}

// listen for click events in the window. On click, call findNodeTree function
window.addEventListener('click', () => {
    event.preventDefault();
    if(!event.target.parentNode.hasAttribute('data-nav') && !event.target.hasAttribute('data-nav'))
        findNodeTree(event);
    else if(event.target.hasAttribute('data-cNode'))
        moveCopyAttribute(event.target);
});