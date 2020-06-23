function getRandomOfflineBackground()
{
    let photo = "../images/" + (1 + Math.floor(Math.random() * 10)) + ".jpg";

    return (photo);
}

function get_photos()
{
    let request = new XMLHttpRequest();
    request.open("GET","https://api.pexels.com/v1/search?query=code+query&per_page=15&page=1",false);
    request.setRequestHeader("Authorization", "Bearer 563492ad6f91700001000001d0c29fc4d08b486e97db01e7a9aaa47d");
    try {
        request.send(null);
    } catch (exception) {
        request = null;
    }

    return request;
}

function get_random_photos(photos)
{
    let photo = photos[Math.floor(Math.random() * photos.length)];

    return (photo);
}

function get_photo_url(photo)
{
    let url = photo["src"]["original"];

    url += "?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=" + window.innerHeight + "&w=" + window.innerWidth;
    return (url);
}

function start_clock() {
    let today = new Date();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    document.getElementById('time').innerHTML = hours + ":" + minutes;
    setTimeout(start_clock, 10 * 1000);
}

function update_username() {
    let gettingItem = browser.storage.sync.get('autologin');
    let item;
    gettingItem.then((res) => {
        item = get_profile(res.autologin)["firstname"];
    });
    gettingItem = browser.storage.sync.get('username');
    gettingItem.then((res) => {
        if (res.username)
            item = res.username;
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

function draw_registered(registered) {
    let table = document.getElementById("table_events");
    let profile = get_profile();

    table.deleteRow(0);
    for (let i = 0; i < Object.keys(registered).length; i++) {
        let module = registered[i];
        let row = table.insertRow(0);
        let cell = row.insertCell(0);
        let title = module["acti_title"].split(" - ");
        if (title[1])
            cell.innerHTML = "<span style='color:#9b9b9b'> " + title[0] + " </span>" +  title[1] + " - ";
        else
            cell.innerHTML = "<span style='color:#9b9b9b'> " + title[0] + " </span> - ";
        cell.innerHTML += "<span style='color:#9b9b9b'> " + format_room_code(module["room"]["code"]) + " </span>";
        cell.innerHTML += " - " + time_of_module(module["start"]) + " to " + time_of_module(module["end"]).split(" ")[2];
        cell.style.textShadow = "1px 1px black";
        cell.style.textAlign = "center";
        cell.classList.add("module");
        cell.dataset.code = "https://intra.epitech.eu/module/" + profile["scolaryear"] + "/" + module["codemodule"] + "/" + module["codeinstance"] + "/" + module["codeacti"] + "/";
    }
    if (Object.keys(registered).length === 0) {
        let row = table.insertRow(0);
        let cell = row.insertCell(0);
        cell.innerHTML = "No events for the next 7 days.";
        cell.style.textShadow = "1px 1px black";
        cell.style.textAlign = "center";
    }
}

let request = get_photos();
let photo_url;
if (!request || request.status !== 200) {
    photo_url = getRandomOfflineBackground();
} else {
    let photos = JSON.parse(request["responseText"]);
    if (photos)
        photo_url = get_photo_url(get_random_photos(photos["photos"]));
    else
        photo_url = getRandomOfflineBackground();
}
document.body.style.backgroundSize = "100%";
document.body.style.backgroundImage = "url(" + photo_url + ")";
document.getElementById("pexel_logo").addEventListener("click", openPexelURL);

document.addEventListener("click", function(e) {
    if (!e.target["classList"].contains("intranet") && !e.target["classList"].contains("module")) {
        return;
    }
    if (e.target["classList"].contains("intranet"))
        open_planning();
    else if (e.target["classList"].contains("module"))
        show_event(e.target || e.srcElement);
});

function fadeElements()
{
    $("#events").fadeIn(1000);
    $("#time").fadeIn(1000);
    $(".welcome").fadeIn(1000);
    $(".searchbox-container").fadeIn(1000);
}

$(document).ready(function() {
    start_clock();
    update_username();
    let row = document.getElementById("table_events").insertRow(0);
    let cell = row.insertCell(0);
    cell.style.textAlign = "center";
    cell.innerHTML = "We're trying to recover your schedule..";

    let gettingItem = browser.storage.sync.get('autologin');
    gettingItem.then((res) => {
        let registered = get_registered_from_planning(get_planning(res.autologin));
        registered = get_next_registered(registered);
        draw_registered(registered);
    });
    fadeElements();
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
