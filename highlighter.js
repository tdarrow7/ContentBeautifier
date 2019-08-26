let highlight = document.createElement("div"),
  hoverHighlight = document.createElement("div");
copyButton = document.createElement("a");

copyButton.innerText = "Copy Content";

function setAttributes(el, attrs) {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

function getID() {
  let bodyRect = document.body.getBoundingClientRect(),
    elemRect = document.querySelector("[data-cbcopy]").getBoundingClientRect(),
    el = document.querySelector("[data-cbcopy]"),
    top = elemRect.top - bodyRect.top,
    left = elemRect.left - bodyRect.left;
  var styleString =
    "visibility: visible !important; opacity: 1 !important; height: " +
    el.offsetHeight +
    "px; width: " +
    el.offsetWidth +
    "px; left: " +
    left +
    "px; top: " +
    top +
    "px";
  setAttributes(highlight, {
    class: "highlighter",
    style: styleString,
    "data-cbspecial": ""
  });
  setAttributes(copyButton, {
    class: "cb-btn v1",
    "data-cbcopy": "single",
    "data-cbspecial": "",
    style:
      "visibility: visible !important; opacity: 1 !important; top: " +
      (top + el.offsetHeight + 10) +
      "px; left: " +
      (left + el.offsetWidth - copyButton.offsetWidth) +
      "px"
  });

  checkScrollPositon(top, bodyRect.top * -1);
}

// function moveHoverHighlight(el) {
//     let bodyRect = document.body.getBoundingClientRect(),
//         elemRect = el.getBoundingClientRect(),
//         top = (elemRect.top - bodyRect.top),
//         left = (elemRect.left - bodyRect.left);
//     var styleString = 'visibility: visible !important; opacity: 1 !important; height: ' + el.offsetHeight + 'px; width: ' + el.offsetWidth + 'px; left: ' + left + 'px; top: ' + top + 'px';
//     setAttributes(hoverHighlight, {
//         'class': 'highlighter hover',
//         'data-cbspecial': '',
//         'style': styleString
//     });
// }

function calculateButtonPosition(top) {
  let topPos = top - copyButton.offsetHeight - 5;
  // console.log(copyButton.offsetHeight);
  // console.log(top);
  // console.log(topPos);
  return topPos < 40 ? top : topPos;
}

function calculateButtonPosition2(top) {
  let topPos = top - copyButton.offsetHeight - 5;
  // console.log(copyButton.offsetHeight);
  // console.log(top);
  // console.log(topPos);
  return topPos < 40 ? top : topPos;
}

function checkScrollPositon(top, bodyTop) {
  // console.log('top: ' + top);
  // console.log('bodyTop: ' + bodyTop);
  // console.log('diff: ' + (top - bodyTop));

  if (top - bodyTop < 200)
    window.scroll({
      top: bodyTop - 350,
      left: 0,
      behavior: "smooth"
    });
  // window.scrollTo(0, bodyTop - 350);
  else if (top - bodyTop > 600)
    // window.scrollTo(0, bodyTop + 350);
    window.scroll({
      top: bodyTop + 350,
      left: 0,
      behavior: "smooth"
    });
}

document.body.appendChild(highlight);
document.body.appendChild(copyButton);
