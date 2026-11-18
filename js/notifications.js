
(function () {
    function showToast(message) {
        let container = document.querySelector(
            ".music-toast-container"
        );

        if (!container) {
            container = document.createElement("div");
            container.className = "music-toast-container";
            container.setAttribute("aria-live", "polite");
            document.body.appendChild(container);
        }

        const toast = document.createElement("div");
        toast.className = "music-toast";
        toast.textContent = message;

        container.appendChild(toast);

        setTimeout(function () {
            toast.classList.add("is-leaving");

            setTimeout(function () {
                toast.remove();
            }, 250);
        }, 2800);
    }

    window.showToast = showToast;

    window.MusicFeatures = window.MusicFeatures || {};
    window.MusicFeatures.toast = showToast;
})();
