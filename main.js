function getPosition(position, setAttr, insert) {
    let bodyRect = document.body.getBoundingClientRect(),
        elemRect = document.querySelector(position),
        el = document.querySelector(position),
        top = elemRect.top - bodyRect.top,
        left = elemRect.left - bodyRect.left;

    checkScrollPositon(top, bodyRect.top * -1);

    return el.offsetHeight, el.offsetWidth, left, top;


}

function setAttributes(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
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