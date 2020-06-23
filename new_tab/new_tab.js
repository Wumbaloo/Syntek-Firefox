function getRandomOfflineBackground()
{
    let photo = "../images/" + (1 + Math.floor(Math.random() * 10)) + ".jpg";

    return (photo);
}

function getBackgrounds()
{
    let request = new XMLHttpRequest();

    request.open("GET","https://api.pexels.com/v1/search?query=code+query&per_page=50&page=1",false);
    request.setRequestHeader("Authorization", "Bearer 563492ad6f91700001000001d0c29fc4d08b486e97db01e7a9aaa47d");
    try {
        request.send(null);
    } catch (exception) {
        request = null;
    }
    return request;
}

function getRandomBackground(photos)
{
    let photo = photos[Math.floor(Math.random() * photos.length)];

    return (photo);
}

function getPhotoURL(photo)
{
    let url = photo["src"]["original"];

    url += "?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=" + window.innerHeight + "&w=" + window.innerWidth;
    return (url);
}

function startClock() {
    let today = new Date();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    document.getElementById('time').innerHTML = hours + ":" + minutes;
    setTimeout(startClock, 10 * 1000);
}

function updateUsername() {
    let getItem = browser.storage.sync.get('autologin');
    let item;
    getItem.then((res) => {
        item = getProfile(res.autologin)["firstname"];
    });
    getItem = browser.storage.sync.get('username');
    getItem.then((res) => {
        if (res.username)
            item = res.username;
        else if (res.username == "undefined")
            item = "Student";
        let date = new Date();
        let txt = "Good Morning, " + item + ".";

        if (date.getHours() >= 12)
            txt = "Good Afternoon, " + item + ".";
        if (date.getHours() >= 18)
            txt = "Good Evening, " + item + ".";
        if ((date.getHours() >= 23 && date.getMinutes() >= 42) || date.getHours() <= 8)
            txt = "Epitech is closed, go to sleep already!!!";
        document.getElementsByClassName("welcome")[0].innerHTML = txt;
    });
}

function openPexelURL() {
    browser.tabs.create({
        url: "https://www.pexels.com/"
    });
}

function openIntraEpitech() {
    window.location = "https://intra.epitech.eu/";
}

function updateBackground()
{
    let getBackground = browser.storage.sync.get('background');

    getBackground.then((res) => {
        if (res.background) {
            document.body.style.backgroundImage = res.background;
            return;
        }
        let request = getBackgrounds();
        let photo_url;

        if (!request || request.status !== 200) {
            photo_url = getRandomOfflineBackground();
        } else {
            let photos = JSON.parse(request["responseText"]);
            if (photos)
                photo_url = getPhotoURL(getRandomBackground(photos["photos"]));
            else
                photo_url = getRandomOfflineBackground();
        }
        document.body.style.backgroundImage = "url(" + photo_url + ")";
    });
}

document.addEventListener("click", function(e) {
    if (!e.target["classList"].contains("intranet") && !e.target["classList"].contains("module")) {
        return;
    }
    if (e.target["classList"].contains("intranet"))
        open_planning();
    else if (e.target["classList"].contains("module"))
        showEvent(e.target || e.srcElement);
});

function fadeElements()
{
    $("#events").fadeIn(1000);
    $("#time").fadeIn(1000);
    $(".welcome").fadeIn(1000);
    $(".searchbox-container").fadeIn(1000);
}

$(document).ready(function() {
    startClock();
    updateUsername();
    updateBackground();
    let row = document.getElementById("table_events").insertRow(0);
    let cell = row.insertCell(0);
    cell.style.textAlign = "center";
    cell.innerHTML = "We're trying to recover your schedule..";

    let getItem = browser.storage.sync.get('autologin');
    getItem.then((res) => {
        let registered = getRegisteredFromPlanning(getPlanning(res.autologin));
        let table = document.getElementById("table_events");
        registered = getNextEventsByDays(registered);
        drawRegistered(table, registered, 7);
    });
    fadeElements();
    document.getElementById("pexel_logo").addEventListener("click", openPexelURL);
    document.getElementsByClassName("search-input")[0].addEventListener("keydown", (event) => {
        if (event.keyCode != 13)
            return;
        launchSearch();
        event.preventDefault();
    });
    $('.search-input').focus();
    $(".search-go").click(launchSearch);
    $(".gotoIntra").click(openIntraEpitech);
});
