function openPlanning() {
  browser.tabs.create({
    url: "https://intra.epitech.eu/planning/"
  });
}

document.addEventListener("click", function(e) {
    if (!e.target.classList.contains("intranet") && !e.target.classList.contains("event")) {
        return;
    }

    if (e.target.classList.contains("intranet"))
        openPlanning();
    else if (e.target.classList.contains("event"))
        showEvent(e.target || e.srcElement);
});

function loadPage() {
    let row = document.getElementById("events").insertRow(0);
    let cell = row.insertCell(0);
    cell.style.marginLeft = "25px";
    cell.innerHTML = "We're trying to recover your schedule..";
    let getItem = browser.storage.sync.get('autologin');
    getItem.then((res) => {
        let registered = getRegisteredFromPlanning(getPlanning(res.autologin));
        let table = document.getElementById("events");
        registered = getNextEventsByDays(registered, true);
        draw_registered_popup(table, registered, 1);
    });
    $("#body").fadeIn(2000);
}
document.addEventListener('DOMContentLoaded', loadPage);
