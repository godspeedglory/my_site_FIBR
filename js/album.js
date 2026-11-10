document.addEventListener("DOMContentLoaded", function () {

    const params = new URLSearchParams(window.location.search);
    const albumId = params.get("id");
    const album = albumsData[albumId];

    if (!album) {
        document.querySelector(".album-main").innerHTML =
            "<h1>Альбом не найден</h1>" +
            '<a href="albums.html">Вернуться в каталог</a>';
        return;
    }

    document.title = album.title + " — Музыкальный каталог";

    document.getElementById("album-cover").src = album.cover;
    document.getElementById("album-cover").alt = album.title;
    document.getElementById("album-title").textContent = album.title;
    document.getElementById("album-artist").textContent = album.artist;
    document.getElementById("album-year").textContent =
        "Год выпуска: " + album.year;
    document.getElementById("album-genre").textContent = album.genre;
    document.getElementById("album-description").textContent =
        album.description;

    const tracksList = document.getElementById("album-tracks");

    if (album.tracks.length === 0) {
        const message = document.createElement("p");
        message.textContent = "Список композиций пока не добавлен.";
        tracksList.replaceWith(message);
    } else {
        album.tracks.forEach(function (track) {
            const li = document.createElement("li");
            li.textContent = track;
            tracksList.appendChild(li);
        });
    }

    // Избранное

    const favoriteButton = document.getElementById("album-favorite");

    function getFavorites() {
        try {
            return JSON.parse(localStorage.getItem("favoriteAlbums")) || [];
        } catch {
            return [];
        }
    }

    function updateFavoriteButton() {
        const favorites = getFavorites();

        if (favorites.includes(album.id)) {
            favoriteButton.textContent = "♥ В избранном";
            favoriteButton.classList.add("is-favorite");
        } else {
            favoriteButton.textContent = "♡ Добавить в избранное";
            favoriteButton.classList.remove("is-favorite");
        }
    }

    favoriteButton.addEventListener("click", function () {
        let favorites = getFavorites();

        if (favorites.includes(album.id)) {
            favorites = favorites.filter(function (id) {
                return id !== album.id;
            });
        } else {
            favorites.push(album.id);
        }

        localStorage.setItem(
            "favoriteAlbums",
            JSON.stringify(favorites)
        );

        updateFavoriteButton();
    });

    updateFavoriteButton();

    // Отзывы

    const reviewsKey = "reviews_" + album.id;
    const reviewsContainer = document.getElementById("album-reviews");
    const averageRating = document.getElementById("album-average-rating");
    const reviewForm = document.getElementById("review-form");

    function getReviews() {
        try {
            return JSON.parse(localStorage.getItem(reviewsKey)) || [];
        } catch {
            return [];
        }
    }

    function showReviews() {
        const reviews = getReviews();

        reviewsContainer.innerHTML = "";

        if (reviews.length === 0) {
            averageRating.textContent = "Пока нет оценок";
            reviewsContainer.textContent =
                "Отзывов пока нет. Будьте первым!";
            return;
        }

        const total = reviews.reduce(function (sum, review) {
            return sum + Number(review.rating);
        }, 0);

        const average = (total / reviews.length).toFixed(1);

        averageRating.textContent =
            "Средняя оценка: ★ " + average +
            " (" + reviews.length + " отзывов)";

        reviews.slice().reverse().forEach(function (review) {

            const card = document.createElement("div");
            card.className = "review-card";

            const heading = document.createElement("h4");
            heading.textContent = review.name;

            const stars = document.createElement("p");
            stars.className = "review-stars";
            stars.textContent = "★".repeat(Number(review.rating));

            const text = document.createElement("p");
            text.textContent = review.text;

            card.appendChild(heading);
            card.appendChild(stars);
            card.appendChild(text);

            reviewsContainer.appendChild(card);
        });
    }

    reviewForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("review-name")
            .value.trim();

        const rating = Number(
            document.getElementById("review-rating").value
        );

        const text = document.getElementById("review-text")
            .value.trim();

        if (!name || !text || rating < 1 || rating > 5) {
            return;
        }

        const reviews = getReviews();

        reviews.push({
            name: name,
            rating: rating,
            text: text
        });

        localStorage.setItem(
            reviewsKey,
            JSON.stringify(reviews)
        );

        reviewForm.reset();
        showReviews();
    });

    showReviews();
});
