buttonDiv = document.createElement("div");

copyButton = document.createElement("a");
copyButton.innerText = "Copy";

previewButton = document.createElement("a");
previewButton.innerText = "Preview";

buttonDiv.appendChild(copyButton);
buttonDiv.appendChild(previewButton);

document.body.appendChild(buttonDiv);

