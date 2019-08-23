// declare default variables
let el = null, 
    parentEl = null,
    tree = [],
    nav = document.createElement('nav'),
    html = document.querySelector('html');
setMultipleAttributes(nav, { 'data-nav': '', 'class': 'data-nav'});

    //hsla(100, 50%, 60%, 1)
// nav.setAttribute('data-nav', '');
// nav.classList += 'data-nav';

// Declare function that builds a new node tree based on what you clicked on.
function findNodeTree(event) { 
    // if a tree already exists due to a previous click, call the clearNodeTree function
    if (tree.length > 0)
        clearNodeTree();
    else {
        html.prepend(nav);
    }

    window.getComputedStyle(html);

    // set variables to elements that you clicked on
    el = event.target;
    parentEl = el.parentNode;

    // Push element into tree array
    setMultipleAttributes(el, { 'data-cbcopy': 'true', 'data-cbnode': tree.length});
    tree.push(el);
    console.log(el.getBoundingClientRect());
    getID();
    while(parentEl && parentEl.nodeName != '#document') {
        setMultipleAttributes(parentEl, { 'data-cbnode': tree.length });
        tree.push(parentEl);
        parentEl = parentEl.parentNode;
    }

    // create visual representation of tree
    createRepresentationOfTree();
}

// clear all data-cbnode and data-cbcopy attributes out of existing tree
function clearNodeTree() {
    // let nav = document.querySelector('[data-nav]');
    // nav.remove();
    nav.innerHTML = '';
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
    let indent = 0.2;
    
    
    for (let i = tree.length - 1; i >= 0; i--) {
        let link = document.createElement('a');
        // setMultipleAttributes(link, { 'data-cbnode': tree[i].getAttribute('data-cbnode'), 'href': 'javascript:void(0)', 'onmouseover': 'moveHoverHighlight(this)' });
        setMultipleAttributes(link, { 'data-findnode': tree[i].getAttribute('data-cbnode'), 'href': 'javascript:void(0)', style: 'margin-left: ' + indent + 'em' });
        link.innerText = '<' + tree[i].nodeName.toString().toLowerCase() + '>';
        nav.append(link);
        indent += 0.2;
        // if(i < tree.length - 1) {
        //     let separator = document.createElement('span');
        //     separator.className += 'separator';
        //     separator.innerText = '>';
        //     nav.prepend(separator)
        // }
    }
    // document.body.appendChild(nav);
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
    let cnodeval = (el).getAttribute('data-findnode'),
        removecopy = document.querySelector("[data-cbcopy]");
    removecopy.removeAttribute("data-cbcopy");
    let newNode = document.querySelector('[data-cbnode="'+ cnodeval +'"]');
    newNode.setAttribute('data-cbcopy','true');
    getID();
}

// listen for click events in the window. On click, call findNodeTree function
window.addEventListener('click', () => {
    event.preventDefault();
    if(!event.target.parentNode.hasAttribute('data-nav') && !event.target.hasAttribute('data-nav'))
        findNodeTree(event);
    else if(event.target.hasAttribute('data-findnode'))
        moveCopyAttribute(event.target);
});