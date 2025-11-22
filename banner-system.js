// Файл: banner-system.js
(function() {
    // Проверяем, нужно ли показывать баннер
    const shouldShowBanner = () => {
        // Здесь ваша логика проверки условия "script"
        // Например, можно проверить переменную, cookie, localStorage или параметр URL
        return window.SHOW_BANNER || 
               localStorage.getItem('showBanner') || 
               new URLSearchParams(window.location.search).get('script');
    };

    // Данные для всех баннеров
    const banners = {
        '1': {
            icon: '🔒',
            title: 'Ограниченный доступ.',
            text: 'Некоторые материалы на этой странице доступны только определённым пользователям.',
            color: '#949494'
        },
        '2': {
            icon: '🛠️',
            title: 'Этот раздел будет переработан.',
            text: 'Данный раздел в процессе обновления и будет изменён. Актуальная информация появится позже.',
            color: '#ff9800'
        },
        '3': {
            icon: '🔄',
            title: 'Эта страница находится в процессе обновления.',
            text: 'Пожалуйста, проверьте её позже для получения актуальных данных.',
            color: '#3d89fc'
        },
        '4': {
            icon: '⛔',
            title: 'Часть информации временно недоступна.',
            text: 'Мы работаем над восстановлением данных.',
            color: '#fc473d'
        },
        '5': {
            icon: '🚫',
            title: 'Некоторая информация временно отключена.',
            text: 'Приносим извинения за неудобства.',
            color: '#ff813d'
        },
        '6': {
            icon: '🧪',
            title: 'Экспериментальный раздел.',
            text: 'Контент находится в стадии тестирования.',
            color: '#bc57ff'
        },
        '7': {
            icon: '📦',
            title: 'Архивный материал.',
            text: 'Информация сохранена для справки, но может быть неактуальной.',
            color: '#965a00'
        },
        '8': {
            icon: '📝',
            title: 'В разработке.',
            text: 'Материал находится в стадии подготовки. Финальная версия будет опубликована позже.',
            color: '#ffcd38'
        },
        '9': {
            icon: '🧰',
            title: 'Временный редизайн',
            text: 'Дизайн и структура страницы находятся в процессе тестирования.',
            color: '#00bcd4'
        }
    };

    // Стили для баннера
    const bannerStyles = `
    <style>
        .system-banner {
            z-index: 9999;
            position: relative;
        }

        .banner {
            display: flex;
            align-items: center;
            max-width: 800px;
            margin: 20px auto;
            border-radius: 12px;
            padding: 20px 24px;
            position: relative;
            overflow: hidden;
            background-color: #1e1e1e;
            box-shadow: 0 0 16px rgba(255, 255, 255, 0.05);
            animation: fadeInUp 0.8s ease-out forwards;
            opacity: 0;
            transform: translateY(20px);
        }

        .banner::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 10px;
            border-top-left-radius: 12px;
            border-bottom-left-radius: 12px;
            background-image: repeating-linear-gradient(
                45deg,
                var(--accent-color),
                var(--accent-color) 6px,
                #000 6px,
                #000 12px
            );
        }

        .banner-text {
            flex: 1;
            padding-left: 20px;
            font-size: 16px;
            line-height: 1.6;
            color: var(--accent-color);
        }

        .banner-text strong {
            display: block;
            color: #fff;
            font-size: 17px;
            margin-bottom: 5px;
        }

        .banner-close {
            background: none;
            border: none;
            color: #fff;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            margin-left: 15px;
            opacity: 0.7;
            transition: opacity 0.3s;
        }

        .banner-close:hover {
            opacity: 1;
        }

        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
    `;

    // Функция для генерации HTML кода баннера
    const generateBannerHTML = (bannerNumber) => {
        const banner = banners[bannerNumber];
        if (!banner) return '';
        
        return `
        <div id="system-banner" class="system-banner">
            <div class="banner" style="--accent-color: ${banner.color};">
                <div class="banner-text">
                    ${banner.icon} <strong>${banner.title}</strong> ${banner.text}
                </div>
                <button class="banner-close" onclick="document.getElementById('system-banner').style.display='none'">×</button>
            </div>
        </div>
        `;
    };

    // Функция для добавления баннера на страницу
    const addBanner = () => {
        const bannerNumber = shouldShowBanner();
        
        if (!bannerNumber || !banners[bannerNumber]) return;
        
        // Добавляем стили в head
        document.head.insertAdjacentHTML('beforeend', bannerStyles);
        
        // Добавляем баннер в начало body
        const bannerHTML = generateBannerHTML(bannerNumber);
        document.body.insertAdjacentHTML('afterbegin', bannerHTML);
    };

    // Инициализация системы
    const init = () => {
        // Ждем полной загрузки DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addBanner);
        } else {
            addBanner();
        }
    };

    // Запускаем систему
    init();
})();
