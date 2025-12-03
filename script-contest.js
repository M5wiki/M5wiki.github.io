const API_URL = 'https://empty-bonus-537d.turishevkirill.workers.dev/stats';

const leaderboardElement = document.getElementById('leaderboard');

async function fetchLeaderboard() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Ошибка сети: ${response.statusText}`);
        }
        const players = await response.json();
        renderLeaderboard(players);
    } catch (error) {
        console.error("Не удалось получить статистику:", error);
        leaderboardElement.innerHTML = '<div class="loading">😵 Не удалось загрузить статистику. Попробуйте позже.</div>';
    }
}

function renderLeaderboard(players) {
    if (!players || players.length === 0) {
        leaderboardElement.innerHTML = '<div class="loading">🎄 Таблица лидеров пока пуста!</div>';
        return;
    }

    leaderboardElement.innerHTML = '';

    players.forEach((player, index) => {
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player');

        const rank = index + 1;
        let rankDisplay = rank;
        if (rank === 1) rankDisplay = '🥇';
        else if (rank === 2) rankDisplay = '🥈';
        else if (rank === 3) rankDisplay = '🥉';

        playerDiv.innerHTML = `
            <span class="rank">${rankDisplay}</span>
            <span class="name">${player.first_name}</span>
            <span class="score">${player.baubles.toLocaleString('ru-RU')} 🎁</span>
        `;
        leaderboardElement.appendChild(playerDiv);
    });
}

// Загружаем статистику при загрузке страницы
document.addEventListener('DOMContentLoaded', fetchLeaderboard);

// Обновляем статистику каждые 30 секунд
setInterval(fetchLeaderboard, 30000);
