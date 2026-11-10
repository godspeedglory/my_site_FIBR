
document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("artist-search");
    const artistCards = document.querySelectorAll(".artist-tile");
    const emptyMessage = document.getElementById("artists-empty");

    searchInput.addEventListener("input", function () {

        const searchText = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        artistCards.forEach(function (card) {

            const artistName = card.querySelector("h2")
                .textContent.toLowerCase();

            const matches = artistName.includes(searchText);

            card.hidden = !matches;

            if (matches) {
                visibleCount++;
            }
        });

        emptyMessage.hidden = visibleCount > 0;
    });
});
