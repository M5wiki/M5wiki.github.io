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
        chartContainer.innerHTML = '<div class="contest-loading">🎄 Таблица лидеров пока пуста!</div>';
        return;
    }

    const maxScore = Math.max(...players.map(p => p.baubles));
    const topPlayers = players.slice(0, 15);

    chartContainer.innerHTML = '';

    topPlayers.forEach((player, index) => {
        const barElement = document.createElement('div');
        barElement.classList.add('contest-bar');
        barElement.style.animationDelay = `${index * 0.15}s`; // Увеличим задержку для плавности

        const barWidth = maxScore > 0 ? (player.baubles / maxScore) * 100 : 0;

        barElement.innerHTML = `
            <div class="contest-bar-info">
                <span class="contest-bar-name">${player.first_name}</span>
                <span class="contest-bar-score">${player.baubles.toLocaleString('ru-RU')} 🎁</span>
            </div>
            <div class="contest-bar-track">
                <div class="contest-bar-fill" style="width: 0%;" data-width="${barWidth}%"></div>
            </div>
        `;
        chartContainer.appendChild(barElement);
    });

    // Запускаем анимацию заливки ПОСЛЕ того, как все элементы появились
    const totalDelay = 100 + (topPlayers.length * 150);
    setTimeout(() => {
        document.querySelectorAll('.contest-bar-fill').forEach(el => {
            el.style.width = el.dataset.width;
        });
    }, totalDelay);
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
