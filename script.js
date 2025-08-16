// Глобальные переменные
let currentScreen = 0;
let bgMusicPlaying = true; // По умолчанию музыка включена
let gameConnections = [];
let selectedCharacter = null;
let startDate = new Date('2024-01-01'); // Дата начала отношений

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeSite();
    updateLoveCounter();
    setInterval(updateLoveCounter, 60000); // Обновляем каждую минуту
    
    // Настройка аудио
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        bgMusic.addEventListener('canplay', function() {
            // Музыка готова к воспроизведению
            console.log('Аудио готово к воспроизведению');
        });
        
        bgMusic.addEventListener('error', function(e) {
            console.error('Ошибка загрузки аудио:', e);
            bgMusicPlaying = false;
            const btn = document.getElementById('bgMusicToggle');
            if (btn) btn.textContent = '🔇';
        });
    }
    
    // Добавляем поддержку клавиатурной навигации
    document.addEventListener('keydown', function(event) {
        switch(event.key) {
            case 'ArrowRight':
            case ' ':
                event.preventDefault();
                goToScreen(currentScreen + 1);
                break;
            case 'ArrowLeft':
                event.preventDefault();
                goToScreen(currentScreen - 1);
                break;
            case '1':
                event.preventDefault();
                goToScreen(0);
                break;
            case '2':
                event.preventDefault();
                goToScreen(1);
                break;
            case '3':
                event.preventDefault();
                goToScreen(2);
                break;
            case '4':
                event.preventDefault();
                goToScreen(3);
                break;
            case '5':
                event.preventDefault();
                goToScreen(4);
                break;
            case 'Escape':
                event.preventDefault();
                goToScreen(0);
                break;
        }
    });
});

// Инициализация сайта
function initializeSite() {
    // Аудио контролы
    document.getElementById('bgMusicToggle').addEventListener('click', toggleBgMusic);
    
    // Персонажи
    document.querySelectorAll('.character').forEach(char => {
        char.addEventListener('click', playCharacterAudio);
        char.addEventListener('mouseenter', showLoveEffect);
    });
    
    // Игра
    initializeGame();
    
    // Галерея
    document.getElementById('shuffleBtn').addEventListener('click', shuffleGallery);
    
    // Форма любви
    document.getElementById('loveForm').addEventListener('submit', handleLoveForm);
    
    // Секретные клики
    document.addEventListener('click', handleSecretClick);
    
    // Настройка приветственной модалки
    const startButton = document.getElementById('startButton');
    if (startButton) {
        startButton.addEventListener('click', startSite);
    }
    
    // Настройка видео в модалке
    const modalVideo = document.querySelector('.modal-video');
    if (modalVideo) {
        modalVideo.addEventListener('error', function(e) {
            console.log('Ошибка загрузки видео:', e);
            console.log('Проверьте путь к файлу videos/sweet-kiss.mov');
        });
        
        modalVideo.addEventListener('loadeddata', function() {
            console.log('Видео sweet-kiss.mov успешно загружено');
        });
        
        modalVideo.addEventListener('canplay', function() {
            console.log('Видео готово к воспроизведению');
        });
    }
}

// Функция запуска сайта
function startSite() {
    // Запускаем музыку
    const bgMusic = document.getElementById('bgMusic');
    const btn = document.getElementById('bgMusicToggle');
    
    if (bgMusic && bgMusic.paused) {
        bgMusic.play().then(() => {
            bgMusicPlaying = true;
            btn.textContent = '🎵';
            console.log('Музыка запущена при старте сайта');
        }).catch(e => {
            console.log('Не удалось запустить музыку:', e);
            bgMusicPlaying = false;
            btn.textContent = '🔇';
        });
    }
    
    // Скрываем модалку
    const modal = document.getElementById('welcomeModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 800);
    }
    
    // Показываем основной контент
    document.getElementById('welcome').classList.add('active');
}

// Навигация между экранами
function nextScreen() {
    goToScreen(currentScreen + 1);
}

