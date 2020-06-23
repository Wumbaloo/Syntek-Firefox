function launchSearch()
{
    let text = $(".search-input")[0].value;
    var expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    var urlRegex = new RegExp(expression);
    var withoutHttps = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;

    if (!text || text.trim().length == 0)
        return;
    let getSearchNewTab = browser.storage.sync.get('openSearchNewTab');
    getSearchNewTab.then((res) => {
        if (res.openSearchNewTab) {
            if (text.match(withoutHttps)) {
                browser.tabs.create({ url: "https://" + text + "/" });
             } else if (text.match(urlRegex)) {
                 browser.tabs.create({ url: text });
             } else
                 browser.tabs.create({ url: "https://google.com/search?q=" + text });
        } else {
           if (text.match(withoutHttps)) {
                window.location = "https://" + text + "/";
            } else if (text.match(urlRegex)) {
                window.location = text;
            } else
                window.location = "https://google.com/search?q=" + text;
        }
    });
}

function handleNotifySlider()
{
    let beforeTimerSlider = document.getElementById("beforeTimer");
    let beforeTimerText = document.getElementById("beforeTimer-text");
    beforeTimerText.innerHTML = beforeTimerSlider.value;

    beforeTimerSlider.addEventListener("input", () => {
        if (beforeTimerSlider.value < 2 || beforeTimerSlider.value > 30 || Number(beforeTimerSlider.value) == "NaN")
            return;
        beforeTimerText.innerHTML = beforeTimerSlider.value;
        browser.storage.sync.set({ notifyTimer: beforeTimerSlider.value });
        updateNotifyMinutes(beforeTimerSlider.value);
    });
}

function handleBackgroundButtons()
{
    $(".refreshPicture").click(() => {
        browser.storage.sync.set({ background: null });
        updateBackground();
    });
    $(".keepBackground").click(() => {
        browser.storage.sync.set({ background: document.querySelector("body").style.backgroundImage });
    });
    $(".clearBackground").click(() => {
        browser.storage.sync.set({ background: "url(../images/black.png)" });
        updateBackground();
    });
}

function handleOpenEvent()
{
    let openEventNewTabElement = document.getElementById("openEventNewTab");
    let getOpenEventNewTab = browser.storage.sync.get('openEventNewTab');
    
    getOpenEventNewTab.then((res) => {
        if (res.openEventNewTab)
            openEventNewTabElement.checked = res.openEventNewTab;
        else if (res.openEventNewTab == null || res.openEventNewTab == "undefined")
            openEventNewTabElement.checked = true;
    });
    openEventNewTabElement.addEventListener("input", () => {
        browser.storage.sync.set({ openEventNewTab: openEventNewTabElement.checked });
    });
}

function handleOpenSearch()
{
    let openSearchNewTabElement = document.getElementById("openSearchNewTab");
    let getOpenSearchNewTab = browser.storage.sync.get('openSearchNewTab');
    
    getOpenSearchNewTab.then((res) => {
        openSearchNewTabElement.checked = res.openSearchNewTab;
    });
    openSearchNewTabElement.addEventListener("input", () => {
        browser.storage.sync.set({ openSearchNewTab: openSearchNewTabElement.checked });
    });
}

$(document).ready(function() {
    $(".toggler").click(() => {
        let drawer = document.getElementsByClassName("drawer")[0];
        if (drawer.style.width == "0px") {
            drawer.style.width = "20rem";
        } else
            drawer.style.width = "0px";
    });
    handleNotifySlider();
    handleBackgroundButtons();
    handleOpenEvent();
    handleOpenSearch();
});