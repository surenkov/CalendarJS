window.Compatibility = {};

Compatibility.addEventListener = function (el, evt, func) {
    if (el.addEventListener)
        el.addEventListener(evt, func, false);
    else if (el.attachEvent)
        el.attachEvent("on" + evt, func);
    else
        el["on" + evt] = func;
};

Compatibility.addClass = function (el, cl) {
    if (el.classList)
        el.classList.add(cl);
    else if (el.className)
        el.className = [el.className, cl].join(' ');
    else
        el["class"] = [el["class"], cl].join(' ');
};

Compatibility.setData = function (el, name, data) {
    if (el.dataset)
        el.dataset[name] = data;
    else if (el.setAttribute)
        el.setAttribute("data-" + name, data);
    else
        el["data-" + name] = data;
}

Compatibility.getData = function (el, name) {
    if (el.dataset)
        return el.dataset[name];
    else if (el.getAttribute)
        return el.getAttribute("data-" + name);
    else
        return el["data-" + name];
}

Compatibility.removeClass = function (el, cl) {
    if (el.classList)
        el.classList.remove(cl);
    else {
        var classes = el.className.split(' ');
        var idx = classes.indexOf(cl);
        var arr = [];

        for (var i = 0; i < classes.length; i++)
            if (classes[i] != cl)
                arr.push(classes[i]);

        el.className = arr.join(' ');
    }
};


if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () { },
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                                       ? this
                                       : oThis,
                                     aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    }
}