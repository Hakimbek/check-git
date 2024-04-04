(function(win) {
    win.history.pushState(null, null, win.location.href);
    win.onpopstate = function () {
        win.history.forward();
    };
    win.history.back();
})(window);
