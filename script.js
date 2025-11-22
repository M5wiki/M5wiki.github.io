document.addEventListener('DOMContentLoaded', function() {

    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Ошибка загрузки футера:', error));

    fetch('sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar-placeholder').innerHTML = data;
            initSidebar();       
            initSidebarTree();   
        })
        .catch(error => console.error('Ошибка загрузки боковой панели:', error));

    function initSidebar() {
        const menuToggle = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('site-tree-sidebar');
        const closeBtn = document.querySelector('.closebtn');

        if (menuToggle && sidebar && closeBtn) {
            menuToggle.addEventListener('click', function(event) {
                event.stopPropagation();
                sidebar.classList.toggle('open');
            });

            closeBtn.addEventListener('click', function() {
                sidebar.classList.remove('open');
            });

            document.addEventListener('click', function(event) {
                if (!sidebar.contains(event.target) && event.target !== menuToggle) {
                    sidebar.classList.remove('open');
                }
            });
        }
    }

    function initSidebarTree() {
        const arrows = document.querySelectorAll('.sidebar-content .arrow');

        arrows.forEach(arrow => {
            arrow.addEventListener('click', function(event) {
                event.stopPropagation(); 

                const parentLi = arrow.closest('.has-children');
                
                if (parentLi) {
                    parentLi.classList.toggle('expanded');
                }
            });
        });
    }
});