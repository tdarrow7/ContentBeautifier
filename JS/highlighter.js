let highlight = document.createElement("div"),
  hoverHighlight = document.createElement("div");

function changeHighlightPosition(arr) {
  let { height, width, left, top } = arr;
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

  setMultipleAttributes(highlight, {
    class: "highlighter",
    style: styleString,
    "data-cbspecial": ""
  })
}

document.body.appendChild(highlight);