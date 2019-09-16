document.querySelectorAll('.power-btn').forEach(function (e) {
    e.addEventListener('click', function () {
        var icon = document.querySelector('.power-btn > i');
        if (this.classList.contains('active')) {
            isNotActive();
            getStatus();
            this.classList.remove('active');
            icon.style.color = '#0072ff';
        } else {
            isActive();
            getStatus();
            this.classList.add('active');
            icon.style.color = "#62A945";
        }
    })
});

isActive = () => {
    chrome.storage.sync.set({ key: true });
}

isNotActive = () => {
    chrome.storage.sync.set({ key: false });
}

getStatus = () => {
    chrome.storage.sync.get(['key'], function (result) {
        var status = result.key;
        console.log('Status: ' + status);
        return status;
    });
}