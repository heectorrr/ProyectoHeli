const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = {
    x: 50,
    y: 300,
    width: 30,
    height: 30,
    speed: 3,
    gravity: 0.5,
    jumpPower: 10,
    velocityY: 0,
    isJumping: false
};

let keys = {};
let obstacles = [];
let obstacleFrequency = 150; // Frecuencia de aparición de obstáculos
let frameCount = 0;
let lastObstacleX = canvas.width; // Posición del último obstáculo
const minDistance = 100; // Distancia mínima entre obstáculos

function getRandomObstacle() {
    const type = Math.floor(Math.random() * 3); // 0: cuadrado, 1: rectángulo, 2: triángulo
    let obstacle = {
        x: canvas.width,
        y: canvas.height - 40,
        width: 30,
        height: 40,
        type: type
    };

    // Ajustar las propiedades del obstáculo según su tipo
    if (type === 0) { // Cuadrado
        obstacle.width = 30;
        obstacle.height = 30;
    } else if (type === 1) { // Rectángulo
        obstacle.width = 30;
        obstacle.height = 50;
    } else if (type === 2) { // Triángulo
        obstacle.width = 10;
        obstacle.height = 40;
    }

    return obstacle;
}

function update() {
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
        if (lastObstacleX === canvas.width || (lastObstacleX - player.speed) >= minDistance) {
            let obstacle = getRandomObstacle();
            obstacles.push(obstacle);
            lastObstacleX = obstacle.x; // Actualizar la posición del último obstáculo
        }
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
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width , obstacle.height);
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