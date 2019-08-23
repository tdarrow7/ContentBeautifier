var body = document.getElementsByTagName('body');
var highlight = document.createElement('div');

// document.addEventListener('click', function (e) {
//     var item = e.target;
//     getID(item);
// });

// commented out by tim

function setAttributes(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

function getID(el) {

    let bodyRect = document.body.getBoundingClientRect(),
        elemRect = el.getBoundingClientRect(),
        top = (elemRect.top - bodyRect.top),
        left = (elemRect.left - bodyRect.left);
    var styleString = "position: absolute !important; visibility: visible !important; opacity: 1 !important; height: " + el.offsetHeight + "px; width: " + el.offsetWidth + "px; left: " + left + "px; top: " + top + "px";
    setAttributes(highlight, {
        "class": "highlighter",
        "style": styleString
    });
}

document.body.appendChild(highlight);