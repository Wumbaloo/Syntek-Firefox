function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
      username: document.querySelector("#username").value,
      autologin: document.querySelector("#autologin").value
    });
}

function restoreOptions() {
    let gettingItem = browser.storage.sync.get('username');
    gettingItem.then((res) => {
        document.querySelector("#username").value = res.username || "";
    });
    gettingItem = browser.storage.sync.get('autologin');
    gettingItem.then((res) => {
        document.querySelector("#autologin").value = res.autologin || "";
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
