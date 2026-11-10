
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
            url: null
        },
        "щенки": {
            name: "ЩЕНКИ",
            image: "https://images.genius.com/f496889ceaaca2badc7b73c4cdc935e3.1000x1000x1.jpg",
            url: null
        },
        "вышел покурить": {
            name: "вышел покурить",
            image: "https://i.pinimg.com/736x/b5/fd/e6/b5fde611a116fc30fbb7d062093ee684.jpg",
            url: null
        }
    };

    function createCard(type, id, item) {

        const card = document.createElement("article");
        card.className = "favorites-card";

        const link = document.createElement(
            item.url ? "a" : "div"
        );

        if (item.url) {
            link.href = item.url;
        }

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
            renderFavorites();
        });

        card.appendChild(button);

        return card;
    }

    function renderSection(type, data, containerId, emptyId) {

        const container = document.getElementById(containerId);
        const emptyMessage = document.getElementById(emptyId);

        container.replaceChildren();

        const selected = Favorites.get(type)
            .filter(id => data[id]);

        selected.forEach(function (id) {

            const card = createCard(type, id, data[id]);

            container.appendChild(card);
        });

        emptyMessage.hidden = selected.length > 0;
    }

    function renderFavorites() {

        renderSection(
            "artist",
            artists,
            "favorite-artists",
            "empty-artists"
        );

        const albums = {};

        Object.entries(albumsData).forEach(function ([id, album]) {
            albums[id] = {
                ...album,
                url: "album.html?id=" + encodeURIComponent(id)
            };
        });

        renderSection(
            "album",
            albums,
            "favorite-albums",
            "empty-albums"
        );
    }

    renderFavorites();

    window.addEventListener("storage", renderFavorites);
});
