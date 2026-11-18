
document.addEventListener("DOMContentLoaded", function () {

    const main = document.querySelector(".album-main");

    function showError(message) {
        if (!main) return;

        main.innerHTML = "";

        const heading = document.createElement("h1");
        heading.textContent = message;

        const link = document.createElement("a");
        link.href = "albums.html";
        link.className = "album-back";
        link.textContent = "← Вернуться в каталог альбомов";

        main.append(heading, link);
    }

    // Получение данных альбома

    if (
        typeof albumsData === "undefined" ||
        !albumsData
    ) {
        showError("Не удалось загрузить данные альбомов");
        console.error(
            "Проверь подключение файла js/album-data.js"
        );
        return;
    }

    const params = new URLSearchParams(
        window.location.search
    );

    const albumId = params.get("id");
    const album = albumsData[albumId];

    if (!album) {
        showError("Альбом не найден");
        console.error(
            "Не найден альбом с ID:",
            albumId
        );
        return;
    }

    // История просмотров

    if (
        typeof window.MusicFeatures?.remember === "function"
    ) {
        try {
            window.MusicFeatures.remember(albumId);
        } catch (error) {
            console.warn(
                "Не удалось сохранить историю просмотров",
                error
            );
        }
    }

    // Уведомления

    function notify(message) {
        if (typeof window.showToast === "function") {
            window.showToast(message);
        } else if (
            typeof window.MusicFeatures?.toast === "function"
        ) {
            window.MusicFeatures.toast(message);
        }
    }

    // Информация об альбоме

    document.title = album.title + " — MUSIC";

    const cover = document.getElementById("album-cover");
    const title = document.getElementById("album-title");
    const artist = document.getElementById("album-artist");
    const year = document.getElementById("album-year");
    const genre = document.getElementById("album-genre");
    const description = document.getElementById(
        "album-description"
    );

    if (cover) {
        cover.src = album.cover || "";
        cover.alt = album.title || "Обложка альбома";
    }

    if (title) {
        title.textContent = album.title || "";
    }

    if (artist) {
        artist.textContent = album.artist || "";
    }

    if (year) {
        year.textContent = "Год выпуска: " +
            (album.year || "Не указан");
    }

    if (genre) {
        genre.textContent = album.genre || "";
    }

    if (description) {
        description.textContent = album.description || "";
    }

    // Список композиций

    const tracksList = document.getElementById(
        "album-tracks"
    );

    if (tracksList) {
        tracksList.innerHTML = "";

        const tracks = Array.isArray(album.tracks)
            ? album.tracks
            : [];

        if (tracks.length === 0) {
            const message = document.createElement("li");
            message.textContent =
                "Список композиций пока не добавлен.";
            tracksList.appendChild(message);
        } else {
            tracks.forEach(function (track) {
                const li = document.createElement("li");
                li.textContent = track;
                tracksList.appendChild(li);
            });
        }
    }

    // Работа с избранным

    const favoriteButton = document.getElementById(
        "album-favorite"
    );

    function getFavorites() {
        try {
            const data = JSON.parse(
                localStorage.getItem("favoriteAlbums")
            );

            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    }

    function updateFavoriteButton() {
        if (!favoriteButton) return;

        const isFavorite = getFavorites().includes(albumId);

        favoriteButton.textContent = isFavorite
            ? "♥ В избранном"
            : "♡ Добавить в избранное";

        favoriteButton.classList.toggle(
            "is-favorite",
            isFavorite
        );
    }

    if (favoriteButton) {
        favoriteButton.addEventListener(
            "click",
            function () {
                const favorites = getFavorites();
                const exists = favorites.includes(albumId);

                const updated = exists
                    ? favorites.filter(id => id !== albumId)
                    : [...favorites, albumId];

                try {
                    localStorage.setItem(
                        "favoriteAlbums",
                        JSON.stringify(updated)
                    );

                    updateFavoriteButton();

                    notify(
                        exists
                            ? "Альбом удалён из избранного"
                            : "Альбом добавлен в избранное"
                    );

                    window.dispatchEvent(
                        new CustomEvent(
                            "music:favorites-changed",
                            {
                                detail: {
                                    type: "album",
                                    id: albumId,
                                    added: !exists
                                }
                            }
                        )
                    );
                } catch (error) {
                    console.error(
                        "Ошибка сохранения избранного",
                        error
                    );

                    notify(
                        "Не удалось изменить избранное"
                    );
                }
            }
        );

        updateFavoriteButton();
    }

    // Отзывы

    const reviewsKey = "reviews_" + albumId;

    const reviewsContainer = document.getElementById(
        "album-reviews"
    );

    const averageRating = document.getElementById(
        "album-average-rating"
    );

    const reviewForm = document.getElementById(
        "review-form"
    );

    function getReviews() {
        try {
            const data = JSON.parse(
                localStorage.getItem(reviewsKey)
            );

            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    }

    function showReviews() {
        const reviews = getReviews();

        if (!reviewsContainer || !averageRating) return;

        reviewsContainer.innerHTML = "";

        if (reviews.length === 0) {
            averageRating.textContent =
                "Пока нет оценок";

            reviewsContainer.textContent =
                "Отзывов пока нет. Будьте первым!";

            return;
        }

        const total = reviews.reduce(
            (sum, review) =>
                sum + Number(review.rating || 0),
            0
        );

        const average = (
            total / reviews.length
        ).toFixed(1);

        averageRating.textContent =
            "Средняя оценка: ★ " +
            average +
            " (" +
            reviews.length +
            " отзывов)";

        reviews.slice().reverse().forEach(
            function (review) {
                const card = document.createElement("div");
                card.className = "review-card";

                const heading = document.createElement("h4");
                heading.textContent = review.name || "Гость";

                const stars = document.createElement("p");
                stars.className = "review-stars";

                const rating = Math.max(
                    0,
                    Math.min(5, Number(review.rating) || 0)
                );

                stars.textContent = "★".repeat(rating);

                const text = document.createElement("p");
                text.textContent = review.text || "";

                card.append(heading, stars, text);
                reviewsContainer.appendChild(card);
            }
        );
    }

    if (reviewForm) {
        reviewForm.addEventListener(
            "submit",
            function (event) {
                event.preventDefault();

                const name = document.getElementById(
                    "review-name"
                )?.value.trim();

                const rating = Number(
                    document.getElementById(
                        "review-rating"
                    )?.value
                );

                const text = document.getElementById(
                    "review-text"
                )?.value.trim();

                if (
                    !name ||
                    !text ||
                    !Number.isInteger(rating) ||
                    rating < 1 ||
                    rating > 5
                ) {
                    notify(
                        "Заполните все поля отзыва"
                    );
                    return;
                }

                const reviews = getReviews();

                reviews.push({
                    name: name,
                    rating: rating,
                    text: text
                });

                try {
                    localStorage.setItem(
                        reviewsKey,
                        JSON.stringify(reviews)
                    );

                    reviewForm.reset();
                    showReviews();

                    notify(
                        "Отзыв успешно опубликован"
                    );
                } catch (error) {
                    console.error(
                        "Ошибка сохранения отзыва",
                        error
                    );

                    notify(
                        "Не удалось сохранить отзыв"
                    );
                }
            }
        );
    }

    showReviews();
});
