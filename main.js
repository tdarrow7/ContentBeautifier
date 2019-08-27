function getPosition(el) {
    let bodyRect = document.body.getBoundingClientRect(),
        elemRect = el.getBoundingClientRect(),
        height = el.offsetHeight,
        width = el.offsetWidth,
        top = elemRect.top - bodyRect.top,
        left = elemRect.left - bodyRect.left;

    checkScrollPositon(top, bodyRect.top * -1);

    let arr = { height, width, left, top }
    return arr;
}

function checkScrollPositon(top, bodyTop) {
    if (top - bodyTop < 200)
        window.scroll({
            top: bodyTop - 350,
            left: 0,
            behavior: "smooth"
        });
    else if (top - bodyTop > 600)
        window.scroll({
            top: bodyTop + 350,
            left: 0,
            behavior: "smooth"
        });
}

function setAttributes(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

function changePosition(el) {
    var arr = getPosition(el);
    changeHighlightPosition(arr);
    changeButtonPosition(arr);
}