function goToScreen(screenIndex) {
    const screens = ['welcome', 'story', 'game', 'gallery', 'finale'];
    
    if (screenIndex >= 0 && screenIndex < screens.length) {
        // Убираем активный класс со всех экранов
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Убираем активный класс со всех навигационных кнопок
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Активируем нужный экран
        const targetScreen = document.getElementById(screens[screenIndex]);
        if (targetScreen) {
            targetScreen.classList.add('active');
            currentScreen = screenIndex;
            
            // Активируем соответствующую навигационную кнопку
            const navBtn = document.querySelectorAll('.nav-btn')[screenIndex];
            if (navBtn) {
                navBtn.classList.add('active');
            }
            
            // Специальные действия для экранов
            if (screenIndex === 2) { // Игра
                resetGame();
                // Принудительно перерисовываем canvas через небольшую задержку
                setTimeout(() => {
                    if (typeof drawConnections === 'function') {
                        drawConnections();
                    }
                }, 200);
            } else if (screenIndex === 3) { // Галерея
                shuffleGallery();
            } else if (screenIndex === 4) { // Финал
                startFireworks();
            }
            
            // Прокручиваем к началу экрана
            targetScreen.scrollTop = 0;
        }
    }
}

// Перезапуск сайта
function restartSite() {
    currentScreen = 0;
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById('welcome').classList.add('active');
    resetGame();
    updateLoveCounter();
}

// Аудио функции
function toggleBgMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const btn = document.getElementById('bgMusicToggle');
    
    if (bgMusicPlaying) {
        bgMusic.pause();
        btn.textContent = '🔇';
        bgMusicPlaying = false;
    } else {
        bgMusic.play().then(() => {
            bgMusicPlaying = true;
            btn.textContent = '🎵';
        }).catch(e => {
            console.log('Ошибка воспроизведения:', e);
            bgMusicPlaying = false;
            btn.textContent = '🔇';
        });
    }
}



function playCharacterAudio(event) {
    // Анимация персонажа
    const character = event.currentTarget;
    character.style.transform = 'scale(1.2)';
    setTimeout(() => {
        character.style.transform = 'scale(1)';
    }, 300);
}



// Эффекты любви
function showLoveEffect(event) {
    const character = event.currentTarget;
    const hearts = ['❤️', '💖', '💕', '💗', '💓', '💝', '💘', '💞'];
    const randomHeart = hearts[Math.floor(Math.random() * hearts.length)];
    
    // Создаем несколько сердечек
    for (let i = 0; i < 3; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = randomHeart;
        
        // Случайные радужные цвета
        const colors = ['#ff0018', '#ff8c00', '#ffed00', '#008026', '#004dff', '#760188', '#ff6b9d', '#4ecdc4'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        heart.style.cssText = `
            position: absolute;
            font-size: 2rem;
            pointer-events: none;
            z-index: 1000;
            animation: float-up 2s ease-out forwards;
            filter: drop-shadow(0 0 10px ${randomColor});
            transform: translateX(${(i - 1) * 20}px);
        `;
        
        const rect = character.getBoundingClientRect();
        heart.style.left = (rect.left + rect.width / 2) + 'px';
        heart.style.top = (rect.top + rect.height / 2) + 'px';
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 2000);
    }
}

// Счетчик любви
function updateLoveCounter() {
    const now = new Date();
    const diff = now - startDate;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
}

// Игра "Соедини нас"
let drawConnections; // Глобальная переменная для функции отрисовки

function initializeGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    // Обработчики для персонажей
    document.querySelectorAll('.game-character').forEach(char => {
        char.addEventListener('click', handleCharacterClick);
    });
    
    // Отрисовка линий
    drawConnections = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        gameConnections.forEach(connection => {
            const char1 = document.getElementById(connection.from);
            const char2 = document.getElementById(connection.to);
            
            if (char1 && char2) {
                const rect1 = char1.getBoundingClientRect();
                const rect2 = char2.getBoundingClientRect();
                const canvasRect = canvas.getBoundingClientRect();
                
                // Вычисляем позиции относительно canvas
                const x1 = rect1.left + rect1.width / 2 - canvasRect.left;
                const y1 = rect1.top + rect1.height / 2 - canvasRect.top;
                const x2 = rect2.left + rect2.width / 2 - canvasRect.left;
                const y2 = rect2.top + rect2.height / 2 - canvasRect.top;
                
                // Рисуем линию с сердечками
                ctx.strokeStyle = '#ff6b9d';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                
                // Рисуем сердечки вдоль линии
                const heartCount = 5;
                for (let i = 1; i <= heartCount; i++) {
                    const t = i / (heartCount + 1);
                    const x = x1 + (x2 - x1) * t;
                    const y = y1 + (y2 - y1) * t;
                    
                    ctx.font = '20px Arial';
                    ctx.fillStyle = '#ff6b9d';
                    ctx.fillText('❤️', x - 10, y + 10);
                }
            }
        });
    }
    
    // Обновляем отрисовку при изменении соединений
    const observer = new MutationObserver(drawConnections);
    document.querySelectorAll('.game-character').forEach(char => {
        observer.observe(char, { attributes: true });
    });
    
    // Добавляем обработчик изменения размера окна
    window.addEventListener('resize', drawConnections);
    
    // Первоначальная отрисовка
    setTimeout(drawConnections, 100);
    
    // Добавляем обработчик для перерисовки при загрузке изображений
    document.querySelectorAll('.game-char-img').forEach(img => {
        img.addEventListener('load', () => {
            setTimeout(drawConnections, 50);
        });
    });
}

function handleCharacterClick(event) {
    const character = event.currentTarget;
    
    if (!selectedCharacter) {
        // Первый клик - выбираем персонажа
        selectedCharacter = character;
        character.style.borderColor = '#ffeb3b';
        character.style.transform = 'scale(1.1)';
    } else if (selectedCharacter !== character) {
        // Второй клик - соединяем персонажей
        const connection = {
            from: selectedCharacter.id,
            to: character.id
        };
        
        // Проверяем, нет ли уже такого соединения
        const exists = gameConnections.some(conn => 
            (conn.from === connection.from && conn.to === connection.to) ||
            (conn.from === connection.to && conn.to === connection.from)
        );
        
        if (!exists) {
            gameConnections.push(connection);
            selectedCharacter.setAttribute('data-connected', 'true');
            character.setAttribute('data-connected', 'true');
            
            // Проверяем победу
            if (gameConnections.length >= 3) {
                setTimeout(showVictory, 500);
            }
        }
        
        // Сбрасываем выбор
        selectedCharacter.style.borderColor = '';
        selectedCharacter.style.transform = '';
        selectedCharacter = null;
        
        // Перерисовываем canvas
        setTimeout(() => {
            const canvas = document.getElementById('gameCanvas');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Отрисовываем новые соединения
            gameConnections.forEach(connection => {
                const char1 = document.getElementById(connection.from);
                const char2 = document.getElementById(connection.to);
                
                if (char1 && char2) {
                    const rect1 = char1.getBoundingClientRect();
                    const rect2 = char2.getBoundingClientRect();
                    const canvasRect = canvas.getBoundingClientRect();
                    
                    // Вычисляем позиции относительно canvas
                    const x1 = rect1.left + rect1.width / 2 - canvasRect.left;
                    const y1 = rect1.top + rect1.height / 2 - canvasRect.top;
                    const x2 = rect2.left + rect2.width / 2 - canvasRect.left;
                    const y2 = rect2.top + rect2.height / 2 - canvasRect.top;
                    
                    ctx.strokeStyle = '#ff6b9d';
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                    
                    // Сердечки
                    const heartCount = 5;
                    for (let i = 1; i <= heartCount; i++) {
                        const t = i / (heartCount + 1);
                        const x = x1 + (x2 - x1) * t;
                        const y = y1 + (y2 - y1) * t;
                        
                        ctx.font = '20px Arial';
                        ctx.fillStyle = '#ff6b9d';
                        ctx.fillText('❤️', x - 10, y + 10);
                    }
                }
            });
        }, 50);
    }
}

