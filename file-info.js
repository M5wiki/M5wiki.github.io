const OWNER = "M5wiki";
const REPO = "M5wiki.github.io"; 

async function loadFileInfo() {
    const container = document.getElementById("file-info");
    const filePath = container.dataset.file;

    const apiURL = `https://api.github.com/repos/${OWNER}/${REPO}/commits?path=${filePath}&per_page=1`;

    container.textContent = "Загрузка информации...";

    try {
        const response = await fetch(apiURL);
        const commits = await response.json();

        if (!commits.length) {
            container.textContent = "Данные о файле не найдены.";
            return;
        }

        const commit = commits[0];
        const author = commit.commit.author.name;
        const date = new Date(commit.commit.author.date).toLocaleString();

        container.innerHTML = `
            Автор: ${author} Дата: ${date}
        `;
    } catch {
        container.textContent = "Ошибка загрузки данных.";
    }
}

loadFileInfo();
