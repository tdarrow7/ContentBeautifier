window.addEventListener('load', getStatus);

function isActive() {
    chrome.storage.sync.set({ key: true });
}

function isNotActive() {
    chrome.storage.sync.set({ key: false });
}

function getStatus() {
    var status;

    chrome.storage.sync.get(['key'], function (result) {
        status = result.key;
        console.log('Status: ' + status);
        return status;
    });

    // return status;
}

var powerBtn = document.querySelector('.power-btn'),
    powerIcon = document.querySelector('.power-btn > i')

powerBtn.addEventListener('click', function () {
    if (this.classList.contains('active')) {
        powerOff();
        getStatus();
    } else {
        powerOn();
        getStatus();
    }
})

function powerOff() {
    isNotActive();
    powerBtn.classList.remove('active');
    powerIcon.style.color = '#0072ff';
}

function powerOn() {
    isActive();
    powerBtn.classList.add('active');
    powerIcon.style.color = "#62A945";
}