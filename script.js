document.addEventListener('DOMContentLoaded', function() {
    // --- Загрузка компонентов ---

    // Загружаем футер
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Ошибка загрузки футера:', error));

    // Загружаем боковую панель
    fetch('sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar-placeholder').innerHTML = data;
            // После загрузки панели, инициализируем её функциональность
            initSidebar();       // Функция для открытия/закрытия панели
            initSidebarTree();   // ВАЖНО: Вызываем обновленную функцию
        })
        .catch(error => console.error('Ошибка загрузки боковой панели:', error));

    // --- Функциональность боковой панели (открытие/закрытие) ---
    function initSidebar() {
        const menuToggle = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('site-tree-sidebar');
        const closeBtn = document.querySelector('.closebtn');

        if (menuToggle && sidebar && closeBtn) {
            // Открываем/закрываем меню по клику на кнопку
            menuToggle.addEventListener('click', function(event) {
                event.stopPropagation();
                sidebar.classList.toggle('open');
            });

            // Закрываем меню по клику на крестик
            closeBtn.addEventListener('click', function() {
                sidebar.classList.remove('open');
            });

            // Закрываем меню по клику вне его области
            document.addEventListener('click', function(event) {
                if (!sidebar.contains(event.target) && event.target !== menuToggle) {
                    sidebar.classList.remove('open');
                }
            });
        }
    }

    // --- ОБНОВЛЕННАЯ ФУНКЦИЯ: Логика для дерева навигации ---
    function initSidebarTree() {
        // Находим все стрелочки, а не родительские пункты
        const arrows = document.querySelectorAll('.sidebar-content .arrow');

        arrows.forEach(arrow => {
            // Вешаем обработчик клика ТОЛЬКО на стрелочку
            arrow.addEventListener('click', function(event) {
                // Предотвращаем "всплытие" события, чтобы клик не сработал на родительских элементах
                event.stopPropagation(); 

                // Находим родительский <li>, чтобы переключить его класс
                const parentLi = arrow.closest('.has-children');
                
                if (parentLi) {
                    // Переключаем класс, который управляет видимостью подпунктов
                    parentLi.classList.toggle('expanded');
                }
            });
        });
    }
});