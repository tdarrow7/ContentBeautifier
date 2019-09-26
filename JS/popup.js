let powerBtn = document.querySelector('.power-btn');

window.addEventListener('load', loadPowerState);

// get power state on load from storage
function loadPowerState() {
    chrome.storage.sync.get(['cbKey'], function (result) {
        let status = result.cbKey;
        (status == true) ? powerOn() : powerOff();
    });
}

// function to set cbKey boolean in storage to true
function isActive() {
    chrome.storage.sync.set({ cbKey: true });
}

// function to set cbKey boolean in storage to true
function isNotActive() {
    chrome.storage.sync.set({ cbKey: false });
}

// toggle powerstates for button and trigger sendStatusToPage() function
powerBtn.addEventListener('click', function () {
    (this.classList.contains('active')) ? powerOff() : powerOn();
    sendStatusToPage();
})


// function to change button power state to 'on'
function powerOff() {
    isNotActive();
    powerBtn.classList.remove('active');
}

// function to change button power state to 'on'
function powerOn() {
    isActive();
    powerBtn.classList.add('active');
}

// function to send status to current tab
function sendStatusToPage() {
    chrome.storage.sync.get(['cbKey'], function (result) {
        let powerStatus = (result.cbKey == true) ? 'on' : 'off';
        console.log('status: ' + powerStatus);
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { command: powerStatus }, function () {
                console.log('success');
            });
        });
    });
}