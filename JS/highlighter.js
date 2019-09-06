let highlight = document.createElement("div"),
  hoverHighlight = document.createElement("div");

function changeHighlightPosition(arr) {
  let { height, width, left, top } = arr;
  var styleString =
    "visibility: visible !important; opacity: 1 !important; height: " +
    height +
    "px; width: " +
    width +
    "px; left: " +
    left +
    "px; top: " +
    top +
    "px";

  setMultipleAttributes(highlight, {
    class: "highlighter",
    style: styleString,
    "data-cbspecial": ""
  })
}

document.body.appendChild(highlight);