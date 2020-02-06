// declare default variables
let el = null,
  parentEl = null,
  tree = [],
  html = document.querySelector("html"),
  altIsPressed = false,
  ctrlIsPressed = false,
  cbExists = false,
  canCreateCB = false,
  previewContainer = null,
  elementHighlighter = null,
  hoverHighlighter = null,
  highlighterButtons = null,
  navBar = null,
  coordinates = [];

// function used to get position of element specified as variable passed in
function getPositionOfElement(el) {
  let bodyRect = document.body.getBoundingClientRect(),
    elemRect = el.getBoundingClientRect(),
    height = el.offsetHeight,
    width = el.offsetWidth,
    top = elemRect.top - bodyRect.top,
    left = elemRect.left - bodyRect.left;

  // set coordinate values
  coordinates = { height, width, left, top };
}

// function to trigger the repositioning of highlighter and buttons
function moveHighlightAndButtons() {
  changeElementHighlightPosition(elementHighlighter);
  updateButtonPosition();
}

// function to specifically move button module to bottom of elementHighlighter
function updateButtonPosition() {
  let { height, width, left, top } = coordinates;
  var styleString =
    "visibility: visible !important; opacity: 1 !important; top: " +
    (top + height + 10) +
    "px; left: " +
    (left + width - 263) +
    "px"; // 263 is width of button module

  highlighterButtons.setAttribute("style", styleString);
}

// check to see if we need to scroll in order to get elementHighlighter more into focus
function checkIfScrollingIsNeeded() {
  let bodyRect = document.body.getBoundingClientRect(),
    bodyTop = bodyRect.top * -1;

  if (coordinates.top - bodyTop < 200)
    window.scroll({
      top: bodyTop - 350,
      left: 0,
      behavior: "smooth"
    });
  else if (coordinates.top - bodyTop > 600)
    window.scroll({
      top: bodyTop + 350,
      left: 0,
      behavior: "smooth"
    });
}

// Declare function that builds a new node tree based on what you clicked on.
function buildnodeTree(event) {
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
    parentEl.setAttribute("data-cbnode", tree.length);
    tree.push(parentEl);
    parentEl = parentEl.parentNode;
  }

  // create visual representation of tree
  fillVirtualDomWithNodes();
}

// clear all data-cbnode and data-cbcopy attributes out of existing tree
function resetVirtualDomTree() {
  for (let i = 0; i < tree.length; i++) {
    removeMultipleAttributes(tree[i], ["data-cbnode", "style"]);
    if (tree[i].hasAttribute("data-cbcopy"))
      tree[i].removeAttribute("data-cbcopy");
  }
  // destroy the current tree
  tree = [];
}

function clearVirtualDom() {
  let navDiv = document.querySelector(".data-nav .nav-div");
  navDiv.innerHTML = "";
}

// function that builds navigable representation of tree
function fillVirtualDomWithNodes() {
  let indent = 0,
    navContainer = document.querySelector(".nav-div");

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
    for (let j = 0; j < attrNames.length; j++) {
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

function copyFunction() {
  // checks to see if extension is enabled
  let nodeCheck = document.querySelector('[data-cbcopy="true"]'),
    previewBox = document.querySelector(".previewBox");
  if (nodeCheck) {
    copySwitch();
    clearPreview();
    fillPreview();

    // copy contents to clipboard
    if (document.body.createTextRange) {
      range = document.body.createTextRange();
      range.moveToElementText(previewBox.firstChild);
      range.select();
      document.execCommand("copy");
    } else if (window.getSelection) {
      selection = window.getSelection();
      range = document.createRange();
      range.selectNodeContents(previewBox.firstChild);
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand("copy");
      downloadAllItems(downloadArray.length - 1);
    } else alert("Copy Unsuccessful");
  }
}

// clear contents out of previewBox element
function clearPreview() {
  let previewBox = document.querySelector(".previewBox");
  previewBox.innerHTML = "";
}

// function to fill previewBox with new content and reformat everything
function fillPreview() {
  let temp = document.querySelector('[data-cbcopy="true"]').cloneNode(true);
  let previewBox = document.querySelector(".previewBox");
  previewBox.appendChild(temp);
  resetDownloadErrorArrays();
  reformatEverythingEverywhere(temp);
}

// move copy elements up/down the created element tree[]
function copySwitch() {
  let allCopy = document.querySelectorAll("a.copy");
  for (let i = 0; i < allCopy.length; i++) {
    allCopy[i].innerHTML = "Copied";
  }
  setTimeout(function copiedToCopy() {
    let allCopied = document.querySelectorAll("a.copy");
    for (let i = 0; i < allCopied.length; i++) {
      allCopied[i].innerHTML = "Copy";
    }
  }, 3000);
}

// change highlighter element position to be drawn around coordinates
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
  });
}

// function to create all required beautifier elements
function createBeautifierElements() {
  createHighlighters();
  previewContainer = createPreviewContainer();
  navBar = createVirtualDom();
  cbExists = true;
}

// create highlighter elements and append to body
function createHighlighters() {
  elementHighlighter = createHighlighter();
  hoverHighlighter = createHighlighter();
  hoverHighlighter.classList.add("hover");
  highlighterButtons = createButtonModule();
  highlighterButtons.classList.add("highlighter-btns");
  document.body.append(highlighterButtons);
}

// return created highlighter element
function createHighlighter() {
  var highlighter = document.createElement("div");
  setMultipleAttributes(highlighter, {
    class: "cb highlighter",
    "data-cbspecial": ""
  });
  document.body.append(highlighter);
  return highlighter;
}

