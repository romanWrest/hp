// Глобальные переменные
let audioContext;
let oscillator;
let gainNode;
let isPlaying = false;
let backgroundMusic = null; // Объект аудио для фоновой музыки

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initMusic();
    initCandles();
    initHearts();
    addScrollAnimations();

    // Новые функции
    initParticles();
    initDaysCounter();
    initScratchCard();
    initHeartCollage();
    initLightbox();
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
    // Создаем аудио объект только один раз
    if (!backgroundMusic) {
        backgroundMusic = new Audio('birthday.mp3');
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.3;
    }

    // Воспроизводим музыку
    backgroundMusic.play().catch(error => {
        console.log('Ошибка воспроизведения:', error);
    });
}

function stopMusic() {
    // Останавливаем и перематываем музыку
    if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
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

// ==================== НОВЫЕ ФУНКЦИИ ====================

// ==================== ФОНОВЫЕ ЧАСТИЦЫ ====================

function initParticles() {
    const particlesContainer = document.getElementById('particles-container');
    const particleCount = 30; // Количество частиц

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Случайная начальная позиция
        particle.style.left = Math.random() * 100 + '%';
        particle.style.bottom = '-10px';

        // Случайный размер
        const size = 3 + Math.random() * 5;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        // Случайное горизонтальное смещение
        const drift = (Math.random() - 0.5) * 100;
        particle.style.setProperty('--drift', drift + 'px');

        // Случайная длительность анимации
        const duration = 10 + Math.random() * 15;
        particle.style.animation = `particleFloat ${duration}s linear infinite`;

        // Случайная задержка
        particle.style.animationDelay = Math.random() * 10 + 's';

        particlesContainer.appendChild(particle);
    }

    // Создаем частицы
    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }
}

// ==================== СЧЕТЧИК ДНЕЙ ВМЕСТЕ ====================

function initDaysCounter() {
    const startDate = new Date('2025-09-02'); // 2 сентября 2025
    const counterElement = document.getElementById('days-counter');

    function updateCounter() {
        const now = new Date();
        const diffTime = Math.abs(now - startDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // Анимированное обновление счетчика
        animateCounter(counterElement, 0, diffDays, 2000);
    }

    function animateCounter(element, start, end, duration) {
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing функция для плавности
            const easeOutQuad = progress => progress * (2 - progress);
            const current = Math.floor(start + (end - start) * easeOutQuad(progress));

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    updateCounter();
}

// ==================== SCRATCH CARD ====================

function initScratchCard() {
    const canvas = document.getElementById('scratch-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resetButton = document.getElementById('reset-scratch');

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Устанавливаем размер canvas
    function resizeCanvas() {
        const wrapper = canvas.parentElement;
        canvas.width = wrapper.offsetWidth;
        canvas.height = wrapper.offsetHeight;
        drawScratchSurface();
    }

    // Рисуем поверхность для стирания
    function drawScratchSurface() {
        ctx.fillStyle = '#9D84B7';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Добавляем текст "Сотри меня!"
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Сотри меня! 👆', canvas.width / 2, canvas.height / 2);

        // Добавляем узор
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 0; i < 20; i++) {
            ctx.fillRect(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                10,
                10
            );
        }
    }

    // Функция стирания
    function scratch(x, y) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, 2 * Math.PI);
        ctx.fill();
    }

    // Обработчики событий для мыши
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
        scratch(lastX, lastY);
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Рисуем линию между точками для плавности
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 60;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();

        lastX = x;
        lastY = y;
    });

    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
    });

    canvas.addEventListener('mouseleave', () => {
        isDrawing = false;
    });

    // Обработчики событий для тач-устройств
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        lastX = touch.clientX - rect.left;
        lastY = touch.clientY - rect.top;
        scratch(lastX, lastY);
    });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineWidth = 60;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();

        lastX = x;
        lastY = y;
    });

    canvas.addEventListener('touchend', () => {
        isDrawing = false;
    });

    // Кнопка сброса
    resetButton.addEventListener('click', () => {
        resizeCanvas();
    });

    // Инициализация
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

