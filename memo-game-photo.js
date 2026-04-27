/**
 * MEMO GAME - 16 пар, flip-анимация, таймер по первому клику
 */
(function() {
    'use strict';

    const CONFIG = {
        totalPairs: 16,                // 16 пар = 32 карточки
        totalPhotos: 60,               // всего фото в папке
        animationDuration: 300,
        photoBasePath: 'photo/'
    };

    const STATE = {
        cards: [],
        flipped: [],
        matched: [],
        gameActive: false,
        timerStarted: false,   // флаг, был ли первый клик
        timerInterval: null,
        startTime: null,
        history: JSON.parse(localStorage.getItem('memoPhotoHistory') || '[]'),
        totalGames: parseInt(localStorage.getItem('memoTotalGames') || '0')  // общее число побед
    };

    let DOM = {};

    const Utils = {
        shuffle: (array) => {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        },
        formatTime: (seconds) => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs.toString().padStart(2, '0')}`;
        },
        createParticle: (x, y) => {     if (!DOM.heartParticles) return;
        const particle = document.createElement('div');
        particle.className = 'memo-particle';
        const angle = Math.random() * Math.PI * 2;
        const velocity = 3 + Math.random() * 4;
        const tx = Math.cos(angle) * velocity * 60;
        const ty = Math.sin(angle) * velocity * 60;
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        particle.classList.add('burst');
        DOM.heartParticles.appendChild(particle);
        setTimeout(() => particle.remove(), 1000); }
    };

    const Game = {
        init: () => {
            Game.createHTML();
            Game.refreshDomReferences();
            Game.createCardsWithAnimation();
            Game.updateHistory();
            Game.attachEvents();
        },

        refreshDomReferences: () => {
            DOM = {
                grid: document.getElementById('memo-cardsGrid'),
                resetBtn: document.getElementById('memo-resetBtn'),
                timer: document.getElementById('memo-timer'),
                matches: document.getElementById('memo-matches'),
                historyList: document.getElementById('memo-historyList'),
                gameModal: document.getElementById('memo-gameModal'),
                gameOverModal: document.getElementById('memo-gameOverModal'),
                finalTime: document.getElementById('memo-finalTime'),
                openGameBtn: document.getElementById('openGameBtn'),
                closeGameBtn: document.getElementById('memo-closeGameBtn'),
                startAnimation: document.getElementById('memo-startAnimation'),
                heartParticles: document.getElementById('memo-heartParticles')
            };
        },

        attachEvents: () => {
            if (DOM.resetBtn) DOM.resetBtn.addEventListener('click', () => Game.resetWithAnimation());
            const openBtn = DOM.openGameBtn || document.getElementById('startGameBtn');
            if (openBtn) openBtn.addEventListener('click', Game.openModal);
            if (DOM.closeGameBtn) DOM.closeGameBtn.addEventListener('click', Game.closeModal);
            if (DOM.gameModal) {
                DOM.gameModal.addEventListener('click', (e) => {
                    if (e.target === DOM.gameModal) Game.closeModal();
                });
            }
        },

        createHTML: () => {
            if (document.getElementById('memo-gameModal')) return;
            const html = `
                <div class="memo-game-modal" id="memo-gameModal">
                    <button class="memo-close-game" id="memo-closeGameBtn">×</button>
                    <div class="memo-game-modal-content">
                        <div class="memo-game-container">
                            <div class="memo-game-section">
                                <div class="memo-game-header">
                                    <h1 class="memo-game-title">🎴 MEMO</h1>
                                    <p class="memo-game-subtitle">найди все пары(абсолютный рекордсмен-->doni)</p>
                                </div>
                                <div class="memo-stats-container">
                                    <div class="memo-stat">
                                        <div class="memo-stat-value" id="memo-timer">0:00</div>
                                        <div class="memo-stat-label">время</div>
                                    </div>
                                    <div class="memo-stat">
                                        <div class="memo-stat-value" id="memo-matches">0/16</div>
                                        <div class="memo-stat-label">пары</div>
                                    </div>
                                </div>
                                <div class="memo-button-group">
                                    <button class="memo-btn memo-btn-secondary" id="memo-resetBtn">🔄 начать заново</button>
                                </div>
                                <div class="memo-cards-grid" id="memo-cardsGrid"></div>
                            </div>
                            <div class="memo-history-panel">
                                <div class="memo-history-title">📋 история игр</div>
                                <div id="memo-historyList"><div class="memo-history-empty">Пока результатов нет</div></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="memo-start-animation" id="memo-startAnimation"></div>
                <div class="memo-heart-particles" id="memo-heartParticles"></div>
                <div class="memo-game-over-modal" id="memo-gameOverModal">
                    <div class="memo-game-over-content">
                        <div class="memo-game-over-emoji">🏆</div>
                        <div class="memo-game-over-text">Поздравляю!</div>
                        <div class="memo-game-over-time">Твоё время: <span id="memo-finalTime">0:00</span></div>
                        <button class="memo-game-over-button" onclick="document.getElementById('memo-gameOverModal').classList.remove('memo-show'); document.getElementById('memo-resetBtn').click();">🎮 сыграть снова</button>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', html);
        },
        // ========== НОВАЯ ФУНКЦИЯ: выбирает 'count' случайных уникальных чисел от 1 до 'max' ==========
        getRandomPhotoIndices(count, max) {
            let indices = Array.from({ length: max }, (_, i) => i + 1); // [1,2,...,max]
            // Перемешиваем массив
            for (let i = indices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [indices[i], indices[j]] = [indices[j], indices[i]];
            }
            // Берём первые 'count' элементов
            return indices.slice(0, count);
        },

        // Создание карточек с 3D-структурой для flip-анимации
        createCardsWithAnimation: () => {
            // Выбираем 16 случайных уникальных номеров фото
            const selectedIndices = Game.getRandomPhotoIndices(CONFIG.totalPairs, CONFIG.totalPhotos);
            const pairs = [];
            for (let i = 0; i < CONFIG.totalPairs; i++) {
                const idx = selectedIndices[i];
                const imgUrl = `${CONFIG.photoBasePath}${idx}.png`;
                pairs.push(imgUrl, imgUrl);   // каждая пара = два одинаковых фото
            }
            STATE.cards = Utils.shuffle(pairs);
            if (!DOM.grid) return;
            DOM.grid.innerHTML = '';
            STATE.cards.forEach((src, index) => {
                const card = document.createElement('div');
                card.className = 'memo-card';
                card.dataset.index = index;
                card.dataset.img = src;
                const inner = document.createElement('div');
                inner.className = 'memo-card-inner';
                const front = document.createElement('div');
                front.className = 'memo-card-front';
                const img = document.createElement('img');
                img.src = src;
                img.alt = 'photo';
                front.appendChild(img);
                const back = document.createElement('div');
                back.className = 'memo-card-back';
                back.innerHTML = '<span>✨</span>';
                inner.appendChild(front);
                inner.appendChild(back);
                card.appendChild(inner);
                card.addEventListener('click', () => Game.flipCard(card));
                DOM.grid.appendChild(card);
            });
            const cards = document.querySelectorAll('.memo-card');
            cards.forEach((card, idx) => {
                setTimeout(() => {
                    card.classList.add('memo-card-visible');
                }, idx * 35);
            });
        },

        flipCard: (card) => {
            // Запускаем таймер при первом клике на любую карточку
            if (!STATE.timerStarted && !STATE.gameActive) {
                STATE.timerStarted = true;
                STATE.gameActive = true;
                STATE.startTime = Date.now();
                Game.startTimer();
            }

            if (!STATE.gameActive) return;
            if (card.classList.contains('memo-flipped') || card.classList.contains('memo-matched')) return;
            if (STATE.flipped.length >= 2) return;

            // Добавляем класс для поворота
            card.classList.add('memo-flipped');
            STATE.flipped.push(card);

            if (STATE.flipped.length === 2) {
                STATE.gameActive = false;
                Game.checkMatch();
            }
        },

        checkMatch: () => {
            const [card1, card2] = STATE.flipped;
            const match = (card1.dataset.img === card2.dataset.img);
            setTimeout(() => {
                if (match) {
                    card1.classList.add('memo-matched');
                    card2.classList.add('memo-matched');
                    STATE.matched.push(card1, card2);
                    Game.updateMatches();
                    if (STATE.matched.length === CONFIG.totalPairs * 2) {
                        Game.endGame();
                    } else {
                        STATE.flipped = [];
                        STATE.gameActive = true;
                    }
                } else {
                    card1.classList.add('memo-shake');
                    card2.classList.add('memo-shake');
                    setTimeout(() => {
                        card1.classList.remove('memo-flipped', 'memo-shake');
                        card2.classList.remove('memo-flipped', 'memo-shake');
                        STATE.flipped = [];
                        STATE.gameActive = true;
                    }, CONFIG.animationDuration);
                }
            }, 600);
        },

        startTimer: () => {
            if (STATE.timerInterval) clearInterval(STATE.timerInterval);
            STATE.timerInterval = setInterval(() => {
                if (STATE.startTime) {
                    const elapsed = Math.floor((Date.now() - STATE.startTime) / 1000);
                    if (DOM.timer) DOM.timer.textContent = Utils.formatTime(elapsed);
                }
            }, 100);
        },

        updateMatches: () => {
            if (DOM.matches) DOM.matches.textContent = `${STATE.matched.length / 2}/${CONFIG.totalPairs}`;
        },

        endGame: () => {
            clearInterval(STATE.timerInterval);
            STATE.gameActive = false;
            const finalSeconds = Math.floor((Date.now() - STATE.startTime) / 1000);
            const finalTimeStr = Utils.formatTime(finalSeconds);
            if (DOM.finalTime) DOM.finalTime.textContent = finalTimeStr;
            
            // увеличиваем общий счётчик побед
            STATE.totalGames++;
            localStorage.setItem('memoTotalGames', STATE.totalGames);
            
            const result = { 
                id: STATE.totalGames,          // сквозной номер
                time: finalTimeStr, 
                date: new Date().toLocaleDateString('ru-RU'), 
                timestamp: Date.now() 
            };
            STATE.history.unshift(result);
            if (STATE.history.length > 5) STATE.history.pop();
            localStorage.setItem('memoPhotoHistory', JSON.stringify(STATE.history));
            
            Game.updateHistory();
            setTimeout(() => {
                if (DOM.gameOverModal) DOM.gameOverModal.classList.add('memo-show');
            }, 300);
        },

        updateHistory: () => {
            if (!DOM.historyList) return;
            if (STATE.history.length === 0) {
                DOM.historyList.innerHTML = '<div class="memo-history-empty">✨ Пока результатов нет ✨</div>';
                return;
            }
            DOM.historyList.innerHTML = STATE.history.map((item) => `
                <div class="memo-history-item">
                    <div class="memo-history-time">#${item.id} — ${item.time}</div>
                    <div class="memo-history-date">${item.date}</div>
                </div>
            `).join('');
        },

        resetWithAnimation: () => {
            clearInterval(STATE.timerInterval);
            STATE.gameActive = false;
            STATE.timerStarted = false;
            STATE.flipped = [];
            STATE.matched = [];
            STATE.startTime = null;
            if (DOM.timer) DOM.timer.textContent = '0:00';
            Game.createCardsWithAnimation();
            Game.updateMatches();
            if (DOM.gameOverModal) DOM.gameOverModal.classList.remove('memo-show');
        },

        openModal: () => {
            const modal = document.querySelector('.memo-game-modal');
            if (modal) {
                modal.classList.add('memo-active');
                Game.resetWithAnimation();
            }
        },

        closeModal: () => {
            const modal = document.querySelector('.memo-game-modal');
            if (modal) modal.classList.remove('memo-active');
            clearInterval(STATE.timerInterval);
            Game.resetWithAnimation();
            const overModal = document.getElementById('memo-gameOverModal');
            if (overModal) overModal.classList.remove('memo-show');
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', Game.init);
    } else {
        Game.init();
    }

    window.MemoGame = Game;

})();