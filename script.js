const canvas = document.getElementById("escapeGame");
const ctx = canvas.getContext("2d");
let gameRunning = false;
let difficulty = "Easy";
let baseCat1Speed = 4;
let baseCat2Speed = -6;
let baseCat3Speed = 5;
let baseCat4Speed = -7;
let cat3X = 200, cat3Y = 115, cat3Speed = baseCat3Speed;
let cat4X = 700, cat4Y = 460, cat4Speed = baseCat4Speed;
let hasKey = false;
let keyX = 150;
let keyY = 260;
let turrets = [
    { x: 25, y: 250, timer: 0 },
    { x: 875, y: 400, timer: 75 }
];
let bullets = [];
let mouseColor = "lightgray";
let bgColor = "lightgray";
let playerX = 450;
let playerY = 650;
let speed = 35;
let exitX = 450;
let exitY = 20
let exitWidth = 50;
let exitHeight = 70;
let catX = 100;
let catY = 320;
let catSpeed = baseCat1Speed;
let cat2X = 450;
let cat2Y = 190;
let cat2Speed = baseCat2Speed;
let score = 0;
let lives = 3;
let timeLeft = 20;
let frameCount = 0;
let highScore = localStorage.getItem("mouseEscapeHighScore") || 0;
document.getElementById("highScoreDisplay").innerText = "High Score: " +highScore;
const audioCtx = new(window.AudioContext || window.webkitAudioContext)();
let soundEnabled = true;
let soundVolume = 0.3;
let isPaused = false;
let isGameRunning = false;
function playTone(freq, type, duration, delay = 0) {
    if (!soundEnabled) return;
    if (audioCtx.state === "suspended") audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
    gain.gain.setValueAtTime(soundVolume, audioCtx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + delay);
    osc.stop(audioCtx.currentTime + delay + duration);
}
function playMoveSound() {
    playTone(320, "triangle", 0.06);
}
function playWinSound() {
    playTone(523, "sine", 0.12, 0);
    playTone(659, "sine", 0.12, 0.1);
    playTone(784, "sine", 0.12, 0.2);
    playTone(1046, "sine", 0.25, 0.3);
}
function playLoseSound() {
    playTone(250, "sawtooth", 0.15, 0);
    playTone(180, "sawtooth", 0.15, 0.12);
    playTone(110, "sawtooth",0.3, 0.24);
    }

    function toggleSound() {
        const btn = document.getElementById("soundBtn");
        soundEnabled = !soundEnabled;
        btn.innerText = soundEnabled ? "Sound ON" : "Sound OFF";
        if (soundEnabled) playMoveSound();
    }
    function changeVolume() {
        soundVolume = parseFloat(document.getElementById("volumeSlider").value)
        if (soundEnabled && soundVolume > 0) playMoveSound();
    }