function resetGame() {
    gameConnections = [];
    selectedCharacter = null;
    
    document.querySelectorAll('.game-character').forEach(char => {
        char.setAttribute('data-connected', 'false');
        char.style.borderColor = '';
        char.style.transform = '';
    });
    
    // Очищаем canvas
    const canvas = document.getElementById('gameCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    // Перерисовываем canvas через небольшую задержку
    setTimeout(() => {
        if (typeof drawConnections === 'function') {
            drawConnections();
        }
    }, 100);
}

function showVictory() {
    // Создаем фейерверк из сердечек
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createHeartFirework();
        }, i * 100);
    }
    
    // Показываем сообщение о победе
    const victoryMsg = document.createElement('div');
    victoryMsg.innerHTML = '🎉 Все соединены любовью! 🎉';
    victoryMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #4caf50, #45a049);
        color: white;
        padding: 20px 40px;
        border-radius: 20px;
        font-size: 1.5rem;
        font-weight: bold;
        z-index: 10000;
        animation: victory-bounce 1s ease-out;
    `;
    
    document.body.appendChild(victoryMsg);
    
    setTimeout(() => {
        victoryMsg.remove();
    }, 3000);
}

function createHeartFirework() {
    const heart = document.createElement('div');
    const hearts = ['❤️', '💖', '💕', '💗', '💓', '💝', '💘', '💞'];
    heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
    
            // Случайные радужные цвета
        const colors = ['#ff0018', '#ff8c00', '#ffed00', '#008026', '#004dff', '#760188', '#ff6b9d', '#4ecdc4'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    heart.style.cssText = `
        position: fixed;
        font-size: 2rem;
        pointer-events: none;
        z-index: 10000;
        animation: heart-firework 2s ease-out forwards;
        filter: drop-shadow(0 0 10px ${randomColor});
    `;
    
    // Случайная позиция
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.top = Math.random() * window.innerHeight + 'px';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 2000);
}

// Галерея
function shuffleGallery() {
    const gallery = document.getElementById('galleryGrid');
    const items = Array.from(gallery.children);
    
    // Перемешиваем элементы
    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        gallery.appendChild(items[j]);
    }
    
    // Анимация перемешивания
    items.forEach((item, index) => {
        item.style.animation = `shuffle-item 0.5s ease-out ${index * 0.1}s`;
    });
    
    setTimeout(() => {
        items.forEach(item => {
            item.style.animation = '';
        });
    }, 1000);
}

// Форма любви
function handleLoveForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('senderName').value;
    const message = document.getElementById('loveMessage').value;
    
    // Здесь можно добавить отправку на сервер или в Telegram бота
    // Пока просто показываем сообщение об успехе
    
    const successMsg = document.createElement('div');
    successMsg.innerHTML = `💝 Спасибо, ${name}! Твоя любовь доставлена! 💝`;
    successMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #4caf50, #45a049);
        color: white;
        padding: 20px 40px;
        border-radius: 20px;
        font-size: 1.2rem;
        font-weight: bold;
        z-index: 10000;
        text-align: center;
        max-width: 400px;
    `;
    
    document.body.appendChild(successMsg);
    
    // Очищаем форму
    document.getElementById('senderName').value = '';
    document.getElementById('loveMessage').value = '';
    
    setTimeout(() => {
        successMsg.remove();
    }, 3000);
}

