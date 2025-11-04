// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = {
    x: 10,
    y: 10,
    dx: 0,
    dy: 0,
    cells: [],
    maxCells: 4
};

let food = {
    x: 15,
    y: 15
};

let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gamePaused = false;
let gameLoop = null;

// DOM elements
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const gameStatusElement = document.getElementById('gameStatus');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

// Initialize
highScoreElement.textContent = highScore;

// Generate random food position
function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);

    // Make sure food doesn't spawn on snake
    for (let cell of snake.cells) {
        if (cell.x === food.x && cell.y === food.y) {
            generateFood();
            break;
        }
    }
}

// Draw game
function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid (optional, for better visibility)
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }

    // Move snake
    snake.x += snake.dx;
    snake.y += snake.dy;

    // Wall collision
    if (snake.x < 0 || snake.x >= tileCount || snake.y < 0 || snake.y >= tileCount) {
        gameOver();
        return;
    }

    // Add new head position
    snake.cells.unshift({x: snake.x, y: snake.y});

    // Remove tail if not eating
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    // Draw food
    ctx.fillStyle = '#FF0000';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#FF0000';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    ctx.shadowBlur = 0;

    // Draw snake
    ctx.fillStyle = '#00FF00';
    snake.cells.forEach((cell, index) => {
        // Gradient effect for snake body
        const brightness = 255 - (index * 3);
        ctx.fillStyle = `rgb(0, ${brightness}, 0)`;

        ctx.fillRect(cell.x * gridSize, cell.y * gridSize, gridSize - 2, gridSize - 2);

        // Check collision with self
        for (let i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                gameOver();
                return;
            }
        }
    });

    // Check if snake ate food
    if (snake.x === food.x && snake.y === food.y) {
        snake.maxCells++;
        score++;
        scoreElement.textContent = score;

        // Update high score
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }

        generateFood();
    }
}

// Game loop
function gameUpdate() {
    if (gameRunning && !gamePaused) {
        draw();
    }
}

// Start game
function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        gamePaused = false;
        gameStatusElement.textContent = '';
        startBtn.disabled = true;
        pauseBtn.disabled = false;

        if (!gameLoop) {
            gameLoop = setInterval(gameUpdate, 100);
        }
    }
}

// Pause game
function pauseGame() {
    if (gameRunning) {
        gamePaused = !gamePaused;
        pauseBtn.textContent = gamePaused ? 'Resume' : 'Pause';
        gameStatusElement.textContent = gamePaused ? 'PAUSED' : '';
    }
}

// Reset game
function resetGame() {
    clearInterval(gameLoop);
    gameLoop = null;
    gameRunning = false;
    gamePaused = false;

    snake = {
        x: 10,
        y: 10,
        dx: 0,
        dy: 0,
        cells: [],
        maxCells: 4
    };

    score = 0;
    scoreElement.textContent = score;
    gameStatusElement.textContent = '';

    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Pause';

    generateFood();

    // Clear and draw initial state
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Game over
function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    gameLoop = null;

    gameStatusElement.textContent = 'GAME OVER!';
    gameStatusElement.style.color = '#FF0000';

    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Pause';

    setTimeout(() => {
        gameStatusElement.style.color = '#667eea';
    }, 2000);
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    // Prevent default arrow key behavior (scrolling)
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }

    // Start game on first arrow key press
    if (!gameRunning && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        startGame();
    }

    // Change direction (can't reverse)
    if (e.key === 'ArrowLeft' && snake.dx === 0) {
        snake.dx = -1;
        snake.dy = 0;
    } else if (e.key === 'ArrowRight' && snake.dx === 0) {
        snake.dx = 1;
        snake.dy = 0;
    } else if (e.key === 'ArrowUp' && snake.dy === 0) {
        snake.dy = -1;
        snake.dx = 0;
    } else if (e.key === 'ArrowDown' && snake.dy === 0) {
        snake.dy = 1;
        snake.dx = 0;
    } else if (e.key === ' ' || e.key === 'p') {
        // Space or 'p' to pause
        pauseGame();
    }
});

// Button event listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
resetBtn.addEventListener('click', resetGame);

// Touch controls for mobile
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

const minSwipeDistance = 30; // Minimum distance for a swipe to be registered

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: false });

canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: false });

function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Check if swipe distance is sufficient
    if (absDeltaX < minSwipeDistance && absDeltaY < minSwipeDistance) {
        return;
    }

    // Start game on first swipe
    if (!gameRunning) {
        startGame();
    }

    // Determine swipe direction
    if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0 && snake.dx === 0) {
            // Swipe right
            snake.dx = 1;
            snake.dy = 0;
        } else if (deltaX < 0 && snake.dx === 0) {
            // Swipe left
            snake.dx = -1;
            snake.dy = 0;
        }
    } else {
        // Vertical swipe
        if (deltaY > 0 && snake.dy === 0) {
            // Swipe down
            snake.dy = 1;
            snake.dx = 0;
        } else if (deltaY < 0 && snake.dy === 0) {
            // Swipe up
            snake.dy = -1;
            snake.dx = 0;
        }
    }
}

// On-screen direction button controls
function setupDirectionButtons() {
    const upBtn = document.getElementById('upBtn');
    const downBtn = document.getElementById('downBtn');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');

    if (upBtn) {
        upBtn.addEventListener('click', () => {
            if (!gameRunning) startGame();
            if (snake.dy === 0) {
                snake.dy = -1;
                snake.dx = 0;
            }
        });
    }

    if (downBtn) {
        downBtn.addEventListener('click', () => {
            if (!gameRunning) startGame();
            if (snake.dy === 0) {
                snake.dy = 1;
                snake.dx = 0;
            }
        });
    }

    if (leftBtn) {
        leftBtn.addEventListener('click', () => {
            if (!gameRunning) startGame();
            if (snake.dx === 0) {
                snake.dx = -1;
                snake.dy = 0;
            }
        });
    }

    if (rightBtn) {
        rightBtn.addEventListener('click', () => {
            if (!gameRunning) startGame();
            if (snake.dx === 0) {
                snake.dx = 1;
                snake.dy = 0;
            }
        });
    }
}

// Initialize game
resetGame();
setupDirectionButtons();
