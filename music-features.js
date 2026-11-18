
(() => {
  const KEY = "musicRecentlyViewed";

  function read(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  window.MusicFeatures = {
    history() {
      return read(KEY);
    },

    remember(id) {
      if (!id) return;

      try {
        const history = [
          id,
          ...read(KEY).filter(item => item !== id)
        ].slice(0, 5);

        localStorage.setItem(KEY, JSON.stringify(history));
      } catch {}
    },

    toast(message) {
      let container = document.querySelector(
        ".music-toast-container"
      );

      if (!container) {
        container = document.createElement("div");
        container.className = "music-toast-container";
        container.setAttribute("aria-live", "polite");
        document.body.append(container);
      }

      const toast = document.createElement("div");
      toast.className = "music-toast";
      toast.textContent = message;

      container.append(toast);

      setTimeout(() => {
        toast.classList.add("is-leaving");

        setTimeout(() => toast.remove(), 250);
      }, 2800);
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    const historyGrid = document.getElementById(
      "music-history-grid"
    );

    if (
      historyGrid &&
      typeof albumsData !== "undefined"
    ) {
      const history = window.MusicFeatures.history()
        .map(id => albumsData[id])
        .filter(Boolean);

      const section = document.getElementById(
        "music-history-section"
      );

      if (section) {
        section.hidden = history.length === 0;
      }

      history.forEach(album => {
        const link = document.createElement("a");
        link.className = "music-history-card";
        link.href = "album.html?id=" +
          encodeURIComponent(album.id);

        const img = document.createElement("img");
        img.src = album.cover;
        img.alt = album.title;
        img.loading = "lazy";

        const title = document.createElement("strong");
        title.textContent = album.title;

        const artist = document.createElement("span");
        artist.textContent = album.artist;

        link.append(img, title, artist);
        historyGrid.append(link);
      });
    }

    const factText = document.getElementById(
      "music-fact-text"
    );

    const nextFact = document.getElementById(
      "music-next-fact"
    );

    if (factText && nextFact) {
      const facts = [
        "Музыка может вызывать яркие автобиографические воспоминания.",
        "Темп музыкального произведения обычно измеряют в ударах в минуту — BPM.",
        "Виниловая пластинка воспроизводит звук с помощью механических колебаний иглы.",
        "Синтезатор создаёт звуки электронным способом.",
        "Плейлист может объединять композиции разных жанров вокруг одного настроения.",
        "Стереозапись позволяет передавать разное звучание в левый и правый каналы."
      ];

      let index = 0;
      factText.textContent = facts[index];

      nextFact.addEventListener("click", () => {
        index = (index + 1) % facts.length;
        factText.textContent = facts[index];
      });
    }
  });
})();
