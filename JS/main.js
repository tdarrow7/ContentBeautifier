// declare default variables
let el = null,
    parentEl = null,
    tree = [],
    html = document.querySelector("html"),
    altIsPressed = false,
    ctrlIsPressed = false,
    cbExists = false,
    previewContainer = null,
    elementHighlighter = null,
    hoverHighlighter = null,
    highlighterButtons = null,
    navBar = null,
    coordinates = [];

function getPositionOfElement(el) {
    let bodyRect = document.body.getBoundingClientRect(),
        elemRect = el.getBoundingClientRect(),
        height = el.offsetHeight,
        width = el.offsetWidth,
        top = elemRect.top - bodyRect.top,
        left = elemRect.left - bodyRect.left;

    coordinates = { height, width, left, top };
}

function moveHighlightAndButtons() {
    changeElementHighlightPosition(elementHighlighter);
    updateButtonPosition();
}

function updateButtonPosition() {
    let { height, width, left, top } = coordinates;
    var styleString =
        "visibility: visible !important; opacity: 1 !important; top: " +
        (top + height + 10) +
        "px; left: " +
        (left + width - 263) +
        "px"; // 263 is width of button module

    highlighterButtons.setAttribute('style', styleString);
}

function checkIfScrollingIsNeeded() {
    const top = coordinates[3],
        bodyRect = document.body.getBoundingClientRect(),
        bodyTop = bodyRect.top * -1;

    if (top - bodyTop < 200)
        window.scroll({
            top: bodyTop - 350,
            left: 0,
            behavior: "smooth"
        });
    else if (top - bodyTop > 600)
        window.scroll({
            top: bodyTop + 350,
            left: 0,
            behavior: "smooth"
        });
}

// Declare function that builds a new node tree based on what you clicked on.
function buildnodeTree(event) {

    console.log('within buildNodeTree function');
    // if a tree already exists due to a previous click, call the refreshDomAndPreview function
    if (tree.length > 0) {
        resetVirtualDomTree();
        clearVirtualDom();
    }
    window.getComputedStyle(html);
    // set variables to elements that you clicked on
    el = event.target;
    parentEl = el.parentNode;

    // Push element into tree array
    setMultipleAttributes(el, {
        "data-cbcopy": "true",
        "data-cbnode": tree.length
    });
    tree.push(el);
    getPositionOfElement(el);
    moveHighlightAndButtons();
    checkIfScrollingIsNeeded();
    while (parentEl && parentEl.nodeName != "#document") {
        parentEl.setAttribute('data-cbnode', tree.length);
        tree.push(parentEl);
        parentEl = parentEl.parentNode;
    }

    // create visual representation of tree
    fillVirtualDomWithNodes();
    console.log('end of buildNodeTree function');
}

// clear all data-cbnode and data-cbcopy attributes out of existing tree
function resetVirtualDomTree() {
    for (let i = 0; i < tree.length; i++) {
        removeMultipleAttributes(tree[i],['data-cbnode', 'style'])
        if (tree[i].hasAttribute("data-cbcopy"))
            tree[i].removeAttribute("data-cbcopy");
    }
    // destroy the current tree
    tree = [];
}

function clearVirtualDom() {
    const navDiv = document.querySelector('.data-nav .nav-div');
    navDiv.innerHTML = '';
}

// function that builds navigable representation of tree
function fillVirtualDomWithNodes() {
    let indent = 0,
        navContainer = document.querySelector('.nav-div');

    for (let i = tree.length - 1; i >= 0; i--) {
        let link = document.createElement("a");
        setMultipleAttributes(link, {
            "data-findnode": tree[i].getAttribute("data-cbnode"),
            href: "javascript:void(0)",
            style:
                "margin-left: " + indent + "em; transform: translateX(-" + indent + "em"
        });
        link.innerText = "<" + tree[i].nodeName.toString().toLowerCase() + ">";
        if (i == 0) link.classList.add("active");
        navContainer.append(link);
        indent += 0.2;
    }
}

function setMultipleAttributes(el, attrMap) {
    for (let key in attrMap) {
        el.setAttribute(key, attrMap[key]);
    }
}