// Секретные клики
function handleSecretClick(event) {
    // Случайные секретные места (5% вероятность)
    if (Math.random() < 0.05) {
        const secretMsg = document.createElement('div');
        const messages = [
            '💕 Ты нашел секретное место любви!',
            '😘 Сюрприз! Ты особенный!',
            '💖 Магия любви повсюду!',
            '🌟 Ты зажег звезду в наших сердцах!',
            '🎭 За кулисами любви!',
            '🌈 Радуга любви светит для тебя!',
            '✨ Ты создаешь магию!',
            '🎨 Ты раскрашиваешь наш мир!'
        ];
        
        // Случайные радужные цвета
        const colors = ['#ff0018', '#ff8c00', '#ffed00', '#008026', '#004dff', '#760188', '#ff6b9d', '#4ecdc4'];
        const randomColor1 = colors[Math.floor(Math.random() * colors.length)];
        const randomColor2 = colors[Math.floor(Math.random() * colors.length)];
        
        secretMsg.innerHTML = messages[Math.floor(Math.random() * messages.length)];
        secretMsg.style.cssText = `
            position: fixed;
            top: ${event.clientY}px;
            left: ${event.clientX}px;
            background: linear-gradient(45deg, ${randomColor1}, ${randomColor2});
            color: white;
            padding: 15px 25px;
            border-radius: 20px;
            font-size: 1rem;
            font-weight: bold;
            z-index: 10000;
            pointer-events: none;
            animation: secret-message 3s ease-out forwards;
            box-shadow: 0 0 20px ${randomColor1};
        `;
        
        document.body.appendChild(secretMsg);
        
        // Создаем радужные частицы вокруг сообщения
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.innerHTML = '✨';
            particle.style.cssText = `
                position: fixed;
                top: ${event.clientY + Math.random() * 40 - 20}px;
                left: ${event.clientX + Math.random() * 40 - 20}px;
                font-size: 1.5rem;
                pointer-events: none;
                z-index: 9999;
                animation: particle-float 2s ease-out forwards;
                filter: drop-shadow(0 0 10px ${colors[Math.floor(Math.random() * colors.length)]});
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 2000);
        }
        
        setTimeout(() => {
            secretMsg.remove();
        }, 3000);
    }
}

// Фейерверки для финала
function startFireworks() {
    const fireworks = document.querySelectorAll('.firework');
    fireworks.forEach((firework, index) => {
        setTimeout(() => {
            firework.style.animation = 'firework 3s infinite ease-out';
        }, index * 500);
    });
}

// Функция для показа радуги
function showRainbow() {
    // Создаем радужную анимацию
    const rainbow = document.createElement('div');
    rainbow.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #ff0018, #ff8c00, #ffed00, #008026, #004dff, #760188);
        background-size: 400% 400%;
        animation: rainbow-bg 2s ease infinite;
        z-index: 9999;
        pointer-events: none;
        opacity: 0.3;
    `;
    
    document.body.appendChild(rainbow);
    
    // Убираем радугу через 3 секунды
    setTimeout(() => {
        rainbow.remove();
    }, 3000);
}

// CSS анимации для JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes float-up {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-100px) scale(0.5); opacity: 0; }
    }
    
    @keyframes victory-bounce {
        0% { transform: translate(-50%, -50%) scale(0); }
        50% { transform: translate(-50%, -50%) scale(1.2); }
        100% { transform: translate(-50%, -50%) scale(1); }
    }
    
    @keyframes heart-firework {
        0% { transform: scale(0) rotate(0deg); opacity: 1; }
        50% { transform: scale(1.5) rotate(180deg); opacity: 1; }
        100% { transform: scale(0) rotate(360deg); opacity: 0; }
    }
    
    @keyframes shuffle-item {
        0% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.1) rotate(180deg); }
        100% { transform: scale(1) rotate(360deg); }
    }
    
    @keyframes secret-message {
        0% { transform: scale(0) rotate(0deg); opacity: 0; }
        20% { transform: scale(1.2) rotate(10deg); opacity: 1; }
        80% { transform: scale(1) rotate(-5deg); opacity: 1; }
        100% { transform: scale(0) rotate(0deg); opacity: 0; }
    }
    
    @keyframes particle-float {
        0% { transform: scale(0) translateY(0); opacity: 1; }
        50% { transform: scale(1) translateY(-30px); opacity: 1; }
        100% { transform: scale(0) translateY(-60px); opacity: 0; }
    }
`;
document.head.appendChild(style);


