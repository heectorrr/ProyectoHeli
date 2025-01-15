const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = {
    x: 50,
    y: 300,
    width: 30,
    height: 30,
    speed: 3,
    gravity: 0.4,
    jumpPower: 11,
    velocityY: 0,
    isJumping: false
};

let keys = {};
let obstacles = [];
let obstacleFrequency = 150; // Frecuencia de aparición de obstáculos
let frameCount = 0;
let lastObstacleX = canvas.width; // Posición del último obstáculo
const minDistance = 100; // Distancia mínima entre obstáculos
let score = 0; // Contador de puntos
let secondsSurvived = 0; // Contador de segundos
let scoreInterval; // Intervalo para sumar puntos

function getRandomObstacle() {
    const type = Math.floor(Math.random() * 3); // 0: cuadrado, 1: rectángulo, 2: triángulo
    let obstacle = {
        x: canvas.width,
        y: canvas.height - 40,
        width: 30,
        height: 40,
        type: type
    };

    // tipos de obstaculos
    if (type === 0) { 
        obstacle.width = 20;
        obstacle.height = 20;
    } else if (type === 1) { 
        obstacle.width = 30;
        obstacle.height = 40;
    } else if (type === 2) { 
        obstacle.width = 20;
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
            console.log("Collision detected! Resetting game...");
            resetGame(); // Reiniciar el juego
            return; // Salir de la función para evitar más actualizaciones
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
function resetGame() {
    // Limpiar obstáculos
    obstacles = [];
    lastObstacleX = canvas.width;
    score = 0; // Reiniciar el contador de puntos
    secondsSurvived = 0; // Reiniciar el contador de segundos
    clearInterval(scoreInterval); // Limpiar el intervalo de puntuación
    document.getElementById('score').innerText = `Puntos: ${score}`; // Actualizar el contador de puntos
    startScoreInterval(); // Iniciar el intervalo de puntuación
    frameCount = 0; // Reiniciar el contador de frames
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas al reiniciar
    update();
}
function startScoreInterval() {
    scoreInterval = setInterval(() => {
        secondsSurvived++;
        score += 10; // Sumar 10 puntos por cada segundo
        document.getElementById('score').innerText = `Puntos: ${score}`; // Actualizar el contador de puntos
        if (score % 100 === 0) { // Verificar si se alcanzó un múltiplo de 100
            player.speed += 2; // Aumentar la velocidad del jugador
            console.log(`Velocidad aumentada: ${player.speed}`); // Mostrar la nueva velocidad
        }
    }, 1000); // Cada segundo
}
// eventos de teclado
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Manejo del botón de reinicio
document.getElementById('restartButton').addEventListener('click', resetGame);

// Iniciar el juego
startScoreInterval();
update();