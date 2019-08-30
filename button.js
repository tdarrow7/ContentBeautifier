let buttonDiv = document.createElement("div"),
    previewButton = document.createElement("a"),
    copyButton = document.createElement("a");

previewButton.innerText = "Preview";
copyButton.innerText = "Copy";

copyButton.setAttribute("class", "cb-btn v2");
previewButton.setAttribute("class", "cb-btn v1");

buttonDiv.appendChild(previewButton);
buttonDiv.appendChild(copyButton);

document.body.appendChild(buttonDiv);

function changePageButtonPosition(arr) {
    let { height, width, left, top } = arr;
    var styleString =
        "visibility: visible !important; opacity: 1 !important; top: " +
        (top + height + 10) +
        "px; left: " +
        (left + width - buttonDiv.offsetWidth) +
        "px";

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

    navPreviewButton.setAttribute("class", "cb-btn v1");
    navCopyButton.setAttribute("class", "cb-btn v2");

    navButtonDiv.appendChild(navPreviewButton);
    navButtonDiv.appendChild(navCopyButton);

    setAttributes(navButtonDiv, {
        class: "nav-btn-container",

    })

    dataNav.appendChild(navButtonDiv);
    console.log("addNavButton ran");
}