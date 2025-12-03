// !!! ВАЖНО: Замените этот URL на адрес вашего воркера !!!
const API_URL = 'https://empty-bonus-537d.turishevkirill.workers.dev/stats';

const chartContainer = document.getElementById('leaderboard-chart');
const lastUpdatedText = document.getElementById('last-updated-text');

if (chartContainer) {
    async function fetchLeaderboard() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`Ошибка сети: ${response.statusText}`);
            }
            const players = await response.json();
            renderLeaderboard(players);
            updateLastUpdatedTime();
        } catch (error) {
            console.error("Не удалось получить статистику:", error);
            chartContainer.innerHTML = '<div class="loading">😵 Не удалось загрузить статистику.</div>';
        }
    }

    function renderLeaderboard(players) {
        if (!players || players.length === 0) {
            chartContainer.innerHTML = '<div class="loading">🎄 Таблица лидеров пока пуста!</div>';
            return;
        }

        const maxScore = Math.max(...players.map(p => p.baubles));
        const topPlayers = players.slice(0, 15);

        chartContainer.innerHTML = '';

        topPlayers.forEach((player, index) => {
            const barElement = document.createElement('div');
            barElement.classList.add('bar');
            barElement.style.animationDelay = `${index * 0.1}s`;

            const barWidth = maxScore > 0 ? (player.baubles / maxScore) * 100 : 0;

            barElement.innerHTML = `
                <div class="bar-info">
                    <span class="bar-name">${player.first_name}</span>
                    <span class="bar-score">${player.baubles.toLocaleString('ru-RU')} 🎁</span>
                </div>
                <div class="bar-track">
                    <div class="bar-fill" style="width: ${barWidth}%"></div>
                </div>
            `;
            chartContainer.appendChild(barElement);
        });
    }

    function updateLastUpdatedTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        lastUpdatedText.textContent = `Последнее обновление: ${timeString}`;
    }

    // Загружаем статистику при загрузке страницы
    document.addEventListener('DOMContentLoaded', fetchLeaderboard);

    // Обновляем статистику каждые 30 секунд для "прямого эфира"
    setInterval(fetchLeaderboard, 30000);

} else {
    console.error("Контейнер для таблицы лидеров #leaderboard-chart не найден на странице.");
}
