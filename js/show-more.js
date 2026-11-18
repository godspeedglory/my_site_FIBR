
document.addEventListener("DOMContentLoaded", function () {
    const PAGE_SIZE = 6;

    function setupShowMore(config) {
        const container = document.querySelector(
            config.container
        );

        const searchInput = document.querySelector(
            config.search
        );

        const emptyMessage = document.querySelector(
            config.empty
        );

        if (!container || !searchInput) return;

        const cards = Array.from(
            container.querySelectorAll(config.card)
        );

        const buttonWrapper = document.createElement("div");
        buttonWrapper.className = "music-show-more-wrapper";

        const showMoreButton = document.createElement("button");
        showMoreButton.type = "button";
        showMoreButton.className = "music-show-more-btn";
        showMoreButton.textContent = "Показать ещё";

        const counter = document.createElement("p");
        counter.className = "music-show-more-counter";
        counter.setAttribute("aria-live", "polite");

        buttonWrapper.append(
            showMoreButton,
            counter
        );

        container.insertAdjacentElement(
            "afterend",
            buttonWrapper
        );

        let limit = PAGE_SIZE;
        let selectedGenre = "all";

        const genreButtons = config.genreButtons
            ? Array.from(
                document.querySelectorAll(
                    config.genreButtons
                )
            )
            : [];

        function getMatchingCards() {
            const searchText = searchInput.value
                .trim()
                .toLowerCase();

            return cards.filter(function (card) {
                let searchableText = "";

                if (config.type === "albums") {
                    searchableText =
                        card.dataset.search ||
                        card.textContent;
                } else {
                    searchableText =
                        card.querySelector("h2")
                            ?.textContent || "";
                }

                const matchesSearch = searchableText
                    .toLowerCase()
                    .includes(searchText);

                const matchesGenre =
                    config.type !== "albums" ||
                    selectedGenre === "all" ||
                    card.dataset.genre === selectedGenre;

                return matchesSearch && matchesGenre;
            });
        }

        function render() {
            const matchingCards = getMatchingCards();
            const visibleCards = matchingCards.slice(
                0,
                limit
            );

            const visibleSet = new Set(visibleCards);

            cards.forEach(function (card) {
                card.hidden = !visibleSet.has(card);
            });

            const visibleCount = visibleCards.length;
            const totalCount = matchingCards.length;
            const hasMore = visibleCount < totalCount;

            showMoreButton.hidden = !hasMore;
            counter.hidden = totalCount === 0;

            counter.textContent =
                "Показано " +
                visibleCount +
                " из " +
                totalCount;

            buttonWrapper.hidden = totalCount === 0;

            if (emptyMessage) {
                emptyMessage.hidden = totalCount > 0;
            }
        }

        function resetAndRender() {
            limit = PAGE_SIZE;
            render();
        }

        searchInput.addEventListener(
            "input",
            resetAndRender
        );

        genreButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                selectedGenre =
                    button.dataset.genre || "all";

                genreButtons.forEach(function (item) {
                    const active = item === button;

                    item.classList.toggle(
                        "active",
                        active
                    );

                    item.setAttribute(
                        "aria-pressed",
                        String(active)
                    );
                });

                resetAndRender();
            });
        });

        showMoreButton.addEventListener(
            "click",
            function () {
                limit += PAGE_SIZE;
                render();
            }
        );

        render();
    }

    if (document.body.classList.contains("albums-page")) {
        setupShowMore({
            type: "albums",
            container: "#albums-catalog",
            card: ".catalog-card",
            search: "#album-search",
            empty: "#albums-empty",
            genreButtons: ".genre-btn"
        });
    }

    if (document.body.classList.contains("artists-page")) {
        setupShowMore({
            type: "artists",
            container: ".artists-grid",
            card: ".artist-tile",
            search: "#artist-search",
            empty: "#artists-empty"
        });
    }
});