function openTab(tabId) {
    document.getElementById("mainMenu").classList.add("hidden");
    document.getElementById("optionsMenu").classList.add("hidden");
    document.getElementById("exitTab").classList.add("hidden");
    document.getElementById(tabId).classList.remove("hidden");
    document.getElementById("pauseMenu").classList.add("hidden");
}
function togglePause() {
    if (!isGameRunning) return;
    isPaused = !isPaused;
    const pauseMenu = document.getElementById("pauseMenu");
    if (isPaused) {
        pauseMenu.classList.remove("hidden");
    } else {
        pauseMenu.classList.add("hidden");
    }
}
function returnToMainMenu() {
    isPaused = false;
    isGameRunning = false;
    openTab("mainMenu");
}
function changeDifficulty() {
    const diffBtn = document.getElementById("diffBtn");
    if (difficulty === "Easy") {
        difficulty = "Medium";
        baseCat1Speed = 6;
        baseCat2Speed = -8;
        baseCat3Speed = 8;
        baseCat4Speed = -10;
    } else if(difficulty === "Medium") {
        difficulty = "Hard";
        baseCat1Speed = 9;
        baseCat2Speed = -11;
        baseCat3Speed = 11;
        baseCat4Speed = -13
    } else {
        difficulty = "Easy";
        baseCat1Speed = 4;
        baseCat2Speed = -6;
        baseCat3Speed = 5;
        baseCat4Speed = -7;
    }
    diffBtn.innerText = "Difficulty: " + difficulty;
}
function changeMouseColor() {
    const btn = document.getElementById("mouseColorBtn");
    if (mouseColor === "lightgray") {
        mouseColor = "white";
        btn.innerText = "Color: White";
    } else if (mouseColor === "white") {
        mouseColor = "tan";
        btn.innerText = "Color: Brown";
} else {
    mouseColor = "lightgray";
    btn.innerText = "Color: Gray";
   }
}
function changeTheme() {
    const btn = document.getElementById("themeBtn");
    if (bgColor === "lightgray") {
        bgColor = "#2c3e50";
        btn.innerText = "Theme: Night";
    } else {
        bgColor = "lightgray";
        btn.innerText = "Theme: Light";
    }
}
function spawnKey() {
    hasKey = false;
    keyX = Math.floor(Math.random() * 740) + 80;
    keyY = Math.floor(Math.random() * 420) +130;
}
function startGame() {
    lives = 3;
    timeLeft = 20;
    score = 0;
    isGameRunning = true;
    isPaused = false;
    document.getElementById("mainMenu").classList.add("hidden");
    playerX = 450;
    playerY = 650;
    score = 0;
    catSpeed = baseCat1Speed;
    cat2Speed = baseCat2Speed;
    cat3Speed = baseCat3Speed;
    cat4Speed = baseCat4Speed;
    bullets = [];
    spawnKey();
    if (!gameRunning) {
        gameRunning = true;
        gameLoop(); 
    }
}
function drawCircle(x, y, size, color) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}   
function drawDoor() {
   ctx.fillStyle = hasKey ? "#2ecc71" : "#e94560";
   ctx.fillRect(exitX - 5, exitY - 5, exitWidth + 10, exitHeight + 5);
   ctx.fillStyle = hasKey? "#8B4513" : "#3d1e0d";
   ctx.fillRect(exitX, exitY, exitWidth, exitHeight);
   drawCircle(exitX + 40, exitY + 30, 5, hasKey ? "yellow" : "red");
}
function drawKey() {
    if (hasKey) return;
    drawCircle(keyX, keyY, 10, "#ffd700");
    drawCircle(keyX, keyY, 4, bgColor);
    ctx.fillStyle = "#ffd700";
    ctx.fillRect(keyX + 8, keyY - 3, 16, 6);
    ctx.fillRect(keyX + 12, keyY + 3, 4, 6);
    ctx.fillRect(keyX + 22, keyY + 3, 4, 6);
}
function drawTurretsAndBullets() {
    turrets.forEach(t => {
        let angle = Math.atan2((playerY + 20) - t.y, (playerX + 20) - t.x);
        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.rotate(angle);
        ctx.fillStyle = "#333";
        ctx.fillRect(0, -6, 26, 12);
        ctx.restore();
        drawCircle(t.x, t.y, 16, "#e94560");
        drawCircle(t.x, t.y, 8, "#16213e");
    });
    bullets.forEach(b => {
        drawCircle(b.x, b.y, 7, "#ff3838");
        drawCircle(b.x, b.y, 3, "#fff200");
    });
}
function drawMouse() {
    drawCircle(playerX + 10, playerY + 10, 8, "gray");
    drawCircle(playerX + 10, playerY + 10, 4, "pink");
    drawCircle(playerX + 30, playerY + 10, 8, "gray");
    drawCircle(playerX + 30, playerY + 10, 4, "pink");
    drawCircle(playerX + 20, playerY + 24, 14, mouseColor);
    drawCircle(playerX + 15, playerY + 21, 2, "white");
    drawCircle(playerX + 25, playerY + 21, 2, "white");
    drawCircle(playerX + 20, playerY + 32, 3, "black");
}
function drawCat(x, y, color) {
    drawCircle(x + 8, y + 8, 7, color);
    drawCircle(x + 32, y + 8, 7, color);
    drawCircle(x + 20, y + 22, 16, color);
    drawCircle(x + 14, y + 19, 3, "black");
    drawCircle(x + 26, y + 19, 3, "black");
    drawCircle(x + 20, y + 26, 3, "black");
}
function drawScore() {
    ctx.fillStyle = "#e94560";
    ctx.font = "24px Times New Roman";
    ctx.fillText("Score: " + score, 20, 40);
}
document.addEventListener("keydown", function(event) {
    if (!gameRunning) return;
    if (event.key === "Escape") {
        gameRunning = false;
        openTab("mainMenu");
        return;
    }
    if (event.key === "Escape" || event.key === "p" || event.key === "P") {
        togglePause();
        return;
    }
    if (isPaused || !isGameRunning) return;
    if (event.key === "ArrowLeft") {
        playerX = playerX - speed;
        playMoveSound();
    }
    if (event.key === "ArrowRight") {
        playerX = playerX + speed;
        playMoveSound();
    }
    if (event.key === "ArrowUp") {
        playerY = playerY - speed;
        playMoveSound();
    }
    if (event.key === "ArrowDown") {
        playerY = playerY + speed;
        playMoveSound();
    }
    if (playerX < 0) {
    playerX = 0;
    }
    if (playerX > 860) {
    playerX =860;
    }
    if (playerY < 0) {
    playerY = 0;
    }
    if (playerY > 660) {
    playerY = 660;
    }
});
function loseLife() {
    playLoseSound();
    lives--;
    bullets = [];
    if(lives <= 0) {
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("mouseEscapeHighScore", highScore);
            document.getElementById("highScoreDisplay").innerText = "High Score: " + highScore; 
        }
        alert("Good! Try again. Final Score: " + score);
        lives = 3;
        score = 0;
        spawnKey();
    } else {
        alert("Oops! the lives end: " + lives);
    }
    playerX = 450;
    playerY = 650;
    timeLeft = 20;
    catSpeed = baseCat1Speed;
    cat2Speed = baseCat2Speed;
    cat3Speed = baseCat3Speed;
    cat4Speed = baseCat4Speed;
}
function gameLoop(){
    if (!isGameRunning) return;
    if (isPaused) {
        requestAnimationFrame(gameLoop);
        return;
    }
    if (!gameRunning) return;
    frameCount++;
    if (frameCount >= 15) {
        timeLeft--;
        frameCount = 0;
    }
    if (timeLeft <= 0) {
        timeLeft = 20;
        loseLife();
    }
    catX = catX + catSpeed;
    if (catX > 860 || catX < 0) {
    catSpeed = -catSpeed;
}
    cat2X = cat2X + cat2Speed;
    if (cat2X > 860 || cat2X < 0) {
        cat2Speed = -cat2Speed;
    }
    cat3X += cat3Speed;
    if (cat3X > 860 || cat3X < 0) cat3Speed = -cat3Speed;
    cat4X += cat4Speed;
    if (cat4X > 860 || cat4X < 0) cat4Speed = -cat4Speed;
    let hitCat1 = playerX < catX + 40 && playerX + 40 > catX && playerY < catY + 40 && playerY + 40 > catY;
    let hitCat2 = playerX < cat2X +40 && playerX + 40 > cat2X && playerY < cat2Y + 40 && playerY + 40 > cat2Y;
    let hitCat3 = playerX < cat3X +40 && playerX + 40 > cat3X && playerY < cat3Y + 40 && playerY + 40 > cat3Y;
    let hitCat4 = playerX < cat4X +40 && playerX + 40 > cat4X && playerY < cat4Y + 40 && playerY + 40 > cat4Y;
    if (hitCat1 || hitCat2 || hitCat3 || hitCat4) {
        loseLife();
    }
    if (!hasKey && playerX < keyX + 25 && playerX + 40 > keyX - 10 && playerY < keyY +15 && playerY + 40 > keyY - 10) {
        hasKey = true;
        timeLeft += 5;
        playTone(880, "sine", 0.15);
    }
    turrets.forEach(t => {
        t.timer++;
        if (t.timer >= 140) {
            t.timer = 0;
            let angle = Math.atan2((playerY + 20) - t.y, (playerX + 20) - t.x);
            bullets.push({
                x: t.x,
                y: t.y,
                vx: Math.cos(angle) * 5,
                vy: Math.sin(angle) * 5
            });
        }
    });
    for (let i = bullets.length - 1; i >= 0; i--) {
        let b = bullets[i];
        b.x += b.vx;
        b.y += b.vy;
        if (b.x > playerX + 5 && b.x < playerX + 35 && b.y > playerY + 5 && b.y < playerY + 35) {
            loseLife();
            break;
        }
        if (b.x < 0 || b.x > 900 || b.y < 0 || b.y > 700) {
            bullets.splice(i, 1);
        }
    }
    if(
        hasKey &&
        playerX < exitX + exitWidth &&
        playerX + 40 > exitX &&
        playerY < exitY + exitHeight &&
        playerY + 40 > exitY  
    ) {
        score = score + 1;
        playWinSound();
        alert("Good job! The Mouse Has Escaped.");
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("mouseEscapeHighScore", highScore);
            document.getElementById("highScoreDisplay").innerText = "High Score: " + highScore;
        }
        playerX = 450;
        playerY = 650;
        timeLeft = 20;
        spawnKey();
        timeLeft = 20;
        bullets = [];
        if (catSpeed > 0) catSpeed = catSpeed + 1;
        else catSpeed = catSpeed - 1;
        if (cat2Speed > 0) cat2Speed = cat2Speed + 1;
        else cat2Speed = cat2Speed - 1;
         if (cat3Speed > 0) cat3Speed = cat3Speed + 1;
        else cat3Speed = cat3Speed - 1;
         if (cat4Speed > 0) cat4Speed = cat4Speed + 1;
        else cat4Speed = cat4Speed - 1;
    }
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 900, 700);
    drawDoor();
    drawMouse();
    drawCat(catX, catY, "gray");
    drawCat(cat2X, cat2Y, "yellow");
    drawCat(cat3X, cat3Y, "orange");
    drawCat(cat4X, cat4Y, "purple");
    drawKey();
    drawTurretsAndBullets();
    drawScore();
    ctx.font = "bold 22px Segoe UI";
    ctx.fillStyle = "#e94560";
    ctx.fillText("Lives: " + "❤️".repeat(lives), 20, 65);
    ctx.fillStyle = "#ffd700";
    ctx.fillText("High Score: " + highScore, 20, 95);
    ctx.fillStyle = timeLeft <= 5 ? "#ff3838" : "#00d2d3";
    ctx.fillText("Time Left: " + timeLeft + "s", 700, 40);
    ctx.fillStyle = hasKey ? "#2ecc71" : "#ffffff";
    ctx.fillText(hasKey ? "Key: Ready!" : "Key: Find it", 20, 125);
    requestAnimationFrame(gameLoop);
}