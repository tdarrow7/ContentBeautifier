let powerBtn = document.querySelector('.power-btn');

window.addEventListener('load', loader);

function loader() {
    chrome.storage.sync.get(['key'], function (result) {
        var status = result.key;
        if (status)
            powerOn();
        else
            powerOff();
    });
}

// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
//       console.log(response.farewell);
//     });
//   });

function isActive() {
    chrome.storage.sync.set({ key: true });
}

function isNotActive() {
    chrome.storage.sync.set({ key: false });
}

function getStatus() {
    chrome.storage.sync.get(['key'], function (result) {
        status = result.key;
        console.log('Status: ' + status);
        return status;
    });
}



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
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { command: "off" }, function (response) {
            console.log(response.message);
        });
    });
    powerBtn.classList.remove('active');
}

function powerOn() {
    isActive();
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { command: "on" }, function (response) {
            console.log(response.message);
        });
    });
    powerBtn.classList.add('active');
}

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.active) {
  
      // do your things
      console.log('getStatus(): ' + getStatus());
    }
    console.log('this is a test');
});

chrome.browserAction.onClicked.addListener(function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
         chrome.tabs.sendMessage(tabs[0].id, {data: "some value"});
     });
 });