window.onload = function() {
    const canvas = document.getElementById("poopCanvas");
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Telegrsm bot stuff
    const WebApp = window.Telegram.WebApp;
    
    WebApp.ready()
    // WebApp.showAlert(`Welcome, @${WebApp.WebAppUser.username}. Let's start a game`);
    WebApp.expand();

    WebApp.MainButton.setText('EXIT').show().onClick(function () {
        console.log("send score!");
        sendScoreToTelegram(score);
        WebApp.close();
    });

    let gameOver = false;
    let score = 0; // Переменная для хранения очков

    function updateScore() {
        score++;
        document.getElementById('scoreContainer').innerText = `SCORE: ${score}`;
    }

    let fan = {
        size: Math.min(canvas.width, canvas.height) * 0.1,
        rotation: 0,
        speed: 0.05
    };

    let crosshair = {
        x: 0,
        y: 0,
        size: Math.min(canvas.width, canvas.height) * 0.04
    };

    function restartGame() {
        gameOver = false;
        poops = [];
        score = 0; // Сбросить очки при перезапуске
        restartButton.style.display = 'none';
        gameLoop();
    }

    function showGameOverScreen() {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.font = `bold ${Math.min(canvas.width, canvas.height) * 0.1}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2);
        restartButton.style.display = 'block';
        sendScoreToTelegram(score);
    }

    restartButton.addEventListener('click', restartGame);

    let poops = [];

    function spawnPoop() {
        let poop = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.min(canvas.width, canvas.height) * 0.04,
            emoji: '💩',
            speed: 1 + Math.random() * 2,
            alive: true
        };
        
        poops.push(poop);
    }

    setInterval(spawnPoop, 2000);

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

    function handleClickOrTouch() {
        poops.forEach((poop) => {
            if (poop.alive) {
                let dx = crosshair.x - poop.x;
                let dy = crosshair.y - poop.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 60) {
                    poop.alive = false;
                    updateScore(); // Обновляем счет
                }
            }
        });
    }

    canvas.addEventListener('click', handleClickOrTouch);

    canvas.addEventListener('touchstart', function(event) {
        handleClickOrTouch();
        event.preventDefault();
    });

    function drawPoop(poop) {
        if (poop.alive) {
            ctx.font = `${poop.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(poop.emoji, poop.x, poop.y);
        }
    }

    function drawFan() {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(fan.rotation);
        ctx.fillStyle = '#999';
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.ellipse(0, -fan.size / 2, fan.size / 8, fan.size, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.rotate((2 * Math.PI) / 3);
        }
        ctx.restore();
    }

    function sendScoreToTelegram(score) {
        const data = JSON.stringify({
            score: score
        });
        WebApp.sendData(data);
    }
    

    function checkGameOver(poop) {
        let dx = poop.x - canvas.width / 2;
        let dy = poop.y - canvas.height / 2;
        let distance = Math.sqrt(dx * dx + dy * dy);

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

                poop.x += (dx / distance) * poop.speed;
                poop.y += (dy / distance) * poop.speed;

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
            requestAnimationFrame(gameLoop);
        } else {
            showGameOverScreen();
        }
    }

    gameLoop();
}
