// declare default variables
let el = null,
    parentEl = null,
    tree = [],
    nav = document.createElement("nav"),
    navDiv = document.createElement("div"),
    html = document.querySelector("html"),
    divContainer = document.createElement("div"),
    preview = document.createElement("div"),
    close = document.createElement("a"),
    span = document.createElement("span"),
    ctrlIsPressed = false,
    buttonDiv = document.createElement("div"),
    previewButton = document.createElement("a"),
    copyButton = document.createElement("a");

setMultipleAttributes(nav, { "data-nav": "", class: "data-nav" });
setMultipleAttributes(navDiv, { "nav-div": "", class: "nav-div" });
setMultipleAttributes(preview, { "previewBox": "", class: "previewBox" });
setMultipleAttributes(divContainer, { "previewContainer": "", class: "previewContainer" });
setMultipleAttributes(span, { "previewClose": "", class: "previewClose" });
setMultipleAttributes(close, { "previewClose": "", class: "previewClose" });
copyButton.setAttribute("class", "cb-btn v2 copy");
previewButton.setAttribute("class", "cb-btn v1 preview");

previewButton.innerText = "Preview";
copyButton.innerText = "Copy";

buttonDiv.appendChild(previewButton);
buttonDiv.appendChild(copyButton);
document.body.appendChild(buttonDiv);

span.append(close);
divContainer.append(span);
divContainer.append(preview);
divContainer.append(copyButton.cloneNode(true));

function changePosition(el) {
    var arr = getPosition(el);
    changeHighlightPosition(arr);
    changePageButtonPosition(arr);
}

function getPosition(el) {
    let bodyRect = document.body.getBoundingClientRect(),
        elemRect = el.getBoundingClientRect(),
        height = el.offsetHeight,
        width = el.offsetWidth,
        top = elemRect.top - bodyRect.top,
        left = elemRect.left - bodyRect.left;

    checkScrollPositon(top, bodyRect.top * -1);

    let arr = { height, width, left, top }
    return arr;
}

