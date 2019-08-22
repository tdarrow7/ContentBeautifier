let el = null, 
    parentEl = null,
    tree = [];

function myFunction(event) { 
    el = event.target;
    tree = [];
    parentEl = el.parentNode;
    tree.push(el);
    while(parentEl) {
        tree.push(parentEl);
        parentEl = parentEl.parentNode
    }
    console.log(tree);
    for (let i = 1; i < tree.length; i++) {
        tree[i].setAttribute('data-cNode', i);
        if (i == 1) 
            tree[i].setAttribute('data-copy', 'true');
    }
    triggerHighlightFunction();
}

function triggerHighlightFunction() {
    console.log('placeholder');
}

window.addEventListener('click', () => {
    event.preventDefault();
    myFunction(event);
});
