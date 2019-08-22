var body = document.getElementsByTagName('body');
var highlight = document.createElement('div');

document.addEventListener('click', function (e) {
    var item = e.target;
    getID(item);
});

function setAttributes(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

function getID(el) {
    var styleString = "position: absolute !important; visibility: visible !important; opacity: 1 !important; height: " + el.offsetHeight + "px; width: " + el.offsetWidth + "px; left: " + el.offsetLeft + "px; top: " + el.offsetTop + "px";
    setAttributes(highlight, {
        "class": "highlighter",
        "style": styleString
    });
}

document.body.appendChild(highlight);
