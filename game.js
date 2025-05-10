const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = {
  x: 50,
  y: canvas.height / 2,
  width: 50,
  height: 50,
  speed: 5,
  dx: 0,
  dy: 0
};

let bullets = [];
let enemies = [];

function drawPlayer() {
  ctx.fillStyle = "#FF6347";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function movePlayer() {
  player.x += player.dx;
  player.y += player.dy;

  // Yatay hareket sınırları
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
  // Dikey hareket sınırları
  if (player.y < 0) player.y = 0;
  if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

function shootBullet() {
  bullets.push({
    x: player.x + player.width,
    y: player.y + player.height / 2 - 5,
    width: 10,
    height: 10,
    speed: 7
  });
}

function drawBullets() {
  ctx.fillStyle = "#f1c40f";
  bullets.forEach(bullet => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    bullet.x += bullet.speed;
  });

  bullets = bullets.filter(bullet => bullet.x < canvas.width); // Ekranı terk eden mermiler silinir
}

function createEnemies() {
  const enemyWidth = 50;
  const enemyHeight = 50;
  const enemyX = canvas.width;
  const enemyY = Math.random() * (canvas.height - enemyHeight);
  enemies.push({ x: enemyX, y: enemyY, width: enemyWidth, height: enemyHeight, speed: 2 });
}

function drawEnemies() {
  ctx.fillStyle = "#3498db";
  enemies.forEach(enemy => {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    enemy.x -= enemy.speed; // Düşman sağdan sola doğru hareket eder
  });

  enemies = enemies.filter(enemy => enemy.x + enemy.width > 0); // Ekranı terk eden düşmanlar silinir
}

function checkCollisions() {
  bullets.forEach(bullet => {
    enemies.forEach((enemy, index) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        // Düşman ve mermi çarpışması
        enemies.splice(index, 1); // Düşman yok edilir
        bullets = bullets.filter(b => b !== bullet); // Mermi yok edilir
      }
    });
  });
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  movePlayer();
  drawPlayer();
  drawBullets();
  drawEnemies();
  checkCollisions();

  if (Math.random() < 0.02) createEnemies(); // Rastgele düşman yaratımı

  requestAnimationFrame(update); // Sürekli olarak güncellenir
}

// Kontroller
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowUp") player.dy = -player.speed;
  if (e.key === "ArrowDown") player.dy = player.speed;
  if (e.key === "ArrowLeft") player.dx = -player.speed;
  if (e.key === "ArrowRight") player.dx = player.speed;
  if (e.key === " ") shootBullet(); // Boşluk tuşu ile ateş et
});

document.addEventListener("keyup", function (e) {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") player.dy = 0;
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") player.dx = 0;
});

update(); // Oyunu başlat