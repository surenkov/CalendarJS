function Calendar(settings) {
    /// <summary>A calendar widget object.</summary>
    /// <param name="settings">Initial settings.</param>

    /// <var type="HTMLElement">Main element.</var>
    /// <var type="HTMLElement">Root element.</var>
    /// <var type="HTMLElement">Calendar caption element.</var>
    /// <var type="HTMLElement">Calendar table element.</var>
    /// <var type="Date">Selected date.</var>

    var element = null;
    var root = null;
    var caption = null;
    var table = null;
    var date = null;

    function setCaption(text) {
        /// <param name="text" type="String">Caption string.</param>
        caption.innerHTML = text;
    }

    function setCurrentElement(el, arg) {
        /// <param name="el" type="HTMLElement">Current day element.</param>
        /// <param name="arg" type="Calendar">This object</param>
        var days = table.getElementsByTagName("td");
        for (var i = 0; i < days.length; i++)
            Compatibility.removeClass(days[i], "calendar-selected-date");
        Compatibility.addClass(el, "calendar-selected-date");

        var d = new Date(Compatibility.getData(el, "date"));
        arg.setDate(d);

        var event = document.createEvent('Event');
        event.initEvent('dateapplied', true, true);
        event.date = d;
        event.element = element;
        root.dispatchEvent(event);
    }

    function updateTable(d, arg) {
        /// <param name="d" type="Date">Updated date.</param>
        /// <param name="arg" type="Calendar">This object.</param>
        if (table != undefined)
            table.parentNode.removeChild(table);
        table = document.createElement("table");
        table.className = "calendar-table";
        element.appendChild(table);

        var thead = document.createElement("thead");
        thead.className = "calendar-head";
        var tr = document.createElement("tr");

        thead.appendChild(tr);
        table.appendChild(thead);

        var start = new Date(d);
        start.setDate(1);
        start.addDays(-start.getDay());

        for (var i = new Date(start), j = 0 ; j != 7; i.addDays(1), j++) {
            var th = document.createElement("th");
            Compatibility.addClass(th, "calendar-weekday");
            if (j % 6 === 0)
                Compatibility.addClass(th, "calendar-weekend");
            th.innerHTML = i.toLocaleDateString(arg.locale, { weekday: "narrow" });
            tr.appendChild(th);
        }

        var current = new Date();

        var tdClicked = function (e) {
            setCurrentElement(e.target, this)
        }.bind(arg);

        for (var i = 0; i < 6; i++) {
            var r = document.createElement("tr");
            r.className = "calendar-week";
            for (var j = 0; j < 7; j++, start.addDays(1)) {
                var td = document.createElement("td");
                Compatibility.addClass(td, "calendar-day");
                td.innerHTML = start.getDate();
                Compatibility.setData(td, "date", start);
                if (j % 6 == 0)
                    Compatibility.addClass(td, "calendar-weekend");
                if (start.getMonth() != d.getMonth())
                    Compatibility.addClass(td, "calendar-other-month");
                if (start.compareDateTo(d))
                    Compatibility.addClass(td, "calendar-selected-date");
                if (start.compareDateTo(current))
                    Compatibility.addClass(td, "calendar-current-date");
                Compatibility.addEventListener(td, 'click', tdClicked);
                r.appendChild(td);
            }
            table.appendChild(r);
        }
    }

    var locale = this.locale;
    this.setDate = function (d) {
        /// <param name="d" type="Date">Selected date.</param>
        var event = document.createEvent("Event");
        event.initEvent("datechanged", true, true);

        event.oldDate = new Date(date);
        event.newDate = new Date(d);
        event.element = element;

        if (date == undefined ||
            date.getMonth() !== d.getMonth() ||
            date.getFullYear() !== d.getFullYear()) {
            setCaption(d.toLocaleDateString(locale, { month: "long", year: "numeric" }));
            updateTable(d, this);
        }
        date = d;
        root.dispatchEvent(event);
    }.bind(this);

    this.getDate = function () {
        /// <returns type="Date"/>
        return date;
    }

    this.setElement = function (el) {
        /// <param name="el" type="HTMLElement">Root element.</param>
        /// <returns type="HTMLElement"/>
        if (element != undefined)
            element.parentNode.removeChild(element);

        var header = document.createElement("div");
        var leftMonthArr = document.createElement("i");
        var leftYearArr = document.createElement("i");
        var rightMonthArr = document.createElement("i");
        var rightYearArr = document.createElement("i");

        element = document.createElement("div");
        caption = document.createElement("span");

        leftMonthArr.className = "fa fa-angle-left fa-2";
        leftYearArr.className = "fa fa-angle-double-left fa-1";
        rightMonthArr.className = "fa fa-angle-right fa-2";
        rightYearArr.className = "fa fa-angle-double-right fa-1";

        Compatibility.addClass(element, "calendar-widget");
        Compatibility.addClass(header, "calendar-header");
        Compatibility.addClass(caption, "calendar-caption");

        var incMonth = function () {
            this.setDate(new Date(date).addMonths(1));
        }.bind(this);
        var decMonth = function () {
            this.setDate(new Date(date).addMonths(-1));
        }.bind(this);
        var incYear = function () {
            this.setDate(new Date(date).addYears(1));
        }.bind(this);
        var decYear = function () {
            this.setDate(new Date(date).addYears(-1));
        }.bind(this);

        Compatibility.addEventListener(leftMonthArr, 'click', decMonth);
        Compatibility.addEventListener(leftYearArr, 'click', decYear);
        Compatibility.addEventListener(rightMonthArr, 'click', incMonth);
        Compatibility.addEventListener(rightYearArr, 'click', incYear);

        el.appendChild(element);
        element.appendChild(header);
        header.appendChild(leftMonthArr);
        header.appendChild(leftYearArr);
        header.appendChild(caption);
        header.appendChild(rightYearArr);
        header.appendChild(rightMonthArr);

        Compatibility.addClass(el, "calendar-wrapper");
        root = el;
    }.bind(this);

    if (settings.date == undefined)
        settings.date = new Date();

    if (!settings.locale)
        settings.locale = navigator.language || navigator.userLanguage;

    this.locale = settings.locale;
    this.setElement(settings.element);
    this.setDate(new Date(settings.date));
}



// ================ Date extensions ================== // 
Date.prototype.addMonths = function (months) {
    this.setMonth(this.getMonth() + months);
    return this;
}

Date.prototype.addYears = function (years) {
    this.setFullYear(this.getFullYear() + years);
    return this;
}

Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + days);
    return this;
}

Date.prototype.compareTo = function (other) {
    return this.valueOf() == other.valueOf();
}

Date.prototype.compareDateTo = function (other) {
    return this.getFullYear() == other.getFullYear() &&
        this.getMonth() == other.getMonth() &&
        this.getDate() == other.getDate();
}
