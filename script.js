window.onload = function() {
    const canvas = document.getElementById("poopCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 500;
    canvas.height = 500;

    let gameOver = false;

    // Параметры вентилятора
    let fan = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: 40, // Размер вентилятора (в 2 раза больше какашки)
        rotation: 0, // Начальный угол вращения
        speed: 0.05 // Скорость вращения
    };

    // Параметры прицела
    let crosshair = {
        x: 0,
        y: 0,
        size: 20 // Размер прицела
    };

    // Список всех какашек
    let poops = [];

    function spawnPoop() {
        // Создаём новую какашку в случайной позиции на границах холста
        let poop = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 20, // Размер какашки
            emoji: '💩', // Эмодзи какашки
            speed: 1 + Math.random() * 2, // Случайная скорость
            alive: true // Флаг жизни какашки
        };
        
        // Добавляем её в массив какашек
        poops.push(poop);
    }

    // Создаём новые какашки каждые 2 секунды
    setInterval(spawnPoop, 2000);

    // Обработка движения мыши для прицела
    canvas.addEventListener('mousemove', function(event) {
        crosshair.x = event.clientX - canvas.getBoundingClientRect().left;
        crosshair.y = event.clientY - canvas.getBoundingClientRect().top;
    });

    // Обработка клика мыши для уничтожения какашки
    canvas.addEventListener('click', function() {
        poops.forEach((poop) => {
            if (poop.alive) {
                let dx = crosshair.x - poop.x;
                let dy = crosshair.y - poop.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                // Если прицел попал на какашку, она "уничтожается"
                if (distance < poop.size) {
                    poop.alive = false;
                }
            }
        });
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
        // Сохранить текущие параметры контекста
        ctx.save();

        // Переместить центр к вентилятору
        ctx.translate(fan.x, fan.y);

        // Вращать вокруг центра вентилятора
        ctx.rotate(fan.rotation);

        // Нарисовать 4 лопасти вентилятора (крестовина)
        ctx.fillStyle = '#999'; // Цвет вентилятора
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.rect(-fan.size / 8, -fan.size, fan.size / 4, fan.size);
            ctx.fill();
            ctx.rotate(Math.PI / 2); // Повернуть на 90 градусов
        }

        // Восстановить исходное состояние контекста
        ctx.restore();
    }

    function drawCrosshair() {
        // Нарисовать перекрестие прицела
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
        let dx = poop.x - fan.x;
        let dy = poop.y - fan.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Если какашка долетела до вентилятора
        if (distance < fan.size && poop.alive) {
            gameOver = true;
        }
    }

    function movePoops() {
        poops.forEach((poop) => {
            if (poop.alive) {
                let dx = fan.x - poop.x;
                let dy = fan.y - poop.y;
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
        ctx.font = 'bold 50px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2);
    }

    function gameLoop() {
        // Очистить холст
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!gameOver) {
            // Вращать вентилятор
            fan.rotation += fan.speed;

            // Отрисовать вентилятор, какашки и прицел
            drawFan();
            poops.forEach(drawPoop);
            drawCrosshair();

            // Двигать какашки
            movePoops();

            requestAnimationFrame(gameLoop);
        } else {
            // Если игра окончена
            ctx.fillStyle = '#8B4513'; // Коричневый фон
            ctx.fillRect(0, 0, canvas.width, canvas.height); // Закрасить весь экран
            drawGameOver(); // Нарисовать "GAME OVER!"
        }
    }

    gameLoop();
};
