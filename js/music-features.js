
(function () {
    "use strict";

    const HISTORY_KEY = "music-recently-viewed";
    const MAX_HISTORY = 6;

    function getHistory() {
        try {
            const saved = JSON.parse(
                localStorage.getItem(HISTORY_KEY) || "[]"
            );

            return Array.isArray(saved) ? saved : [];
        } catch (error) {
            console.warn("Ошибка чтения истории", error);
            return [];
        }
    }

    function remember(albumId) {
        if (!albumId) return;

        const history = getHistory().filter(
            id => id !== albumId
        );

        history.unshift(albumId);

        try {
            localStorage.setItem(
                HISTORY_KEY,
                JSON.stringify(history.slice(0, MAX_HISTORY))
            );
        } catch (error) {
            console.warn("Ошибка сохранения истории", error);
        }
    }

    function renderHistory() {
        const section = document.getElementById(
            "music-history-section"
        );

        const grid = document.getElementById(
            "music-history-grid"
        );

        if (!section || !grid) return;

        const history = getHistory();

        grid.innerHTML = "";

        if (
            history.length === 0 ||
            typeof albumsData === "undefined"
        ) {
            section.hidden = true;
            return;
        }

        let count = 0;

        history.forEach(function (id) {
            const album = albumsData[id];

            if (!album) return;

            const card = document.createElement("a");
            card.href = "album.html?id=" +
                encodeURIComponent(id);
            card.className = "music-history-card";

            const image = document.createElement("img");
            image.src = album.cover || "";
            image.alt = album.title || "Обложка альбома";
            image.loading = "lazy";

            const title = document.createElement("h3");
            title.textContent = album.title || "";

            const artist = document.createElement("p");
            artist.textContent = album.artist || "";

            card.append(image, title, artist);
            grid.appendChild(card);

            count++;
        });

        section.hidden = count === 0;
    }

    window.MusicFeatures = window.MusicFeatures || {};
    window.MusicFeatures.remember = remember;
    window.MusicFeatures.getHistory = getHistory;
    window.MusicFeatures.renderHistory = renderHistory;

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            renderHistory
        );
    } else {
        renderHistory();
    }
})();
