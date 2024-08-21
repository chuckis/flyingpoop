window.onload = function() {
    const canvas = document.getElementById("poopCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Параметры эмодзи какашки
    let poop = {
        x: Math.random() * canvas.width, // Стартовая позиция по X (случайная)
        y: Math.random() * canvas.height, // Стартовая позиция по Y (случайная)
        size: 50, // Размер эмодзи
        emoji: '💩', // Эмодзи какашки
        speed: 2 // Скорость
    };

    let targetX = canvas.width / 2;
    let targetY = canvas.height / 2;

    function drawPoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Отрисовать эмодзи какашки
        ctx.font = `${poop.size}px Arial`; // Размер и шрифт
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(poop.emoji, poop.x, poop.y);
    }

    function movePoop() {
        // Вычислить направление движения эмодзи к центру
        let dx = targetX - poop.x;
        let dy = targetY - poop.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Нормализуем вектор направления и перемещаем какашку
        if (distance > 1) {
            poop.x += (dx / distance) * poop.speed;
            poop.y += (dy / distance) * poop.speed;
        }

        drawPoop();

        requestAnimationFrame(movePoop);
    }

    movePoop();
};
