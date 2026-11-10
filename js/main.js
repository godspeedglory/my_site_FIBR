
document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("album-search");
    const genreFilter = document.getElementById("genre-filter");
    const countryFilter = document.getElementById("country-filter");
    const yearFilter = document.getElementById("year-filter");
    const ratingFilter = document.getElementById("rating-filter");
    const sortFilter = document.getElementById("sort-filter");
    const resetButton = document.getElementById("reset-filters");

    const catalog = document.getElementById("albums-catalog");
    const cards = Array.from(catalog.querySelectorAll(".catalog-card"));
    const emptyMessage = document.getElementById("albums-empty");

    function updateAlbums() {

        const search = searchInput.value.trim().toLowerCase();
        const genre = genreFilter.value;
        const country = countryFilter.value;
        const year = yearFilter.value;
        const minRating = Number(ratingFilter.value);
        const sort = sortFilter.value;

        let visibleCount = 0;

        cards.forEach(function (card) {

            const matchesSearch =
                card.dataset.search.toLowerCase().includes(search);

            const matchesGenre =
                genre === "all" || card.dataset.genre === genre;

            const matchesCountry =
                country === "all" || card.dataset.country === country;

            const matchesYear =
                year === "all" || card.dataset.year === year;

            const matchesRating =
                Number(card.dataset.rating) >= minRating;

            const visible =
                matchesSearch &&
                matchesGenre &&
                matchesCountry &&
                matchesYear &&
                matchesRating;

            card.hidden = !visible;

            if (visible) {
                visibleCount++;
            }
        });

        const sortedCards = [...cards];

        sortedCards.sort(function (a, b) {

            if (sort === "popularity") {
                return Number(b.dataset.popularity) -
                       Number(a.dataset.popularity);
            }

            if (sort === "rating") {
                return Number(b.dataset.rating) -
                       Number(a.dataset.rating);
            }

            if (sort === "date-desc") {
                return Number(b.dataset.year) -
                       Number(a.dataset.year);
            }

            if (sort === "date-asc") {
                return Number(a.dataset.year) -
                       Number(b.dataset.year);
            }

            return 0;
        });

        sortedCards.forEach(function (card) {
            catalog.appendChild(card);
        });

        emptyMessage.hidden = visibleCount > 0;
    }

    [
        searchInput,
        genreFilter,
        countryFilter,
        yearFilter,
        ratingFilter,
        sortFilter
    ].forEach(function (element) {
        element.addEventListener("input", updateAlbums);
    });

    resetButton.addEventListener("click", function () {
        searchInput.value = "";
        genreFilter.value = "all";
        countryFilter.value = "all";
        yearFilter.value = "all";
        ratingFilter.value = "0";
        sortFilter.value = "popularity";

        updateAlbums();
    });

    updateAlbums();
});
