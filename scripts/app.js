(function () {
    var el = document.getElementById("calendar");
    var del = document.getElementById("date");

    var init = {
        locale: "en-US",
        date: new Date(),
        element: el
    };

    var cal = new Calendar(init);

    el.addEventListener('datechanged', function (e) {
        console.log("Date changed from: " + e.oldDate + " to: " + e.newDate);
    });

    el.addEventListener('dateapplied', function (e) {
        console.log("Date applied: " + e.date);
        del.innerHTML = e.date;
    });
}());