// cycle through all items with classes and remove the classes
function removeMultipleAttributes(nodeArray, [attrNames]) {
	let elmArray = Array.prototype.slice.call(nodeArray);
	for (let i = 0; i < elmArray.length; i++) {
		for (let j = 0; j < attrNames.length; j++){
			elmArray[i].removeAttribute(attrNames[j]);
		}
    }
}

// Removes exisiting data-cbcopy attr and updates the selected element from breadcrumb popup
function moveCopyAttribute(el) {
    let cnodeval = el.getAttribute("data-findnode"),
        removecopy = document.querySelector("[data-cbcopy]"),
        currentActiveFindNode = document.querySelector("[data-findnode].active");
    currentActiveFindNode.classList.remove("active");
    el.classList.add("active");
    removecopy.removeAttribute("data-cbcopy");
    removecopy.classList.remove("active");
    let newNode = document.querySelector('[data-cbnode="' + cnodeval + '"]');
    newNode.setAttribute("data-cbcopy", "true");
    getPositionOfElement(newNode);
    moveHighlightAndButtons();
}

function copyFunction(){
    // checks to see if extension is enabled
    let nodeCheck = document.querySelector('[data-cbcopy="true"]'),
        previewBox = document.querySelector('.previewBox');
    if (nodeCheck){

        copySwitch();
        clearPreview();
        fillPreview();
    
        // copy contents to clipboard
        if (document.body.createTextRange){
            range = document.body.createTextRange();
            range.moveToElementText(previewBox.firstChild);
            range.select();
            document.execCommand('copy');
        }
        else if (window.getSelection){
            selection = window.getSelection();
            range = document.createRange();
            range.selectNodeContents(previewBox.firstChild);
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand('copy');
            downloadAllItems(downloadArray.length - 1);
        }
        else
        alert('Copy Unsuccessful');
    }
}
// Start of PreviewBox Manipulation Functions
function clearPreview(){
    let previewBox = document.querySelector('.previewBox');
    previewBox.innerHTML = "";
}

function fillPreview(){
    let temp = document.querySelector('[data-cbcopy="true"]').cloneNode(true);
    let previewBox = document.querySelector('.previewBox');
    previewBox.appendChild(temp);
    resetDownloadErrorArrays();
    reformatEverythingEverywhere(temp);
}
// End of PreviewBox Manipulation Functions

function copySwitch(){
    let allCopy = document.querySelectorAll("a.copy");
    for (let i = 0; i < allCopy.length; i++){
        allCopy[i].innerHTML = "Copied";
    }
    setTimeout(function copiedToCopy(){
        let allCopied = document.querySelectorAll("a.copy");
        for (let i = 0; i < allCopied.length; i++){
            allCopied[i].innerHTML = "Copy";
        }
    }, 3000);
}

function doesElementExist(query) {
    let el = document.querySelector(query);
    return (el != null) ? true : false;
}

function changeElementHighlightPosition(highlighter) {
  let { height, width, left, top } = coordinates;
  var styleString =
    "visibility: visible !important; opacity: 1 !important; height: " +
    (height + 4) +
    "px; width: " +
    (width + 4) +
    "px; left: " +
    (left - 2) +
    "px; top: " +
    (top - 2) +
    "px";
  setMultipleAttributes(highlighter, {
    class: "cb highlighter",
    style: styleString,
    "data-cbspecial": ""
  })
}

function createBeautifierElements() {
    createHighlighters();
    previewContainer = createPreviewContainer();
    navBar = createVirtualDom();
    cbExists = true;
}

function createHighlighters() {
    elementHighlighter = createHighlighter();
    hoverHighlighter = createHighlighter();
    hoverHighlighter.classList.add('hover');
    highlighterButtons = createButtonModule();
    highlighterButtons.classList.add('highlighter-btns')
    document.body.append(highlighterButtons);
}

function createHighlighter() {
    var highlighter = document.createElement('div');
    setMultipleAttributes(highlighter, {
        class: 'cb highlighter',
        'data-cbspecial': ''
    });
    document.body.append(highlighter);
    return highlighter;
}

