
window.BASE_PATH = "";
(function() {
    const parts = window.location.pathname.split("/").filter(x => x.length > 0);
    if (window.location.hostname === "localhost") {
        window.BASE_PATH = "";
        return;
    }
    if (parts.length > 0) {
        window.BASE_PATH = "/" + parts[0];
    }
})();