// ==================== КОЛЛАЖ В ФОРМЕ СЕРДЦА ====================

function initHeartCollage() {
    const collageContainer = document.getElementById('heart-collage');
    if (!collageContainer) return;

    // Координаты и фото для каждой точки вручную
    // По краю сердца - 11.jpg, внутри - остальные фото
    const heartPhotos = [
        // ========== КРАЙ СЕРДЦА (контур) ==========
        // Верхняя левая дуга
        { x: 30, y: 25, photo: 'collage/11.jpg' },
        { x: 20, y: 20, photo: 'collage/11.jpg' },
        { x: 15, y: 30, photo: 'collage/11.jpg' },
        { x: 15, y: 40, photo: 'collage/11.jpg' },

        // Левая сторона
        { x: 20, y: 50, photo: 'collage/11.jpg' },
        { x: 25, y: 60, photo: 'collage/11.jpg' },
        { x: 35, y: 70, photo: 'collage/11.jpg' },
        { x: 45, y: 80, photo: 'collage/11.jpg' },

        // Нижняя точка
        { x: 50, y: 85, photo: 'collage/111.jpg' },

        // Правая сторона
        { x: 55, y: 80, photo: 'collage/11.jpg' },
        { x: 65, y: 70, photo: 'collage/11.jpg' },
        { x: 75, y: 60, photo: 'collage/11.jpg' },
        { x: 80, y: 50, photo: 'collage/11.jpg' },

        // Верхняя правая дуга
        { x: 85, y: 40, photo: 'collage/11.jpg' },
        { x: 85, y: 30, photo: 'collage/11.jpg' },
        { x: 80, y: 20, photo: 'collage/11.jpg' },
        { x: 70, y: 25, photo: 'collage/11.jpg' },

        // ========== ВНУТРИ СЕРДЦА ==========
        // Центральные точки - здесь можешь менять фото
        { x: 50, y: 30, photo: 'collage/1.JPG' },
        { x: 40, y: 40, photo: 'collage/2.jpg' },
        { x: 60, y: 40, photo: 'collage/3.jpg' },
        { x: 35, y: 50, photo: 'collage/4.jpg' },
        { x: 50, y: 50, photo: 'collage/5.JPG' },
        { x: 65, y: 50, photo: 'collage/112.jpg' },
        { x: 40, y: 60, photo: 'collage/7.JPG' },
        { x: 50, y: 65, photo: 'collage/8.JPG' },
        { x: 60, y: 60, photo: 'collage/9.JPG' }
    ];

    // Создаем мини-фото для каждой точки
    heartPhotos.forEach((item, index) => {
        const photoDiv = document.createElement('div');
        photoDiv.className = 'collage-photo';
        photoDiv.style.left = item.x + '%';
        photoDiv.style.top = item.y + '%';

        // Добавляем изображение
        photoDiv.innerHTML = `<img src="${item.photo}" alt="Фото ${index + 1}" style="width:100%; height:100%; object-fit:cover;">`;

        // Анимация появления
        photoDiv.style.opacity = '0';
        photoDiv.style.transform = 'scale(0)';
        setTimeout(() => {
            photoDiv.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            photoDiv.style.opacity = '1';
            photoDiv.style.transform = 'scale(1)';
        }, index * 50);

        collageContainer.appendChild(photoDiv);
    });
}

// ==================== ФОТОГАЛЕРЕЯ С УВЕЛИЧЕНИЕМ ====================

function initLightbox() {
    // Создаем элемент lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-close">×</div>
        <div class="lightbox-content">
            <img src="" alt="Увеличенное фото">
        </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    // Добавляем обработчики на все фото
    const photoFrames = document.querySelectorAll('.photo-frame');

    photoFrames.forEach(frame => {
        frame.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img && img.src) {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden'; // Отключаем прокрутку
            }
        });
    });

    // Закрытие по клику на кнопку
    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Включаем прокрутку
    });

    // Закрытие по клику на фон
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Закрытие по нажатию Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}