function createPreviewContainer(){
    // verify that previewContainer doesn't exist before building a new one.
    if (document.querySelector('.previewContainer') != null) return;
    let container = document.createElement("div"),
        box = document.createElement('div'),
        closeIcon = document.createElement("span");

    // sets attributes for previewContainer, previewBox, and span elements
    setMultipleAttributes(container, { 
        "previewContainer": "", 
        'data-cbspecial': '',
        class: "previewContainer" });
    setMultipleAttributes(box, { 
        "previewBox": "", 
        'data-cbspecial': '',
        class: "previewBox" });
    setMultipleAttributes(closeIcon, { 
        "previewClose": "", 
        'data-cbspecial': '',
        class: "previewClose" });
    
    // appends elements to previewContainer
    container.append(closeIcon);
    container.append(box);
    container.append(createCopyButton());

    // prepends previewContainer to HTML
    document.body.append(container);
    return container;
}

function createButtonModule() {
    const buttonDiv = document.createElement('div');
    setMultipleAttributes(buttonDiv, {
        class: 'btn-container',
        'data-cbspecial': ''
    })
    buttonDiv.appendChild(createPreviewButton());
    buttonDiv.appendChild(createCopyButton());
    return buttonDiv;
}

function createCopyButton() {
    let button = document.createElement("a");
    setMultipleAttributes(button, {
        class: 'cb-btn v1 copy',
        'data-cbspecial': '',
        href: 'javascript:void(0)'
    });
    button.innerText = 'Copy';
    return button;
}

function createPreviewButton() {
    let button = document.createElement("a");
    setMultipleAttributes(button, {
        class: 'cb-btn v2 preview',
        'data-cbspecial': '',
        href: 'javascript:void(0)'
    });
    button.innerText = 'Preview';
    return button;
}

// creates and prepends a nav to the HTML DOM
// return [nav, navDiv] nodes if used elsewhere
function createVirtualDom(){
    let nav = document.createElement("nav"),
        navDiv = document.createElement("div");
        
    setMultipleAttributes(nav, { "data-nav": "", class: "cb data-nav" });
    setMultipleAttributes(navDiv, { "nav-div": "", class: "cb nav-div" });

    nav.append(navDiv);
    nav.append(createButtonModule());
    document.body.append(nav);
    return nav;
}

function destroyBeautifierElements() {
    destroyHighlighters();
    destroyPreviewContainer();
    destroyVirtualDom();
    coordinates = []
    cbExists = false;
}

function destroyHighlighters() {
    elementHighlighter.remove();
    hoverHighlighter.remove();
    highlighterButtons.remove();
}

function destroyPreviewContainer() {
    previewContainer.remove();
}

function destroyVirtualDom() {
    // refreshDomAndPreview();
    resetVirtualDomTree()
    navBar.remove();
}

// listen for click events in the window. On click, call buildnodeTree function
window.addEventListener("click", () => {

    if (!event.target.parentNode.hasAttribute("data-cbspecial") && altIsPressed) {
        // check if content beautifier is already running
        if (!cbExists)
            createBeautifierElements();
        buildnodeTree(event);
    }
    if (event.target.hasAttribute("data-findnode"))
        moveCopyAttribute(event.target);
    if (event.target.classList.contains('preview')) {
        clearPreview();
        fillPreview();

        html.classList.add("previewClicked");
    }
    if (event.target.classList.contains('copy'))
        copyFunction();
    if (event.target.classList.contains('previewContainer') || event.target.classList.contains('previewClose'))
        html.classList.remove("previewClicked");
});

// when window is inactive/out of focus
window.addEventListener("blur", () => {
    altIsPressed = false;
    ctrlIsPressed = false;
});

document.onkeydown = function (e) {
    e = e || window.event;
    let code = e.code.toString();
    if (code == 'ControlLeft' || code == 'ControlRight')
        ctrlIsPressed = true;
    if (code == 'AltLeft' || code == 'AltRight')
        altIsPressed = true;
    
    // Esc is pressed

    if (code == "Escape"){
        if (html.classList.contains("previewClicked"))
            html.classList.remove("previewClicked");
        else
            destroyBeautifierElements();
    }
    if (ctrlIsPressed && code == "KeyC")
        // Ctrl + C
        copyFunction();
}

document.onkeyup = function (e) {
    e = e || window.event;
    let code = e.code.toString();
    if (code == 'ControlLeft' || code == 'ControlRight')
        ctrlIsPressed = false;
    if (code == 'AltLeft' || code == 'AltRight')
        altIsPressed = false;
}