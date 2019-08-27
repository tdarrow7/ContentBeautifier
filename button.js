let buttonDiv = document.createElement("div"),
    previewButton = document.createElement("a"),
    copyButton = document.createElement("a");

previewButton.innerText = "Preview";
copyButton.innerText = "Copy";

copyButton.setAttribute("class", "cb-btn v1");
previewButton.setAttribute("class", "cb-btn v1");

buttonDiv.appendChild(previewButton);
buttonDiv.appendChild(copyButton);

document.body.appendChild(buttonDiv);

function changeButtonPosition(arr) {
    let { height, width, left, top } = arr;
    var styleString =
        "visibility: visible !important; opacity: 1 !important; top: " +
        (top + height + 10) +
        "px; left: " +
        (left + width - buttonDiv.offsetWidth) +
        "px"

    setAttributes(buttonDiv, {
        class: "btn-container",
        "data-cbcopy": "single",
        style: styleString
    })
}