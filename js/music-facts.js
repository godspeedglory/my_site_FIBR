
document.addEventListener("DOMContentLoaded", function () {
    const factText = document.getElementById("music-fact-text");
    const nextButton = document.getElementById("music-next-fact");

    if (!factText || !nextButton) {
        console.warn("Блок интересных фактов не найден");
        return;
    }

    const facts = [
        "Музыка может вызывать яркие воспоминания о событиях из жизни.",
        "Темп музыкального произведения измеряется в BPM — ударах в минуту.",
        "Виниловые пластинки воспроизводят звук с помощью колебаний иглы.",
        "Синтезаторы создают звуки электронным способом.",
        "Первый музыкальный инструмент мог появиться десятки тысяч лет назад.",
        "Стереозвук использует два канала — левый и правый.",
        "Музыка способна влиять на настроение и эмоциональное состояние.",
        "Плейлисты часто составляют не только по жанрам, но и по настроению."
    ];

    let currentIndex = 0;

    function showFact() {
        factText.textContent = facts[currentIndex];
    }

    nextButton.addEventListener("click", function () {
        currentIndex = (currentIndex + 1) % facts.length;
        showFact();
    });

    showFact();
});
