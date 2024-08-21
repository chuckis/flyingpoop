window.onload = function() {
    const canvas = document.getElementById("poopCanvas");
    const ctx = canvas.getContext("2d");

    // Устанавливаем размеры холста равными размерам окна
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Первоначальный вызов для установки правильного размера

    let gameOver = false;

    // Параметры вентилятора
    let fan = {
        size: Math.min(canvas.width, canvas.height) * 0.1, // Размер вентилятора 10% от меньшей стороны экрана
        rotation: 0, // Начальный угол вращения
        speed: 0.05 // Скорость вращения
    };

    // Параметры прицела
    let crosshair = {
        x: 0,
        y: 0,
        size: Math.min(canvas.width, canvas.height) * 0.04 // Размер прицела 4% от меньшей стороны экрана
    };

    // Функция для перезапуска игры
    function restartGame() {
        gameOver = false;
        poops = []; // Очистить массив какашек
        restartButton.style.display = 'none'; // Скрыть кнопку
        gameLoop(); // Запустить цикл игры снова
    }

    // Показываем кнопку "START AGAIN" при завершении игры
    function showGameOverScreen() {
        // Рисуем GAME OVER
        ctx.fillStyle = '#8B4513'; // Коричневый фон
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.font = `bold ${Math.min(canvas.width, canvas.height) * 0.1}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2);

        // Показать кнопку для перезапуска
        restartButton.style.display = 'block';
    }

    // Добавляем обработчик на кнопку "START AGAIN"
    restartButton.addEventListener('click', restartGame);

    // Список всех какашек
    let poops = [];

    function spawnPoop() {
        // Создаём новую какашку в случайной позиции на границах холста
        let poop = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.min(canvas.width, canvas.height) * 0.04, // Размер какашки 4% от меньшей стороны экрана
            emoji: '💩', // Эмодзи какашки
            speed: 1 + Math.random() * 2, // Случайная скорость
            alive: true // Флаг жизни какашки
        };
        
        // Добавляем её в массив какашек
        poops.push(poop);
    }

    // Создаём новые какашки каждые 2 секунды
    setInterval(spawnPoop, 2000);

    // Обработка движения мыши и тач-событий для прицела
    function updateCrosshair(x, y) {
        crosshair.x = x;
        crosshair.y = y;
    }

    canvas.addEventListener('mousemove', function(event) {
        const rect = canvas.getBoundingClientRect();
        updateCrosshair(event.clientX - rect.left, event.clientY - rect.top);
    });

    canvas.addEventListener('touchmove', function(event) {
        const touch = event.touches[0];
        const rect = canvas.getBoundingClientRect();
        updateCrosshair(touch.clientX - rect.left, touch.clientY - rect.top);
    });

    // Обработка клика мыши и тач-событий для уничтожения какашки
    function handleClickOrTouch() {
        poops.forEach((poop) => {
            if (poop.alive) {
                let dx = crosshair.x - poop.x;
                let dy = crosshair.y - poop.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                // Если прицел попал на какашку, она "уничтожается"
                if (distance < 60) {
                    poop.alive = false;
                }
            }
        });
    }

    canvas.addEventListener('click', handleClickOrTouch);

    canvas.addEventListener('touchstart', function(event) {
        handleClickOrTouch();
        event.preventDefault(); // Отключаем нежелательные эффекты, такие как скролл
    });

    function drawPoop(poop) {
        if (poop.alive) {
            ctx.font = `${poop.size}px Arial`; // Размер и шрифт для эмодзи
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(poop.emoji, poop.x, poop.y);
        }
    }

    function drawFan() {
        ctx.save();
    
        // Устанавливаем центр вращения вентилятора
        ctx.translate(canvas.width / 2, canvas.height / 2);
    
        // Вращаем вентилятор
        ctx.rotate(fan.rotation);
    
        // Рисуем лопасти вентилятора
        ctx.fillStyle = '#999';
        for (let i = 0; i < 3; i++) { // Количество лопастей - 3
            ctx.beginPath();
            // Эллипс: x, y - центр, радиусы по x и y, угол поворота, начальный и конечный угол
            ctx.ellipse(0, -fan.size / 2, fan.size / 8, fan.size, 0, 0, 2 * Math.PI);
            ctx.fill();
            // Поворачиваем каждую лопасть на 120 градусов (2 * PI / 3)
            ctx.rotate((2 * Math.PI) / 3);
        }
    
        ctx.restore();
    }
    

    function drawCrosshair() {
        // Рисуем перекрестие прицела
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;

        // Горизонтальная линия
        ctx.beginPath();
        ctx.moveTo(crosshair.x - crosshair.size / 2, crosshair.y);
        ctx.lineTo(crosshair.x + crosshair.size / 2, crosshair.y);
        ctx.stroke();

        // Вертикальная линия
        ctx.beginPath();
        ctx.moveTo(crosshair.x, crosshair.y - crosshair.size / 2);
        ctx.lineTo(crosshair.x, crosshair.y + crosshair.size / 2);
        ctx.stroke();
    }

    function checkGameOver(poop) {
        let dx = poop.x - canvas.width / 2;
        let dy = poop.y - canvas.height / 2;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Если какашка долетела до вентилятора
        if (distance < fan.size && poop.alive) {
            gameOver = true;
        }
    }

    function movePoops() {
        poops.forEach((poop) => {
            if (poop.alive) {
                let dx = canvas.width / 2 - poop.x;
                let dy = canvas.height / 2 - poop.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                // Нормализуем вектор направления и перемещаем какашку
                poop.x += (dx / distance) * poop.speed;
                poop.y += (dy / distance) * poop.speed;

                // Проверка на столкновение с вентилятором
                checkGameOver(poop);
            }
        });
    }

    function drawGameOver() {
        ctx.fillStyle = 'black';
        ctx.font = `bold ${Math.min(canvas.width, canvas.height) * 0.1}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2);
    }

    function gameLoop() {
        if (!gameOver) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            movePoops();
            fan.rotation += fan.speed;
            drawFan();
            poops.forEach(drawPoop);
            drawCrosshair();
            requestAnimationFrame(gameLoop);
        } else {
            showGameOverScreen(); // Показываем GAME OVER и кнопку
        }
    
    }

    gameLoop();
};
