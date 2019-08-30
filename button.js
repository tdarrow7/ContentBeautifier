let buttonDiv = document.createElement("div"),
    previewButton = document.createElement("a"),
    copyButton = document.createElement("a");

previewButton.innerText = "Preview";
copyButton.innerText = "Copy";

copyButton.setAttribute("class", "cb-btn v2 copy");
previewButton.setAttribute("class", "cb-btn v1 preview");

buttonDiv.appendChild(previewButton);
buttonDiv.appendChild(copyButton);

document.body.appendChild(buttonDiv);

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

    setAttributes(buttonDiv, {
        class: "btn-container",
        "data-cbcopy": "single",
        style: styleString
    })

    console.log("changePageButtonPosition ran");
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

    navButtonDiv.appendChild(navPreviewButton);
    navButtonDiv.appendChild(navCopyButton);

    setAttributes(navButtonDiv, {
        class: "nav-btn-container",

    })

    dataNav.appendChild(navButtonDiv);
    console.log("addNavButton ran");
}