// return created preview container
function createPreviewContainer() {
  // verify that previewContainer doesn't exist before building a new one.
  if (document.querySelector(".previewContainer") != null) return;
  let container = document.createElement("div"),
    box = document.createElement("div"),
    closeIcon = document.createElement("span");

  // sets attributes for previewContainer, previewBox, and span elements
  setMultipleAttributes(container, {
    previewContainer: "",
    "data-cbspecial": "",
    class: "previewContainer"
  });
  setMultipleAttributes(box, {
    previewBox: "",
    "data-cbspecial": "",
    class: "previewBox"
  });
  setMultipleAttributes(closeIcon, {
    previewClose: "",
    "data-cbspecial": "",
    class: "previewClose"
  });

  // appends elements to previewContainer
  container.append(closeIcon);
  container.append(box);
  container.append(createCopyButton());

  // prepends previewContainer to HTML
  document.body.append(container);
  return container;
}

// return button module
function createButtonModule() {
  let buttonDiv = document.createElement("div");
  setMultipleAttributes(buttonDiv, {
    class: "btn-container",
    "data-cbspecial": ""
  });
  buttonDiv.appendChild(createPreviewButton());
  buttonDiv.appendChild(createCopyButton());
  return buttonDiv;
}

// return a copy button
function createCopyButton() {
  let button = document.createElement("a");
  setMultipleAttributes(button, {
    class: "cb-btn v1 copy",
    "data-cbspecial": "",
    href: "javascript:void(0)"
  });
  button.innerText = "Copy";
  return button;
}

// return a preview button
function createPreviewButton() {
  let button = document.createElement("a");
  setMultipleAttributes(button, {
    class: "cb-btn v2 preview",
    "data-cbspecial": "",
    href: "javascript:void(0)"
  });
  button.innerText = "Preview";
  return button;
}

// create virtualDom on the side
function createVirtualDom() {
  let nav = document.createElement("nav"),
    navDiv = document.createElement("div");

  setMultipleAttributes(nav, { "data-nav": "", class: "cb data-nav" });
  setMultipleAttributes(navDiv, { "nav-div": "", class: "cb nav-div" });

  nav.append(navDiv);
  nav.append(createButtonModule());
  document.body.append(nav);
  return nav;
}

// destroy all content beautifier elements. Essentially reset everything
function destroyBeautifierElements() {
  destroyHighlighters();
  destroyPreviewContainer();
  destroyVirtualDom();
  coordinates = [];
  cbExists = false;
}

// remove highlighter elements from DOM
function destroyHighlighters() {
  elementHighlighter.remove();
  hoverHighlighter.remove();
  highlighterButtons.remove();
}

// remove preview element from DOM
function destroyPreviewContainer() {
  previewContainer.remove();
}

// reset and remove virtual DOM from DOM
function destroyVirtualDom() {
  resetVirtualDomTree();
  navBar.remove();
}

// for testing only
window.addEventListener("click", function(event) {
  // event.target.preventDefault();
});

// listen for click events in the window. On click, call buildnodeTree function
window.addEventListener("click", () => {
  if (ctrlIsPressed && altIsPressed) {
    console.log("control and alt are pressed");
    event.preventDefault();
    // event.target.preventDefault();
    if (getTargetElement(event.target) == "img") {
      // }
      console.log("found an image");
    }
  }

  if (
    !event.target.hasAttribute("data-cbspecial") &&
    altIsPressed &&
    !ctrlIsPressed &&
    canCreateCB
  ) {
    if (!cbExists) createBeautifierElements();
    buildnodeTree(event);
    return;
  }
  if (event.target.hasAttribute("data-findnode")) {
    moveCopyAttribute(event.target);
    return;
  }
  if (event.target.classList.contains("preview")) {
    clearPreview();
    fillPreview();
    html.classList.add("previewClicked");
    return;
  }
  if (event.target.classList.contains("copy")) {
    copyFunction();
    return;
  }
  if (
    event.target.classList.contains("previewContainer") ||
    event.target.classList.contains("previewClose")
  ) {
    html.classList.remove("previewClicked");
    return;
  }
});

// when window is inactive/out of focus
window.addEventListener("blur", () => {
  altIsPressed = false;
  ctrlIsPressed = false;
});

// listen for button keyDown interactions
document.onkeydown = function(e) {
  e = e || window.event;
  let code = e.code.toString();
  // Ctrl key is pressed
  if (code == "ControlLeft" || code == "ControlRight") ctrlIsPressed = true;
  // Alt key is pressed
  if (code == "AltLeft" || code == "AltRight") altIsPressed = true;
  // Esc is pressed
  if (code == "Escape") {
    if (html.classList.contains("previewClicked"))
      html.classList.remove("previewClicked");
    else destroyBeautifierElements();
  }
  // check if both Ctrl + C are pressed at the same time
  if (ctrlIsPressed && code == "KeyC") copyFunction();
};

// listen for button keyUp interactions
document.onkeyup = function(e) {
  e = e || window.event;
  let code = e.code.toString();
  // Ctrl key is depressed
  if (code == "ControlLeft" || code == "ControlRight") ctrlIsPressed = false;
  // Alt key is depressed
  if (code == "AltLeft" || code == "AltRight") altIsPressed = false;
};

// listen for messages from chrome extension
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.command == "off") {
    console.log('command is "off"');
    if (canCreateCB && cbExists) {
      destroyBeautifierElements();
    }
    canCreateCB = false;
  }
  if (request.command == "on") {
    console.log('command is "on"');
    sendResponse({ message: "ready to create" });
    canCreateCB = true;
  }

  sendResponse({ farewell: "done" });
});

// on page load, get powerState from chrome storage
chrome.storage.sync.get(["cbKey"], function(result) {
  if (result.cbKey == true) canCreateCB = true;
});

// return name of tag
function getTargetElement(target) {
  return target.tagName.toLowerCase();
}
