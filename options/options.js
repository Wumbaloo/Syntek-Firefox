function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
      username: document.querySelector("#username").value,
      autologin: document.querySelector("#autologin").value
    });
}

function restoreOptions() {
    let getItem = browser.storage.sync.get('username');
    getItem.then((res) => {
        document.querySelector("#username").value = res.username || "";
    });
    getItem = browser.storage.sync.get('autologin');
    getItem.then((res) => {
        document.querySelector("#autologin").value = res.autologin || "";
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
