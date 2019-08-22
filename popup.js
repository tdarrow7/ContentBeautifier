let el = null, 
    parentEl = null,
    tree = [];

function findNodeTree(event) { 
    if (tree.length != 0)
        clearNodeTree();
    el = event.target;
    parentEl = el.parentNode;
    tree.push(el);
    while(parentEl) {
        tree.push(parentEl);
        parentEl = parentEl.parentNode
    }
    console.log(tree);
    for (let i = 0; i < tree.length - 1; i++) {
        tree[i].setAttribute('data-cNode', i);
        if (i == 0) 
            tree[i].setAttribute('data-copy', 'true');
    }
    triggerHighlightFunction();
}

function triggerHighlightFunction() {
    console.log('placeholder');
}

function clearNodeTree() {
    for (let i = 0; i < tree.length - 1; i++) {
        tree[i].removeAttribute('data-cNode');
        if (i == 0) 
            tree[i].removeAttribute('data-copy');
    }
    tree = [];
}

window.addEventListener('click', () => {
    event.preventDefault();
    findNodeTree(event);
});
