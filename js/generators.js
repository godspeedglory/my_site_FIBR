
document.addEventListener("DOMContentLoaded", function () {

    const randomButton = document.getElementById("random-album-btn");
    const moodButton = document.getElementById("mood-album-btn");

    const randomSection = document.getElementById("random-generator");
    const moodSection = document.getElementById("mood-generator");

    const generateButton = document.getElementById("generate-random");
    const randomResult = document.getElementById("random-album-result");
    const moodResults = document.getElementById("mood-results");

    const albums = Object.values(albumsData);

    let previousAlbumId = null;

    // Переключение генераторов

    randomButton.addEventListener("click", function () {
        randomSection.hidden = false;
        moodSection.hidden = true;

        randomSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    moodButton.addEventListener("click", function () {
        moodSection.hidden = false;
        randomSection.hidden = true;

        moodSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    // Создание карточки альбома

    function createAlbumCard(album) {

        const card = document.createElement("article");
        card.className = "generator-album-card";

        const link = document.createElement("a");
        link.href = "album.html?id=" + encodeURIComponent(album.id);

        const image = document.createElement("img");
        image.src = album.cover;
        image.alt = album.title;

        const title = document.createElement("h3");
        title.textContent = album.title;

        const artist = document.createElement("p");
        artist.textContent = album.artist;

        const year = document.createElement("span");
        year.textContent = album.year;

        const action = document.createElement("div");
        action.className = "generator-open";
        action.textContent = "Подробнее об альбоме →";

        link.append(image, title, artist, year, action);
        card.appendChild(link);

        return card;
    }

    // Случайный альбом

    function generateRandomAlbum() {

        if (albums.length === 0) {
            randomResult.textContent = "Альбомы не найдены.";
            return;
        }

        let availableAlbums = albums;

        if (albums.length > 1) {
            availableAlbums = albums.filter(function (album) {
                return album.id !== previousAlbumId;
            });
        }

        const randomIndex = Math.floor(
            Math.random() * availableAlbums.length
        );

        const selectedAlbum = availableAlbums[randomIndex];

        previousAlbumId = selectedAlbum.id;

        randomResult.replaceChildren(
            createAlbumCard(selectedAlbum)
        );
    }

    generateButton.addEventListener("click", generateRandomAlbum);

    // Подбор по настроению
    // Это пример авторской классификации альбомов.

    const moodAlbums = {
        happy: [
            "im-doing-it-again-baby",
            "shh",
            "9mm"
        ],

        sad: [
            "plyazh",
            "seans",
            "if-i-could-make-it-go-quiet"
        ],

        energetic: [
            "heavy-metal-2",
            "god-system",
            "damage",
            "9mm"
        ],

        calm: [
            "if-i-could-make-it-go-quiet",
            "plyazh",
            "angel-may-cry"
        ],

        dark: [
            "orpheus",
            "asphalt",
            "damage",
            "seans"
        ]
    };

    const moodButtons = document.querySelectorAll(
        ".mood-buttons button"
    );

    moodButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            moodButtons.forEach(function (btn) {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            const selectedMood = button.dataset.mood;
            const albumIds = moodAlbums[selectedMood] || [];

            moodResults.replaceChildren();

            albumIds.forEach(function (id) {

                const album = albumsData[id];

                if (album) {
                    moodResults.appendChild(
                        createAlbumCard(album)
                    );
                }
            });

            if (!moodResults.children.length) {
                moodResults.textContent =
                    "Для этого настроения пока нет альбомов.";
            }
        });
    });
});
