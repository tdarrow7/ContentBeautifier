// declare default variables
let el = null, 
    parentEl = null,
    tree = []

// Declare function that builds a new node tree based on what you clicked on.
function findNodeTree(event) { 
    // if a tree already exists due to a previous click, call the clearNodeTree function
    if (tree.length > 0) {
        clearNodeTree();
    }

    // set variables to elements that you clicked on
    el = event.target;
    parentEl = el.parentNode;

    // Push element into tree array
    setMultipleAttributes(el, { 'data-copy': 'true', 'data-cNode': tree.length });
    tree.push(el);
    // el.setAttribute('data-copy', 'true');
    // el.setAttribute('data-cNode', tree.length);
    while(parentEl && parentEl.nodeName != '#document') {
        parentEl.setAttribute('data-cNode', tree.length);
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
        if (tree[i].hasAttribute('data-copy')) 
            tree[i].removeAttribute('data-copy');
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
    document.body.appendChild(nav);
}


// helper function to set multiple attributes at a time
// note that the function is looking for both an element and a map to be passed as variables
function setMultipleAttributes(el, attrMap) {
    for(let key in attrMap) {
        el.setAttribute(key, attrMap[key]);
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