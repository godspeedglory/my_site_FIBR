
const Favorites = {
    key(type) {
        return type === "album"
            ? "favoriteAlbums"
            : "favoriteArtists";
    },

    get(type) {
        try {
            const data = JSON.parse(
                localStorage.getItem(this.key(type))
            );
            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    },

    has(type, id) {
        return this.get(type).includes(id);
    },

    toggle(type, id) {
        const items = this.get(type);
        const exists = items.includes(id);

        const updated = exists
            ? items.filter(item => item !== id)
            : [...items, id];

        localStorage.setItem(
            this.key(type),
            JSON.stringify(updated)
        );

        window.dispatchEvent(
            new CustomEvent("music:favorites-changed", {
                detail: { type, id, added: !exists }
            })
        );

        return !exists;
    },

    clear(type) {
        localStorage.removeItem(this.key(type));

        window.dispatchEvent(
            new CustomEvent("music:favorites-changed", {
                detail: { type, cleared: true }
            })
        );
    }
};

document.addEventListener("DOMContentLoaded", function () {

    function notify(message) {
        if (window.MusicFeatures?.toast) {
            window.MusicFeatures.toast(message);
        }
    }

    function addFavoriteButton(card, type, id) {
        if (card.querySelector(".favorite-heart")) return;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "favorite-heart";

        function update() {
            const active = Favorites.has(type, id);

            button.textContent = active ? "♥" : "♡";
            button.classList.toggle("active", active);

            button.setAttribute(
                "aria-label",
                active
                    ? "Удалить из избранного"
                    : "Добавить в избранное"
            );
        }

        button.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            const added = Favorites.toggle(type, id);
            update();

            notify(
                added
                    ? "Добавлено в избранное"
                    : "Удалено из избранного"
            );
        });

        card.appendChild(button);
        update();

        window.addEventListener(
            "music:favorites-changed",
            update
        );

        window.addEventListener("storage", update);
    }

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

        addFavoriteButton(
            card,
            "artist",
            name.toLowerCase()
        );
    });
});
