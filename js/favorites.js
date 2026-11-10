
const Favorites = {
    get(type) {
        const key = type === "album"
            ? "favoriteAlbums"
            : "favoriteArtists";

        try {
            const data = JSON.parse(localStorage.getItem(key));
            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    },

    has(type, id) {
        return this.get(type).includes(id);
    },

    toggle(type, id) {
        const key = type === "album"
            ? "favoriteAlbums"
            : "favoriteArtists";

        let items = this.get(type);

        if (items.includes(id)) {
            items = items.filter(item => item !== id);
        } else {
            items.push(id);
        }

        localStorage.setItem(key, JSON.stringify(items));

        return items.includes(id);
    }
};

document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll(".catalog-card").forEach(card => {
        const link = card.querySelector("h3 a");
        if (!link) return;

        const id = new URL(link.href).searchParams.get("id");
        if (!id) return;

        addFavoriteButton(card, "album", id);
    });

    document.querySelectorAll(".artist-tile").forEach(card => {
        const name = card.querySelector("h2")?.textContent.trim();
        if (!name) return;

        const id = name.toLowerCase();
        addFavoriteButton(card, "artist", id);
    });

    function addFavoriteButton(card, type, id) {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "favorite-heart";

        function update() {
            const active = Favorites.has(type, id);

            button.textContent = active ? "♥" : "♡";
            button.classList.toggle("active", active);
            button.setAttribute(
                "aria-label",
                active ? "Удалить из избранного" : "Добавить в избранное"
            );
        }

        button.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            Favorites.toggle(type, id);
            update();
        });

        card.appendChild(button);
        update();
    }
});
