
document.addEventListener("DOMContentLoaded", function () {

    const artists = {
        "kai angel": {
            name: "Kai Angel",
            image: "https://avatars.yandex.net/get-music-content/20164422/7997c3d6.p.16509384/m1000x1000",
            url: "artists/kai-angel.html"
        },
        "9mice": {
            name: "9mice",
            image: "https://i.pinimg.com/736x/85/14/c3/8514c307a777951ffd571ac79f71d1ed.jpg",
            url: "artists/9mice.html"
        },
        "макулатура": {
            name: "макулатура",
            image: "https://ponominalu.ru/media/library/original/b1-eb-b1ebe5019c5eb6ec57b092ded605a29c.jpeg",
            url: "artists/makulatura.html"
        },
        "girl in red": {
            name: "girl in red",
            image: "https://avatars.yandex.net/get-music-content/4010467/d84c3493.p.5913514/m1000x1000",
            url: "artists/girl-in-red.html"
        },
        "pharaoh": {
            name: "PHARAOH",
            image: "https://cdn.forbes.ru/forbes-static/new/2022/04/ph5-626a67c99574a.jpg",
            url: "artists/pharaoh.html"
        },
        "щенки": {
            name: "ЩЕНКИ",
            image: "https://images.genius.com/f496889ceaaca2badc7b73c4cdc935e3.1000x1000x1.jpg",
            url: "artists/shchenki.html"
        },
        "вышел покурить": {
            name: "вышел покурить",
            image: "https://i.pinimg.com/736x/b5/fd/e6/b5fde611a116fc30fbb7d062093ee684.jpg",
            url: "artists/vyshel-pokurit.html"
        }
    };

    const albumItems = Object.fromEntries(
        Object.entries(albumsData).map(([id, album]) => [
            id,
            {
                ...album,
                url: "album.html?id=" + encodeURIComponent(id)
            }
        ])
    );

    function notify(message) {
        window.MusicFeatures?.toast?.(message);
    }

    function createCard(type, id, item) {
        const card = document.createElement("article");
        card.className = "favorites-card";

        const link = document.createElement("a");
        link.href = item.url;

        const image = document.createElement("img");
        image.src = item.image || item.cover;
        image.alt = item.name || item.title;
        image.loading = "lazy";

        const title = document.createElement("h3");
        title.textContent = item.name || item.title;

        const description = document.createElement("p");
        description.textContent = type === "album"
            ? item.artist + " · " + item.year
            : "Исполнитель";

        link.append(image, title, description);
        card.appendChild(link);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "favorite-heart active";
        button.textContent = "♥";
        button.setAttribute(
            "aria-label",
            "Удалить из избранного"
        );

        button.addEventListener("click", function () {
            Favorites.toggle(type, id);
            notify("Удалено из избранного");
        });

        card.appendChild(button);
        return card;
    }

    function renderSection(type, data, gridId, emptyId, countId) {
        const grid = document.getElementById(gridId);
        const empty = document.getElementById(emptyId);
        const counter = document.getElementById(countId);

        const selected = Favorites.get(type).filter(id => data[id]);

        grid.replaceChildren(
            ...selected.map(id => createCard(type, id, data[id]))
        );

        empty.hidden = selected.length > 0;
        if (counter) counter.textContent = selected.length;
    }

    function renderFavorites() {
        renderSection(
            "artist", artists,
            "favorite-artists", "empty-artists",
            "favorite-artists-count"
        );

        renderSection(
            "album", albumItems,
            "favorite-albums", "empty-albums",
            "favorite-albums-count"
        );

        const clearButton = document.getElementById(
            "clear-all-favorites"
        );

        if (clearButton) {
            clearButton.disabled =
                Favorites.get("artist").length === 0 &&
                Favorites.get("album").length === 0;
        }
    }

    document.getElementById("clear-all-favorites")
        ?.addEventListener("click", function () {

            const confirmed = window.confirm(
                "Удалить всех исполнителей и альбомы из избранного?"
            );

            if (!confirmed) return;

            Favorites.clear("artist");
            Favorites.clear("album");

            notify("Избранное очищено");
        });

    window.addEventListener(
        "music:favorites-changed",
        renderFavorites
    );

    window.addEventListener("storage", renderFavorites);

    renderFavorites();
});