function checkScrollPositon(top, bodyTop) {
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

function setMultipleAttributes(el, attrMap) {
    for (let key in attrMap) {
        el.setAttribute(key, attrMap[key]);
    }
}

// Declare function that builds a new node tree based on what you clicked on.
function findNodeTree(event) {
    // if a tree already exists due to a previous click, call the clearNodeTree function
    if (tree.length > 0) clearNodeTree();
    else {
        html.prepend(nav);
        nav.append(navDiv);
        addNavButton();
        html.prepend(divContainer);
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
    console.log(el.getBoundingClientRect());
    changePosition(el);
    while (parentEl && parentEl.nodeName != "#document") {
        setMultipleAttributes(parentEl, { "data-cbnode": tree.length });
        tree.push(parentEl);
        parentEl = parentEl.parentNode;
    }

    // create visual representation of tree
    createRepresentationOfTree();
}

// clear all data-cbnode and data-cbcopy attributes out of existing tree
function clearNodeTree() {
    navDiv.innerHTML = "";
    preview.innerHTML = "";
    for (let i = 0; i < tree.length; i++) {
        tree[i].removeAttribute("data-cbnode");
        tree[i].removeAttribute("style");
        if (tree[i].hasAttribute("data-cbcopy"))
            tree[i].removeAttribute("data-cbcopy");
    }
    // destroy the current tree
    tree = [];
}

// function that builds navigable representation of tree
function createRepresentationOfTree() {
    let indent = 0;

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
        navDiv.append(link);
        indent += 0.2;
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
    changePosition(newNode);
}

// when window is inactive/out of focus
window.addEventListener("blur", () => {
    ctrlIsPressed = false;
});

// listen for click events in the window. On click, call findNodeTree function
window.addEventListener("click", () => {

    if (
        !event.target.parentNode.hasAttribute("data-nav")
        && !event.target.hasAttribute("data-nav")
        && !event.target.parentNode.hasAttribute("nav-div")
        && !event.target.hasAttribute("data-cbspecial")
    )
    if (ctrlIsPressed){
        findNodeTree(event);
    }
    if (event.target.hasAttribute("data-findnode"))
        moveCopyAttribute(event.target);
    if (event.target.classList.contains('preview')) {
        clearPreview();
        fillPreview();

        html.classList.add("previewClicked");
    }
    if (event.target.classList.contains('copy')) {
        copyFunction();
    }
    if (event.target.classList.contains('previewContainer') || event.target.classList.contains('previewClose')) {
        html.classList.remove("previewClicked");
    }
});

document.onkeydown = function (e) {
    e = e || window.event;
    let code = e.code.toString();
    if (code == 'ControlLeft' || code == 'ControlRight'){
        ctrlIsPressed = true;
        
    }
    // Esc is pressed

    if (e.code.toString() == "Escape"){
        if (html.classList.contains("previewClicked")){
            html.classList.remove("previewClicked");
        }
        else {
            document.querySelector("div.highlighter").setAttribute("style", "");
            document.querySelector("div.btn-container").setAttribute("style", "");

            // reset innerHTML, prevent addition of extra elements on rebuild 
            document.querySelector("nav.data-nav").innerHTML = "";
            document.querySelector("nav.data-nav").remove();
            clearNodeTree();
        }
    }
    if (ctrlIsPressed){
        // Ctrl + C
        if (e.code.toString() == "KeyC"){
            copyFunction();
        }
    }
}

document.onkeyup = function (e) {
    e = e || window.event;
    let code = e.code.toString();
    if (code == 'ControlLeft' || code == 'ControlRight')
        ctrlIsPressed = false;
}

function copyFunction(){

    // checks to see if extension is enabled
    let nodeCheck = document.querySelector('[data-cbcopy="true"]');
    if (nodeCheck){

        copySwitch();
        clearPreview();
        fillPreview();
    
        // copy contents to clipboard
        if (document.body.createTextRange){
            range = document.body.createTextRange();
            range.moveToElementText(preview.firstChild);
            range.select();
            document.execCommand('copy');
        }
        else if (window.getSelection){
            selection = window.getSelection();
            range = document.createRange();
            range.selectNodeContents(preview.firstChild);
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand('copy');
        }
        else {
        alert('Copy Unsuccessful');
        }
    }

}
// Start of PreviewBox Manipulation Functions
function clearPreview(){
    preview.innerHTML = "";
}

function fillPreview(){
    let temp = document.querySelector('[data-cbcopy="true"]').cloneNode(true);
    preview.appendChild(temp);
    reformatEverythingEverywhere(temp);
}
// End of PreviewBox Manipulation Functions

function changePageButtonPosition(arr) {
    let { height, width, left, top } = arr;
    console.log('top: ' + top);
    console.log('left: ' + left);
    console.log('width: ' + width);
    console.log('height: ' + height);
    var styleString =
        "visibility: visible !important; opacity: 1 !important; top: " +
        (top + height + 10) +
        "px; left: " +
        (left + width - 263) +
        "px"; // w67 is width of button module

    setMultipleAttributes(buttonDiv, {
        class: "btn-container",
        "data-cbcopy": "single",
        style: styleString
    })

    console.log("changePageButtonPosition ran");
}

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



function addNavButton() {
    let navButtonDiv = document.createElement("div"),
        dataNav = document.querySelector(".data-nav"),
        navPreviewButton = document.createElement("a"),
        navCopyButton = document.createElement("a");

    navPreviewButton.innerText = "Preview";
    navCopyButton.innerText = "Copy";

    navPreviewButton.setAttribute("class", "cb-btn v1 preview");
    navCopyButton.setAttribute("class", "cb-btn v2 copy");
    navButtonDiv.setAttribute("class", "nav-btn-container");

    navButtonDiv.appendChild(navPreviewButton);
    navButtonDiv.appendChild(navCopyButton);

    dataNav.appendChild(navButtonDiv);
    console.log("addNavButton ran");
}