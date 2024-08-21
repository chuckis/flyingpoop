window.onload = function() {
    const canvas = document.getElementById("poopCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Параметры эмодзи какашки
    let poop = {
        x: Math.random() * canvas.width, // Стартовая позиция по X (случайная)
        y: Math.random() * canvas.height, // Стартовая позиция по Y (случайная)
        size: 20, // Размер эмодзи
        emoji: '💩', // Эмодзи какашки
        speed: 2 // Скорость
    };

    // Параметры вентилятора
    let fan = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: poop.size * 2, // В 2 раза больше какашки
        rotation: 0, // Начальный угол вращения
        speed: 0.05 // Скорость вращения
    };

    let targetX = canvas.width / 2;
    let targetY = canvas.height / 2;

    function drawPoop() {
        ctx.font = `${poop.size}px Arial`; // Размер и шрифт для эмодзи
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(poop.emoji, poop.x, poop.y);
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

    function movePoop() {
        // Очистить холст
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Вычислить направление движения эмодзи к центру
        let dx = targetX - poop.x;
        let dy = targetY - poop.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Нормализовать вектор направления и перемещать какашку
        if (distance > 1) {
            poop.x += (dx / distance) * poop.speed;
            poop.y += (dy / distance) * poop.speed;
        }

        // Вращать вентилятор
        fan.rotation += fan.speed;

        // Отрисовать вентилятор и какашку
        drawFan();
        drawPoop();

        requestAnimationFrame(movePoop);
    }

    movePoop();
};
