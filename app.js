const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = {
    x: 50,
    y: 300,
    width: 30,
    height: 30,
    speed: 2, // Velocidad de movimiento constante
    gravity: 0.5,
    jumpPower: 10,
    velocityY: 0,
    isJumping: false
};

let keys = {};
let obstacles = [];
let obstacleFrequency = 150; // Frecuencia de aparición de obstáculos
let frameCount = 0;

function update() {
    // Movimiento automático hacia la derecha
    player.x += player.speed;

    // Gravedad
    player.velocityY += player.gravity;
    player.y += player.velocityY;

    // Colisión con el suelo
    if (player.y + player.height >= canvas.height) {
        player.y = canvas.height - player.height;
        player.isJumping = false;
        player.velocityY = 0;
    }

    // Salto
    if (keys['ArrowUp'] && !player.isJumping) {
        player.velocityY = -player.jumpPower;
        player.isJumping = true;
    }

    // Generar obstáculos
    if (frameCount % obstacleFrequency === 0) {
        let obstacle = {
            x: canvas.width,
            y: canvas.height - 40, // Altura del obstáculo
            width: 30,
            height: 40
        };
        obstacles.push(obstacle);
    }

    // Mover y dibujar obstáculos
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= player.speed; // Mover el obstáculo hacia la izquierda

        // Colisión con el jugador
        if (player.x < obstacles[i].x + obstacles[i].width &&
            player.x + player.width > obstacles[i].x &&
            player.y < obstacles[i].y + obstacles[i].height &&
            player.y + player.height > obstacles[i].y) {
            // Colisión detectada
            alert("¡Has chocado con un obstáculo!");
            document.location.reload(); // Reiniciar el juego
        }

        // Eliminar obstáculos que se han salido de la pantalla
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
        }
    }

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar jugador
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Dibujar obstáculos
    ctx.fillStyle = 'black';
    for (let obstacle of obstacles) {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }

    frameCount++;
    requestAnimationFrame(update);
}

// Manejo de eventos de teclado
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Iniciar el juego
update();