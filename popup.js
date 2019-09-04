// declare default variables
let el = null,
  parentEl = null,
  tree = [],
  nav = document.createElement("nav"),
  html = document.querySelector("html"),
  divContainer = document.createElement("div"),
  div = document.createElement("div"),
  a = document.createElement("a"),
  span = document.createElement("span"),
  ctrlIsPressed = false;
setMultipleAttributes(nav, { "data-nav": "", class: "data-nav" });
setMultipleAttributes(div, {"previewBox" : "", class: "previewBox"});
setMultipleAttributes(divContainer, {"previewContainer" : "", class: "previewContainer"});
setMultipleAttributes(span, {"previewClose" : "", class: "previewClose"});
setMultipleAttributes(a, {"previewClose" : "", class: "previewClose"});
span.append(a);
div.append(span);
divContainer.append(div);

// Declare function that builds a new node tree based on what you clicked on.
function findNodeTree(event) {
  // if a tree already exists due to a previous click, call the clearNodeTree function
  if (tree.length > 0) clearNodeTree();
  else {
    html.prepend(nav);
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
  getID();
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
  nav.innerHTML = "";
  div.innerHTML = "";
  div.append(span);
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
    nav.append(link);
    indent += 0.2;
  }
}

// helper function to set multiple attributes at a time
// note that the function is looking for both an element and a map to be passed as variables
function setMultipleAttributes(el, attrMap) {
  for (let key in attrMap) {
    el.setAttribute(key, attrMap[key]);
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
  getID();
}


// listen for click events in the window. On click, call findNodeTree function
window.addEventListener("click", () => {
  // console.log("event.target: ", event.target);
  // console.log("QuerySelector Value: ", document.querySelector('i[toggle="true"]')) ;
  // console.log("Toggle True: ", event.target.contains(document.querySelector('i[toggle="true"]')) );
  // console.log("Toggle False: ", event.target.contains(document.querySelector('i[toggle="false"]')) );
  if (event.target.contains(document.querySelector('i[toggle="true"]'))){
    console.log("toggle on");

  }
  if (event.target.contains(document.querySelector('i[toggle="false"]'))){
    console.log("toggle off");
  }

  if (ctrlIsPressed){
    event.preventDefault(); 
  }
  if (
    // !event.target.parentNode.hasAttribute("data-nav") &&
    !event.target.hasAttribute("data-cbspecial")
  )
    if (ctrlIsPressed){
      findNodeTree(event);
    }
  if (event.target.hasAttribute("data-findnode")){
    moveCopyAttribute(event.target);
  }
  if (event.target.classList.contains('copy')) {
    if (div.childNodes.length == 1){
      let og = document.querySelectorAll('body [data-cbcopy="true"] *');
      //console.log("original tree node: ", document.querySelector('body [data-cbcopy="true"]'));
      let temp = document.querySelector('body [data-cbcopy="true"]').cloneNode(true);
      console.log("temp: ", temp);

      let allElms = Array.prototype.slice.call(temp.querySelectorAll("*"));

      // used to check if the nodeList has element with parentNodes
      /*for (let i = 0; i < allElms.length; i++){
        // console.log("OG Node[i]: ", og[i], "    What's the parentNode?: ", og[i].parentNode);
        console.log("AllElms Node[i]: ", allElms[i], "    What's the parentNode?: ", allElms[i].parentNode);
      }*/

      console.log("temp tree node:", temp);
      // reformatEverythingEverywhere(temp);
      
      
      div.appendChild(temp);

      reformatEverythingEverywhere(temp);
    } 
    html.classList.toggle("previewClicked");
      // reformatEverythingEverywhere(document.querySelector('body [data-cbcopy="true"]'));
  }
  if (event.target.classList.contains('previewContainer') || event.target.classList.contains('previewClose')){
    html.classList.toggle("previewClicked");
  }
  // console.log("event.target.classList: ",  event.target.classList);
  // console.log("event.target.classList.contains('copy'): ",  event.target.classList.contains('copy'));
});

document.onkeydown = function(e) {
  e = e || window.event;
  if (e.keyCode == 17) {
    ctrlIsPressed = true;
    console.log('ctrl is pressed');
  }
  if (e.keyCode == 27) {
    esclIsPressed = true;
    console.log('esc is pressed');
  }
}

document.onkeyup = function(e) {
  e = e || window.event;
  if (e.keyCode == 17) {
    ctrlIsPressed = false;
    console.log('ctrl is depressed');
  }
  if (e.keyCode == 27) {
    escIsPressed = false;
    console.log('esc is depressed');
  }
}
