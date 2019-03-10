function open_planning() {
  browser.tabs.create({
    url: "https://intra.epitech.eu/planning/"
  });
}

function draw_registered_popup(registered) {
    let table = document.getElementById("events");
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
        cell.classList.add("event");
        cell.dataset.code = "https://intra.epitech.eu/module/" + profile["scolaryear"] + "/" + module["codemodule"] + "/" + module["codeinstance"] + "/" + module["codeacti"] + "/";
    }
    if (Object.keys(registered).length === 0) {
        let row = table.insertRow(0);
        let cell = row.insertCell(0);
        cell.innerHTML = "No events for the next 24 hours.";
        cell.style.textShadow = "1px 1px black";
        cell.style.textAlign = "center";
    }
}

document.addEventListener("click", function(e) {
    if (!e.target.classList.contains("intranet") && !e.target.classList.contains("event")) {
        return;
    }

    if (e.target.classList.contains("intranet"))
        open_planning();
    else if (e.target.classList.contains("event"))
        show_event(e.target || e.srcElement);
});

function load_page() {
    let row = document.getElementById("events").insertRow(0);
    let cell = row.insertCell(0);
    cell.style.marginLeft = "25px";
    cell.innerHTML = "We're trying to recover your schedule..";
    let gettingItem = browser.storage.sync.get('autologin');
    gettingItem.then((res) => {
        let registered = get_registered_from_planning(get_planning(res.autologin));
        registered = get_next_registered(registered, true);
        draw_registered_popup(registered);
    });
    $("#body").fadeIn(2000);
}
document.addEventListener('DOMContentLoaded', load_page);
