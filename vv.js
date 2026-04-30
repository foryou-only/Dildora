// ==================== УПРАВЛЕНИЕ ЭКРАНАМИ (работает только внутри контейнера) ====================

function showValentineScreen(screenId) {
    const container = document.getElementById('valentineContainer');
    if (!container) return;

    // Принудительно скрываем все экраны внутри контейнера
    const screens = container.querySelectorAll('.screen');
    screens.forEach(s => {
        s.classList.add('hidden');
        s.style.display = 'none';
    });

    // Находим и показываем нужный экран
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.remove('hidden');
        target.style.display = '';   // вернуть дефолтный display (flex)
    }

    // Делаем контейнер видимым только сейчас
    container.classList.add('active');
}

function hideValentineContainer() {
    const container = document.querySelector('.valentine-container');
    if (container) container.classList.remove('active');
    document.getElementById('mainPage').classList.add('active');
}

// ==================== МОДАЛЬНОЕ ОКНО ====================

function showModal() {
    document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

// ==================== КНОПКА «ДА» ====================

function startValentineRotation() {
    closeModal();
    document.getElementById('mainPage').classList.remove('active');
    showValentineScreen('valentineScreen');

    // Предзагрузка видео (не видна, так как экраны скрыты)
    const video = document.getElementById('myVideo');
    if (video) {
        video.load();
    }
}

// ==================== КНОПКА «НАЧАТЬ» – АНИМАЦИИ И ВИДЕО ====================

function valentineShowVideo() {
    const container = document.getElementById('valentineContainer');

    // Полноэкранный режим
    const video = document.getElementById('myVideo');
    if (video) {
        if (video.requestFullscreen) {
            video.requestFullscreen().catch(() => {});
        } else if (video.webkitEnterFullscreen) {   // iOS Safari
            video.webkitEnterFullscreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        }
    }

    showValentineScreen('rotationScreen');
    const phoneDevice = document.querySelector('.phone-device');
    if (phoneDevice) {
        phoneDevice.style.animation = 'none';
        phoneDevice.offsetHeight;
        phoneDevice.style.animation = 'rotatePhoneDevice 1.8s ease-in-out forwards';
    }

    setTimeout(() => {
        showValentineScreen('headphonesScreen');
        setTimeout(() => {
            // Восстанавливаем отображение видеоэкрана
            const vs = document.getElementById('videoScreen');
            if (vs) vs.style.display = '';
            showValentineScreen('videoScreen');

            const video = document.getElementById('myVideo');
            if (!video) return;

            video.muted = false;
            video.currentTime = 0;

            // Функция запуска видео, когда оно точно готово
            function tryPlay() {
                video.play().catch(err => console.log('Ошибка видео:', err));
            }

            // Если видео уже буферизовано достаточно – запускаем с короткой паузой
            if (video.readyState >= 3) {
                setTimeout(tryPlay, 100);
            } else {
                video.addEventListener('canplaythrough', function onCanPlay() {
                    video.removeEventListener('canplaythrough', onCanPlay);
                    setTimeout(tryPlay, 100);
                });
                // Запасной таймаут на случай, если событие не сработает
                setTimeout(() => {
                    if (video.paused) tryPlay();
                }, 3000);
            }

            // Конец видео
            video.addEventListener('ended', onVideoEnded, { once: true });

        }, 2500);
    }, 3000);
}

// ==================== КОНЕЦ ВИДЕО – ПАУЗА И ВОЗМОЖНОСТЬ ПОВТОРА ====================

function onVideoEnded() {
    const videoScreen = document.getElementById('videoScreen');
    if (!videoScreen) return;

    // Удаляем старую кнопку, если есть
    const oldBtn = document.getElementById('replayVideoBtn');
    if (oldBtn) oldBtn.remove();

    const replayBtn = document.createElement('button');
    replayBtn.id = 'replayVideoBtn';
    replayBtn.textContent = '🔄 Смотреть заново';
    Object.assign(replayBtn.style, {
        position: 'absolute',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '14px 32px',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        border: '2px solid white',
        borderRadius: '30px',
        fontSize: '1.1rem',
        cursor: 'pointer',
        zIndex: '20',
        backdropFilter: 'blur(8px)'
    });

replayBtn.addEventListener('click', () => {
    const video = document.getElementById('myVideo');
    if (!video) return;

    replayBtn.remove();                // убираем кнопку

    video.currentTime = 0;             // перемотка в начало
    video.play().catch(err => console.log('Ошибка повтора:', err));

    video.addEventListener('ended', onVideoEnded, { once: true });
});

    videoScreen.appendChild(replayBtn);
}

// ==================== ВОЗВРАТ НА ГЛАВНУЮ ====================

function valentineGoBack() {
    hideValentineContainer();
}

function valentineCloseVideo() {
    const video = document.getElementById('myVideo');
    if (video) {
        video.pause();
        video.removeEventListener('ended', onVideoEnded);
    }
    if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
    }
    const replayBtn = document.getElementById('replayVideoBtn');
    if (replayBtn) replayBtn.remove();
    hideValentineContainer();
}