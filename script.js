// Глобальные переменные
let audioContext;
let oscillator;
let gainNode;
let isPlaying = false;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initMusic();
    initCandles();
    initHearts();
    addScrollAnimations();
});

// ==================== МУЗЫКА ====================

function initMusic() {
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = document.getElementById('music-icon');

    musicToggle.addEventListener('click', function() {
        if (!audioContext) {
            createAudioContext();
        }

        if (isPlaying) {
            stopMusic();
            musicIcon.textContent = '🔇';
        } else {
            playMusic();
            musicIcon.textContent = '🔊';
        }
        isPlaying = !isPlaying;
    });
}

function createAudioContext() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioContext.createGain();
    gainNode.gain.value = 0.1; // Низкая громкость
    gainNode.connect(audioContext.destination);
}

function playMusic() {
    if (!audioContext) return;

    // Создаем простую мелодию "С днем рождения"
    const melody = [
        { note: 264, duration: 0.5 }, // До
        { note: 264, duration: 0.5 }, // До
        { note: 297, duration: 1 },   // Ре
        { note: 264, duration: 1 },   // До
        { note: 352, duration: 1 },   // Фа
        { note: 330, duration: 2 },   // Ми

        { note: 264, duration: 0.5 }, // До
        { note: 264, duration: 0.5 }, // До
        { note: 297, duration: 1 },   // Ре
        { note: 264, duration: 1 },   // До
        { note: 396, duration: 1 },   // Соль
        { note: 352, duration: 2 },   // Фа
    ];

    let time = audioContext.currentTime;

    function playMelody() {
        if (!isPlaying) return;

        melody.forEach(note => {
            const osc = audioContext.createOscillator();
            const noteGain = audioContext.createGain();

            osc.type = 'sine';
            osc.frequency.value = note.note;

            noteGain.gain.value = 0;
            noteGain.gain.linearRampToValueAtTime(0.1, time + 0.1);
            noteGain.gain.linearRampToValueAtTime(0, time + note.duration);

            osc.connect(noteGain);
            noteGain.connect(gainNode);

            osc.start(time);
            osc.stop(time + note.duration);

            time += note.duration;
        });

        // Повторяем мелодию с паузой
        setTimeout(() => {
            if (isPlaying) {
                time = audioContext.currentTime + 1; // Пауза 1 секунда
                playMelody();
            }
        }, (time - audioContext.currentTime + 1) * 1000);
    }

    playMelody();
}

function stopMusic() {
    if (audioContext) {
        // Останавливаем музыку
        isPlaying = false;
    }
}

// ==================== СВЕЧИ НА ТОРТЕ ====================

function initCandles() {
    const blowButton = document.getElementById('blow-candles');
    const flames = document.querySelectorAll('.flame');
    let candlesBlown = false;

    blowButton.addEventListener('click', function() {
        if (!candlesBlown) {
            // Задуваем свечи
            flames.forEach((flame, index) => {
                setTimeout(() => {
                    flame.classList.add('blown');
                    // Звук задувания
                    playBlowSound();
                }, index * 200);
            });

            blowButton.textContent = '🎉 Желание загадано, но для тебя эта функция не имеет ограничений, можно еще! И не одно)';
            blowButton.style.background = 'linear-gradient(135deg, #52c234 0%, #61efb6 100%)';
            candlesBlown = true;

            // Запускаем конфетти
            createConfetti();

        } else {
            // Зажигаем свечи обратно
            flames.forEach((flame, index) => {
                setTimeout(() => {
                    flame.classList.remove('blown');
                }, index * 200);
            });

            blowButton.textContent = 'Задуть свечи 💨';
            blowButton.style.background = 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)';
            candlesBlown = false;
        }
    });
}

function playBlowSound() {
    if (!audioContext) {
        createAudioContext();
    }

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.value = 100;

    gain.gain.value = 0.05;
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + 0.3);
}

function createConfetti() {
    const colors = ['#ff6b9d', '#c44569', '#ffa502', '#fffa65', '#26de81', '#4bcffa', '#a29bfe'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

            document.body.appendChild(confetti);

            const animation = confetti.animate([
                {
                    transform: `translateY(0) rotate(0deg)`,
                    opacity: 1
                },
                {
                    transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg)`,
                    opacity: 0
                }
            ], {
                duration: 2000 + Math.random() * 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });

            animation.onfinish = () => confetti.remove();
        }, i * 30);
    }
}

// ==================== ЛЕТАЮЩИЕ СЕРДЕЧКИ ====================

function initHearts() {
    const heartsButton = document.getElementById('create-hearts');

    heartsButton.addEventListener('click', function() {
        createHearts(20);
        playHeartSound();
    });

    // Также можно создавать сердечки при клике по экрану
    document.addEventListener('click', function(e) {
        // Проверяем, что клик не по кнопке
        if (!e.target.closest('.interactive-btn') && !e.target.closest('.music-btn')) {
            createHeart(e.clientX, e.clientY);
        }
    });
}

function createHearts(count) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = window.innerHeight;
            createHeart(x, y);
        }, i * 100);
    }
}

function createHeart(x, y) {
    const heartsContainer = document.getElementById('hearts-container');
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = ['💜', '💕', '💖', '💗', '💓'][Math.floor(Math.random() * 5)];

    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.fontSize = (20 + Math.random() * 20) + 'px';

    // Добавляем случайное горизонтальное смещение
    const randomX = (Math.random() - 0.5) * 100;
    heart.style.setProperty('--random-x', randomX + 'px');

    heartsContainer.appendChild(heart);

    // Анимация
    const animation = heart.animate([
        {
            transform: 'translateY(0) translateX(0) scale(1) rotate(0deg)',
            opacity: 1
        },
        {
            transform: `translateY(-100vh) translateX(${randomX}px) scale(1.5) rotate(360deg)`,
            opacity: 0
        }
    ], {
        duration: 3000,
        easing: 'ease-out'
    });

    animation.onfinish = () => heart.remove();
}

function playHeartSound() {
    if (!audioContext) {
        createAudioContext();
    }

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.value = 800;
    osc.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);

    gain.gain.value = 0.1;
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + 0.2);
}

// ==================== АНИМАЦИЯ ПРИ ПРОКРУТКЕ ====================

function addScrollAnimations() {
    const sections = document.querySelectorAll('.photo-section, .text-section, .cake-section, .hearts-section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 1s ease-out';
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });
}

// ==================== АВТОЗАПУСК МУЗЫКИ (опционально) ====================

// Раскомментируйте, если хотите автоматический запуск музыки при первом взаимодействии
/*
document.addEventListener('click', function autoStart() {
    if (!audioContext) {
        createAudioContext();
        playMusic();
        isPlaying = true;
        document.getElementById('music-icon').textContent = '🔊';
    }
    document.removeEventListener('click', autoStart);
}, { once: true });
*/
