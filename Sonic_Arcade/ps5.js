// ==== Variáveis Globais ====
let sonicImg, ringImg, enemyImg, bgImg, robImg;
let sonicIdleImg, sonicRunImg, sonicJumpImg; // Diferentes estados do Sonic
let enemy1Img, enemy2Img, enemy3Img; // Diferentes tipos de inimigos
let groundImg, cloudImg; // Elementos do cenário
let jumpSound, ringSound;

let sonic;
let rings = [];
let enemies = [];
let chaosEmeralds = [];
let boss;
let particles = [];

let score = 0;
let lives = 3;
let bossFight = false;
let gameWon = false;
let gameState = "start"; // "start", "playing", "victory", "gameOver"
let difficultyLevel = 1;

let groundY;
let cameraX = 0;
let worldWidth = 1400; // Mundo um pouco menor

// Animação
let frameCount = 0;

// Variáveis da tela de start
let startButtonHover = false;
let logoScale = 1;
let starField = [];

// ==== Pré-carregamento dos assets ====
function preload() {
  // IMAGENS PRINCIPAIS - ADICIONE MANUALMENTE:
  bgImg = loadImage('Assets/bg-ending.png');
  sonicImg = loadImage('Assets/sonic.gif');
  ringImg = loadImage('Assets/anel.gif');
  enemyImg = loadImage('Assets/inimigos.png');
  robImg = loadImage('Assets/robtinick.png');
  
  // IMAGENS ADICIONAIS SUGERIDAS - ADICIONE SE QUISER:
  // sonicIdleImg = loadImage('Assets/sonic-idle.png');
  // sonicRunImg = loadImage('Assets/sonic-run.gif');
  // sonicJumpImg = loadImage('Assets/sonic-jump.png');
  //enemy1Img = loadImage('Assets/ini-rasteja.png');
  //enemy2Img = loadImage('Assets/ini-voa.png');
  //enemy3Img = loadImage('Assets/ini.png');
  //groundImg = loadImage('Assets/chão.png');
  cloudImg = loadImage('Assets/nuvens.png');
  
  // SONS - ADICIONE SE QUISER:
  jumpSound = loadSound('Assets/jump.mp3');
  ringSound = loadSound('Assets/ring.mp3');
}

// ==== Setup Inicial ====
function setup() {
  createCanvas(800, 400);
  groundY = height - 50;
  
  // Criar campo de estrelas para a tela de start
  for (let i = 0; i < 100; i++) {
    starField.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speed: random(0.5, 2)
    });
  }

  // Não criar objetos ainda - só na hora de começar o jogo
}

// ==== Loop Principal ====
function draw() {
  frameCount++;
  
  if (gameState === "start") {
    drawStartScreen();
    return;
  } else if (gameState === "victory") {
    drawVictoryScreen();
    return;
  } else if (gameState === "gameOver") {
    drawGameOverScreen();
    return;
  }

  // Background
  drawAnimatedBackground();
  
  // Sistema de câmera
  push();
  translate(-cameraX, 0);
  
  drawGround();
  drawParallaxClouds();

  sonic.update();
  sonic.display();

  // Atualizar câmera para seguir o Sonic
  cameraX = lerp(cameraX, sonic.x - width/3, 0.03); // Câmera mais suave
  cameraX = constrain(cameraX, 0, worldWidth - width);

  // Renderizar objetos do mundo
  for (let i = rings.length - 1; i >= 0; i--) {
    rings[i].update();
    rings[i].display();
  }
  
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].move();
    enemies[i].display();
  }
  
  for (let i = chaosEmeralds.length - 1; i >= 0; i--) {
    chaosEmeralds[i].update();
    chaosEmeralds[i].display();
  }

  // Partículas
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }

  pop();

  // Verificar colisões
  checkRingCollision();
  checkEnemyCollision();
  checkEmeraldCollision();

  // Lógica do boss - mais fácil de atingir
  if (score >= 12 && !bossFight && !gameWon) { // Reduzido de 15 para 12
    bossFight = true;
    boss = new Boss();
    difficultyLevel = 2;
  }

  if (bossFight && boss) {
    push();
    translate(-cameraX, 0);
    boss.display();
    boss.move();
    boss.checkCollision(sonic);
    pop();
  }

  displayUI();
  
  // Spawnar mais objetos - menos frequente para facilitar
  if (frameCount % (240 - difficultyLevel * 40) === 0) { // Menos anéis
    spawnRandomRing();
  }
  if (frameCount % (360 - difficultyLevel * 60) === 0) { // Menos inimigos
    spawnRandomEnemy();
  }
}

// ==== Tela de Start ====
function drawStartScreen() {
  // Fundo espacial animado
  background(10, 5, 30);
  
  // Estrelas animadas
  for (let star of starField) {
    fill(255, 255, 255, random(150, 255));
    noStroke();
    ellipse(star.x, star.y, star.size);
    
    star.x -= star.speed;
    if (star.x < 0) {
      star.x = width;
      star.y = random(height);
    }
  }
  
  // Anéis flutuantes de fundo
  for (let i = 0; i < 8; i++) {
    push();
    translate(100 + i * 100, 200 + sin(frameCount * 0.02 + i) * 30);
    rotate(frameCount * 0.01);
    
    stroke(255, 215, 0, 100);
    strokeWeight(4);
    fill(255, 255, 0, 50);
    ellipse(0, 0, 40, 40);
    
    stroke(255, 255, 0, 150);
    strokeWeight(2);
    ellipse(0, 0, 25, 25);
    pop();
  }
  
  // Logo do Sonic (animado)
  push();
  translate(width/2, height/2 - 80);
  scale(logoScale);
  
  // Sombra do logo
  fill(0, 0, 0, 100);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("🦔 SONIC ADVENTURE 🦔", 3, 3);
  
  // Logo principal
  fill(0, 150, 255);
  stroke(255);
  strokeWeight(3);
  text("🦔 SONIC ADVENTURE 🦔", 0, 0);
  
  pop();
  
  // Animação do logo
  logoScale = 1 + sin(frameCount * 0.05) * 0.1;
  
  // Sonic correndo no fundo
  push();
  let sonicX = (frameCount * 3) % (width + 100) - 50;
  translate(sonicX, height - 80);
  
  // Sonic placeholder correndo
  if (sonicImg) {
    image(sonicImg, 0, 0, 40, 40);
  } else {
    fill(0, 100, 255);
    stroke(255);
    strokeWeight(2);
    ellipse(20, 20, 30, 30);
    
    // Rastro de velocidade
    for (let i = 1; i <= 5; i++) {
      fill(0, 100, 255, 255 - i * 40);
      ellipse(20 - i * 8, 20, 30 - i * 3, 30 - i * 3);
    }
  }
  pop();
  
  // Informações do jogo
  push();
  textAlign(CENTER, CENTER);
  fill(255, 255, 255, 200);
  textSize(16);
  text("Colete anéis 💍 • Evite inimigos 👹 • Derrote o Dr. Eggman 🤖", width/2, height/2 + 20);
  
  fill(255, 255, 0);
  textSize(14);
  text("Use as SETAS para mover e ESPAÇO para pular", width/2, height/2 + 50);
  pop();
  
  // Botão Start animado
  drawStartButton();
  
  // Controles
  push();
  textAlign(CENTER);
  fill(150, 150, 255);
  textSize(12);
  text("Pressione ENTER ou clique em START para começar", width/2, height - 30);
  pop();
}

function drawStartButton() {
  let buttonX = width/2 - 100;
  let buttonY = height/2 + 80;
  let buttonW = 200;
  let buttonH = 50;
  
  // Verificar hover
  startButtonHover = (mouseX > buttonX && mouseX < buttonX + buttonW && 
                      mouseY > buttonY && mouseY < buttonY + buttonH);
  
  // Efeito de brilho
  if (startButtonHover) {
    fill(255, 255, 0, 100);
    noStroke();
    rect(buttonX - 5, buttonY - 5, buttonW + 10, buttonH + 10, 15);
  }
  
  // Botão principal
  fill(startButtonHover ? color(0, 255, 100) : color(0, 200, 0));
  stroke(255);
  strokeWeight(3);
  rect(buttonX, buttonY, buttonW, buttonH, 10);
  
  // Borda interna
  stroke(0, 255, 0);
  strokeWeight(2);
  noFill();
  rect(buttonX + 5, buttonY + 5, buttonW - 10, buttonH - 10, 8);
  
  // Texto do botão
  push();
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(24);
  stroke(0);
  strokeWeight(2);
  
  // Efeito de pulso
  let pulseSize = startButtonHover ? 26 : 24;
  textSize(pulseSize + sin(frameCount * 0.1) * 2);
  
  text("🚀 START 🚀", buttonX + buttonW/2, buttonY + buttonH/2);
  pop();
}

// ==== Classes ====

class Sonic {
  constructor() {
    this.x = 100;
    this.y = groundY;
    this.width = 50;
    this.height = 50;
    this.ySpeed = 0;
    this.onGround = true;
    this.xSpeed = 0;
    this.direction = 1; // 1 = direita, -1 = esquerda
    this.animFrame = 0;
    this.invulnerable = 0;
    this.state = "idle"; // "idle", "running", "jumping"
  }

  update() {
    this.x += this.xSpeed;
    this.animFrame += abs(this.xSpeed) * 0.3;

    // Determinar estado de animação
    if (!this.onGround) {
      this.state = "jumping";
    } else if (abs(this.xSpeed) > 0.1) {
      this.state = "running";
    } else {
      this.state = "idle";
    }

    // Gravidade mais suave
    this.ySpeed += 0.6; // Reduzido de 0.8
    this.y += this.ySpeed;

    // Chão
    if (this.y >= groundY) {
      this.y = groundY;
      this.ySpeed = 0;
      this.onGround = true;
      
      // Partículas ao pousar
      if (this.ySpeed > 5) {
        for (let i = 0; i < 3; i++) { // Menos partículas
          particles.push(new Particle(this.x + this.width/2, this.y, color(139, 69, 19)));
        }
      }
    }

    // Limites do mundo
    this.x = constrain(this.x, 0, worldWidth - this.width);
    
    if (this.invulnerable > 0) this.invulnerable--;
  }

  display() {
    push();
    translate(this.x + this.width/2, this.y - this.height/2);
    
    // Piscar quando invulnerável
    if (this.invulnerable > 0 && frameCount % 10 < 5) {
      tint(255, 100);
    }
    
    // Virar o Sonic baseado na direção
    scale(this.direction, 1);
    
    // ESPAÇO RESERVADO PARA IMAGEM DO SONIC
    if (sonicImg) {
      // Usar imagem principal do Sonic
      image(sonicImg, -this.width/2, -this.height/2, this.width, this.height);
    } else if (sonicRunImg && this.state === "running") {
      // Usar sprite de corrida se disponível
      image(sonicRunImg, -this.width/2, -this.height/2, this.width, this.height);
    } else if (sonicJumpImg && this.state === "jumping") {
      // Usar sprite de salto se disponível
      image(sonicJumpImg, -this.width/2, -this.height/2, this.width, this.height);
    } else if (sonicIdleImg && this.state === "idle") {
      // Usar sprite idle se disponível
      image(sonicIdleImg, -this.width/2, -this.height/2, this.width, this.height);
    } else {
      // PLACEHOLDER - Será substituído pela sua imagem
      fill(0, 100, 255);
      stroke(255);
      strokeWeight(2);
      ellipse(0, 0, this.width, this.height * 0.8);
      
      // Indicador de direção (remover quando adicionar imagem)
      fill(255, 255, 0);
      triangle(15, 0, 5, -8, 5, 8);
    }
    
    pop();
  }

  jump() {
    if (this.onGround) {
      this.ySpeed = -13; // Pulo um pouco menor
      this.onGround = false;
      if (jumpSound) jumpSound.play();
      
      // Partículas de salto
      for (let i = 0; i < 5; i++) { // Menos partículas
        particles.push(new Particle(this.x + this.width/2, this.y, color(100, 200, 255)));
      }
    }
  }

  move(dir) {
    this.xSpeed = dir * (5 + difficultyLevel * 0.5); // Velocidade reduzida
    this.direction = dir;
  }

  stop() {
    this.xSpeed *= 0.8; // Deslizamento gradual
    if (abs(this.xSpeed) < 0.1) this.xSpeed = 0;
  }
  
  takeDamage() {
    if (this.invulnerable <= 0) {
      lives--;
      this.invulnerable = 180; // 3 segundos de invulnerabilidade (era 120)
      this.x -= 30; // Empurrar menos para trás
      
      // Partículas de dano
      for (let i = 0; i < 10; i++) { // Menos partículas
        particles.push(new Particle(this.x + this.width/2, this.y - this.height/2, color(255, 0, 0)));
      }
      
      if (lives <= 0) {
        gameState = "gameOver";
      }
    }
  }
}

class Ring {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 35; // Um pouco maior para ser mais fácil
    this.rotation = 0;
    this.bobOffset = random(TWO_PI);
    this.collected = false;
    this.originalY = y;
  }

  update() {
    this.rotation += 0.08; // Rotação mais lenta
    this.y = this.originalY + sin(frameCount * 0.04 + this.bobOffset) * 6;
  }

  display() {
    if (this.collected) return;
    
    push();
    translate(this.x + this.size/2, this.y + this.size/2);
    rotate(this.rotation);
    
    // ESPAÇO RESERVADO PARA IMAGEM DO ANEL
    if (ringImg) {
      image(ringImg, -this.size/2, -this.size/2, this.size, this.size);
    } else {
      // PLACEHOLDER - Será substituído pela sua imagem
      strokeWeight(4);
      stroke(255, 215, 0);
      fill(255, 255, 0, 150);
      ellipse(0, 0, this.size, this.size);
      
      strokeWeight(2);
      stroke(255, 255, 0);
      fill(255, 215, 0, 100);
      ellipse(0, 0, this.size * 0.6, this.size * 0.6);
    }
    
    pop();
  }
}

class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 40;
    this.direction = random([-1, 1]);
    this.speed = 0.8 + difficultyLevel * 0.3; // Velocidade bem reduzida
    this.animFrame = 0;
    this.type = random(["crawler", "jumper"]) // Removido "shooter" para facilitar
    this.jumpTimer = 0;
    this.health = 1;
    this.originalY = y;
  }

  move() {
    this.animFrame += 0.08;
    
    if (this.type === "crawler") {
      this.x += this.direction * this.speed;
      if (this.x > worldWidth - 50 || this.x < 50) {
        this.direction *= -1;
      }
    } else if (this.type === "jumper") {
      this.x += this.direction * this.speed * 0.6;
      this.jumpTimer++;
      if (this.jumpTimer > 120) { // Pulos menos frequentes
        this.y = this.originalY - 25; // Pulos menores
        this.jumpTimer = 0;
        setTimeout(() => { this.y = this.originalY; }, 600);
      }
      if (this.x > worldWidth - 50 || this.x < 50) {
        this.direction *= -1;
      }
    }
  }

  display() {
    push();
    translate(this.x + this.size/2, this.y - this.size/2);
    
    // Virar inimigo baseado na direção
    scale(this.direction, 1);
    
    // ESPAÇO RESERVADO PARA IMAGENS DOS INIMIGOS
    if (this.type === "crawler" && enemy1Img) {
      image(enemy1Img, -this.size/2, -this.size/2, this.size, this.size);
    } else if (this.type === "jumper" && enemy2Img) {
      image(enemy2Img, -this.size/2, -this.size/2, this.size, this.size);
    } else if (enemyImg) {
      // Usar imagem genérica de inimigo
      image(enemyImg, -this.size/2, -this.size/2, this.size, this.size);
    } else {
      // PLACEHOLDER - Será substituído pelas suas imagens
      if (this.type === "crawler") {
        fill(255, 0, 0);
        stroke(150, 0, 0);
        strokeWeight(2);
        rect(-this.size/2, -this.size/2, this.size, this.size);
        
        // Indicador de tipo (remover quando adicionar imagem)
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(8);
        text("C", 0, 0);
      } else if (this.type === "jumper") {
        fill(255, 100, 0);
        stroke(200, 50, 0);
        strokeWeight(2);
        ellipse(0, 0, this.size, this.size);
        
        // Indicador de tipo (remover quando adicionar imagem)
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(8);
        text("J", 0, 0);
      }
    }
    
    pop();
  }
}

class ChaosEmerald {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 30; // Um pouco maior
    this.rotation = 0;
    this.color = random([
      color(255, 0, 0),    // Vermelho
      color(0, 255, 0),    // Verde
      color(0, 0, 255),    // Azul
      color(255, 255, 0),  // Amarelo
      color(255, 0, 255),  // Magenta
      color(0, 255, 255),  // Ciano
      color(255, 255, 255) // Branco
    ]);
    this.bobOffset = random(TWO_PI);
    this.originalY = y;
  }

  update() {
    this.rotation += 0.03; // Rotação mais lenta
    this.y = this.originalY + sin(frameCount * 0.025 + this.bobOffset) * 10;
  }

  display() {
    push();
    translate(this.x + this.size/2, this.y);
    rotate(this.rotation);
    
    // ESPAÇO RESERVADO PARA IMAGEM DA CHAOS EMERALD
    fill(this.color);
    stroke(255);
    strokeWeight(2);
    
    // Formato de diamante
    beginShape();
    vertex(0, -this.size);
    vertex(this.size * 0.7, -this.size * 0.3);
    vertex(this.size * 0.7, this.size * 0.3);
    vertex(0, this.size);
    vertex(-this.size * 0.7, this.size * 0.3);
    vertex(-this.size * 0.7, -this.size * 0.3);
    endShape(CLOSE);
    
    // Brilho interno
    fill(255, 255, 255, 150);
    noStroke();
    triangle(-5, -10, 5, -10, 0, 0);
    
    pop();
  }
}

class Boss {
  constructor() {
    this.x = worldWidth - 200;
    this.y = groundY;
    this.size = 80;
    this.health = 3; // Reduzido de 5 para 3
    this.maxHealth = 3;
    this.direction = -1;
    this.attackTimer = 0;
    this.phase = 1;
    this.animFrame = 0;
  }

  display() {
    this.animFrame += 0.08;
    
    push();
    translate(this.x + this.size/2, this.y - this.size/2);
    
    // Virar boss baseado na direção
    scale(this.direction, 1);
    
    // ESPAÇO RESERVADO PARA IMAGEM DO BOSS (DR. EGGMAN)
    if (robImg) {
      image(robImg, -this.size/2, -this.size/2, this.size, this.size);
    } else {
      // PLACEHOLDER - Será substituído pela sua imagem
      // Corpo principal do Eggman
      fill(255, 100, 100);
      stroke(200, 50, 50);
      strokeWeight(3);
      ellipse(0, 0, this.size, this.size * 0.8);
      
      // Indicador de boss (remover quando adicionar imagem)
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(12);
      text("BOSS", 0, 0);
    }
    
    // Indicador de vida (manter sempre)
    let healthWidth = 60;
    let healthHeight = 8;
    fill(255, 0, 0);
    noStroke();
    rect(-healthWidth/2, -this.size * 0.7, healthWidth, healthHeight);
    fill(0, 255, 0);
    rect(-healthWidth/2, -this.size * 0.7, healthWidth * (this.health / this.maxHealth), healthHeight);
    
    pop();
  }

  move() {
    // Movimento mais lento e previsível
    this.x += this.direction * 1; // Bem mais lento
    if (this.x < worldWidth * 0.7 || this.x > worldWidth - this.size) {
      this.direction *= -1;
    }
    
    this.attackTimer++;
    
    // Ataques menos frequentes
    if (this.attackTimer > 180) { // Era 120, agora 180
      this.attack();
      this.attackTimer = 0;
    }
  }
  
  attack() {
    // Apenas um projétil por vez para facilitar
    particles.push(new Particle(this.x, this.y - 40, color(255, 0, 0), "projectile"));
  }

  checkCollision(player) {
    let distance = dist(player.x + player.width/2, player.y - player.height/2, 
                       this.x + this.size/2, this.y - this.size/2);
    
    if (distance < 65) { // Área maior para acertar
      if (player.ySpeed > 3 && player.y < this.y - 15) { // Mais fácil acertar de cima
        // Sonic atacou de cima
        this.health--;
        player.ySpeed = -8; // Bounce
        
        // Partículas de impacto
        for (let i = 0; i < 15; i++) {
          particles.push(new Particle(this.x + this.size/2, this.y - this.size/2, color(255, 255, 0)));
        }
        
        if (this.health <= 0) {
          gameState = "victory";
          gameWon = true;
        }
      } else {
        // Sonic foi atingido
        player.takeDamage();
      }
    }
  }
}

class Particle {
  constructor(x, y, col, type = "normal") {
    this.x = x;
    this.y = y;
    this.vx = random(-4, 4); // Velocidade reduzida
    this.vy = random(-6, -1);
    this.color = col;
    this.life = 60;
    this.maxLife = 60;
    this.type = type;
    
    if (type === "projectile") {
      this.vx = sonic.x > this.x ? 2 : -2; // Projéteis mais lentos
      this.vy = -1;
      this.life = 240; // Vivem mais tempo
      this.maxLife = 240;
    }
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    
    if (this.type === "normal") {
      this.vy += 0.15; // Gravidade mais leve
    }
    
    this.life--;
    
    // Colisão de projétil com Sonic
    if (this.type === "projectile") {
      let distance = dist(this.x, this.y, sonic.x + sonic.width/2, sonic.y - sonic.height/2);
      if (distance < 35) { // Área maior para evitar
        sonic.takeDamage();
        this.life = 0;
      }
    }
  }
  
  display() {
    let alpha = map(this.life, 0, this.maxLife, 0, 255);
    let size = map(this.life, 0, this.maxLife, 2, 6);
    
    fill(red(this.color), green(this.color), blue(this.color), alpha);
    noStroke();
    
    if (this.type === "projectile") {
      fill(255, 0, 0, alpha);
      ellipse(this.x, this.y, 8, 8); // Projéteis menores
    } else {
      ellipse(this.x, this.y, size, size);
    }
  }
  
  isDead() {
    return this.life <= 0;
  }
}

// ==== Funções de Interface ====

function drawVictoryScreen() {
  // ESPAÇO RESERVADO PARA IMAGEM DE FUNDO DE VITÓRIA
  if (bgImg) {
    image(bgImg, 0, 0, width, height);
  } else {
    // Fundo dourado animado
    for (let i = 0; i < height; i++) {
      let r = map(i, 0, height, 255, 255);
      let g = map(i, 0, height, 215, 140);
      let b = map(i, 0, height, 0, 0);
      stroke(r, g, b);
      line(0, i, width, i);
    }
  }
  
  // Partículas de celebração
  if (frameCount % 15 === 0) {
    for (let i = 0; i < 3; i++) {
      particles.push(new Particle(random(width), 0, color(random(255), random(255), random(255))));
    }
  }
  
  for (let particle of particles) {
    particle.update();
    particle.display();
  }
  
  // Texto de vitória
  push();
  textAlign(CENTER, CENTER);
  
  // Título principal
  textSize(48);
  fill(255, 255, 0);
  stroke(0);
  strokeWeight(3);
  text("🏆 VITÓRIA! 🏆", width/2, height/2 - 80);
  
  textSize(24);
  fill(255);
  stroke(0);
  strokeWeight(2);
  text("Parabéns! Você derrotou o Dr. Eggman!", width/2, height/2 - 30);
  text(`Pontuação Final: ${score}`, width/2, height/2 + 10);
  
  // Instruções
  textSize(18);
  fill(200, 200, 255);
  stroke(0);
  strokeWeight(1);
  text("Pressione R para jogar novamente", width/2, height/2 + 60);
  text("Pressione ESC para voltar ao menu", width/2, height/2 + 90);
  
  pop();
}

function drawGameOverScreen() {
  // Fundo vermelho escuro
  background(50, 0, 0);
  
  push();
  textAlign(CENTER, CENTER);
  
  textSize(48);
  fill(255, 0, 0);
  stroke(255);
  strokeWeight(2);
  text("💀 GAME OVER 💀", width/2, height/2 - 40);
  
  textSize(20);
  fill(255);
  noStroke();
  text(`Pontuação: ${score}`, width/2, height/2 + 20);
  text("Pressione R para tentar novamente", width/2, height/2 + 60);
  text("Pressione ESC para voltar ao menu", width/2, height/2 + 90);
  
  pop();
}

function drawAnimatedBackground() {
  // ESPAÇO RESERVADO PARA IMAGEM DE FUNDO
  if (bgImg) {
    // Usar imagem de fundo se disponível
    image(bgImg, 0, 0, width, height);
  } else {
    // Gradiente animado do céu (placeholder)
    for (let i = 0; i <= height; i++) {
      let inter = map(i, 0, height, 0, 1);
      let c1 = color(135, 206, 250 + sin(frameCount * 0.008) * 15); // Mais suave
      let c2 = color(255, 200, 100 + sin(frameCount * 0.008) * 20);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(0, i, width, i);
    }
  }
}

function drawParallaxClouds() {
  // ESPAÇO RESERVADO PARA IMAGEM DE NUVENS
  if (cloudImg) {
    // Usar imagem de nuvem se disponível
    for (let i = 0; i < 4; i++) { // Menos nuvens
      let x = (i * 250 - cameraX * 0.2 + frameCount * 0.15) % (worldWidth + 100);
      let y = 40 + sin(i + frameCount * 0.008) * 8;
      image(cloudImg, x, y, 120, 70);
    }
  } else {
    // Nuvens em movimento (placeholder)
    fill(255, 255, 255, 120);
    noStroke();
    
    for (let i = 0; i < 4; i++) { // Menos nuvens
      let x = (i * 250 - cameraX * 0.2 + frameCount * 0.15) % (worldWidth + 100);
      let y = 40 + sin(i + frameCount * 0.008) * 8;
      
      ellipse(x, y, 70, 45);
      ellipse(x + 35, y, 90, 55);
      ellipse(x + 70, y, 70, 45);
    }
  }
}

// ==== Funções Auxiliares ====

function drawGround() {
  // ESPAÇO RESERVADO PARA IMAGEM DO CHÃO
  if (groundImg) {
    // Repetir textura do chão
    for (let x = 0; x < worldWidth; x += groundImg.width) {
      image(groundImg, x, groundY + 20, groundImg.width, height - groundY);
    }
  } else {
    // Chão com textura (placeholder)
    fill(34, 139, 34);
    rect(0, groundY + 20, worldWidth, height - groundY);
    
    // Grama mais espaçada
    stroke(0, 100, 0);
    strokeWeight(1);
    for (let x = 0; x < worldWidth; x += 15) {
      line(x, groundY + 20, x + random(-2, 2), groundY + 12 + random(4));
    }
  }
}

function spawnRings() {
  // Mais anéis espalhados pelo mundo - mais fácil
  for (let i = 120; i < worldWidth - 100; i += 60 + random(-15, 15)) { // Mais próximos
    rings.push(new Ring(i, groundY - 20 - random(0, 30)));
  }
  
  // Anéis em formações especiais
  for (let i = 250; i < worldWidth - 250; i += 350) {
    // Linha de anéis
    for (let j = 0; j < 4; j++) {
      let x = i + j * 25;
      let y = groundY - 50;
      rings.push(new Ring(x, y));
    }
  }
}

function spawnEnemies() {
  // Menos inimigos e mais espaçados
  for (let i = 350; i < worldWidth - 150; i += 250 + random(-40, 40)) { // Mais espaçados
    enemies.push(new Enemy(i, groundY));
  }
  
  // Poucos inimigos elevados
  for (let i = 500; i < worldWidth - 300; i += 400) {
    enemies.push(new Enemy(i, groundY - 40));
  }
}

function spawnChaosEmerald() {
  // Menos emeralds, mais fáceis de pegar
  for (let i = 0; i < 3; i++) {
    let x = 300 + i * (worldWidth - 600) / 3;
    let y = groundY - 20 - random(10, 40);
    chaosEmeralds.push(new ChaosEmerald(x, y));
  }
}

function spawnRandomRing() {
  if (rings.length < 12) { // Menos anéis simultâneos
    let x = sonic.x + random(150, 400);
    if (x < worldWidth - 80) {
      rings.push(new Ring(x, groundY - random(20, 60)));
    }
  }
}

function spawnRandomEnemy() {
  if (enemies.length < 5) { // Menos inimigos simultâneos
    let x = sonic.x + random(400, 600); // Mais longe do sonic
    if (x < worldWidth - 80) {
      enemies.push(new Enemy(x, groundY));
    }
  }
}

function checkRingCollision() {
  for (let i = rings.length - 1; i >= 0; i--) {
    let ring = rings[i];
    if (!ring.collected && dist(sonic.x + sonic.width/2, sonic.y - sonic.height/2, 
                               ring.x + ring.size/2, ring.y + ring.size/2) < 35) { // Área maior
      ring.collected = true;
      score++;
      if (ringSound) ringSound.play();
      
      // Partículas de coleta
      for (let j = 0; j < 8; j++) {
        particles.push(new Particle(ring.x + ring.size/2, ring.y + ring.size/2, 
                                  color(255, 215, 0)));
      }
      
      rings.splice(i, 1);
    }
  }
}

function checkEnemyCollision() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    let enemy = enemies[i];
    let distance = dist(sonic.x + sonic.width/2, sonic.y - sonic.height/2,
                       enemy.x + enemy.size/2, enemy.y - enemy.size/2);
    
    if (distance < 38) { // Área um pouco maior
      // Verificar se Sonic está atacando de cima
      if (sonic.ySpeed > 2 && sonic.y < enemy.y - 15) { // Mais fácil atacar
        // Sonic destruiu o inimigo
        score += 2;
        sonic.ySpeed = -6; // Bounce menor
        
        // Partículas de destruição
        for (let j = 0; j < 10; j++) {
          particles.push(new Particle(enemy.x + enemy.size/2, enemy.y - enemy.size/2, 
                                    color(255, 100, 0)));
        }
        
        enemies.splice(i, 1);
      } else {
        // Sonic foi atingido
        sonic.takeDamage();
      }
    }
  }
}

function checkEmeraldCollision() {
  for (let i = chaosEmeralds.length - 1; i >= 0; i--) {
    let emerald = chaosEmeralds[i];
    if (dist(sonic.x + sonic.width/2, sonic.y - sonic.height/2,
            emerald.x + emerald.size/2, emerald.y) < 45) { // Área maior
      score += 5;
      
      // Efeito especial para emerald
      for (let j = 0; j < 15; j++) {
        particles.push(new Particle(emerald.x + emerald.size/2, emerald.y, emerald.color));
      }
      
      chaosEmeralds.splice(i, 1);
    }
  }
}

function displayUI() {
  // Painel de HUD moderno
  fill(0, 0, 0, 130);
  rect(10, 10, 250, 80, 10);
  
  fill(255);
  textSize(16);
  textAlign(LEFT);
  text(`💍 Anéis: ${score}`, 20, 30);
  text(`❤️ Vidas: ${lives}`, 20, 50);
  text(`⚡ Nível: ${difficultyLevel}`, 20, 70);
  
  if (bossFight && boss) {
    fill(0, 0, 0, 130);
    rect(width - 160, 10, 150, 50, 10);
    fill(255, 0, 0);
    textAlign(RIGHT);
    text(`👿 Eggman HP: ${boss.health}`, width - 20, 30);
    
    // Barra de vida do boss
    fill(255, 0, 0);
    rect(width - 150, 40, 130, 10);
    fill(0, 255, 0);
    rect(width - 150, 40, 130 * (boss.health / boss.maxHealth), 10);
  }
  
  // Indicador de progresso
  fill(0, 0, 0, 130);
  rect(10, height - 30, width - 20, 20, 10);
  fill(0, 255, 0);
  rect(15, height - 25, (width - 30) * (sonic.x / worldWidth), 10, 5);
  
  fill(255);
  textAlign(CENTER);
  textSize(12);
  text("PROGRESSO", width/2, height - 15);
}

function startGame() {
  score = 0;
  lives = 3;
  difficultyLevel = 1;
  rings = [];
  enemies = [];
  chaosEmeralds = [];
  particles = [];
  bossFight = false;
  gameWon = false;
  gameState = "playing";
  cameraX = 0;
  frameCount = 0;
  
  sonic = new Sonic();
  spawnRings();
  spawnEnemies();
  spawnChaosEmerald();
}

function resetGame() {
  gameState = "start";
  particles = [];
  
  // Recriar campo de estrelas
  starField = [];
  for (let i = 0; i < 100; i++) {
    starField.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      speed: random(0.5, 2)
    });
  }
}

// ==== Controles ====
function keyPressed() {
  if (gameState === "start") {
    if (keyCode === ENTER) {
      startGame();
    }
  } else if (gameState === "playing") {
    if (key === ' ' || keyCode === UP_ARROW) {
      sonic.jump();
    }
    if (keyCode === RIGHT_ARROW) {
      sonic.move(1);
    }
    if (keyCode === LEFT_ARROW) {
      sonic.move(-1);
    }
  }
  
  // Reiniciar jogo
  if ((key === 'R' || key === 'r') && (gameState === "victory" || gameState === "gameOver")) {
    startGame();
  }
  
  // Voltar ao menu
  if (keyCode === ESCAPE && (gameState === "victory" || gameState === "gameOver")) {
    resetGame();
  }
}

function keyReleased() {
  if (gameState === "playing") {
    if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) {
      sonic.stop();
    }
  }
}

// Controles de mouse para o botão Start
function mousePressed() {
  if (gameState === "start") {
    let buttonX = width/2 - 100;
    let buttonY = height/2 + 80;
    let buttonW = 200;
    let buttonH = 50;
    
    if (mouseX > buttonX && mouseX < buttonX + buttonW && 
        mouseY > buttonY && mouseY < buttonY + buttonH) {
      startGame();
    }
  }
}

// Controles adicionais para mobile/touch
function touchStarted() {
  if (gameState === "start") {
    // Qualquer toque na tela de start inicia o jogo
    startGame();
  } else if (gameState === "playing") {
    if (touches.length > 0) {
      let touch = touches[0];
      if (touch.y < height/2) {
        sonic.jump(); // Toque na parte superior = pular
      } else if (touch.x < width/2) {
        sonic.move(-1); // Lado esquerdo = mover esquerda
      } else {
        sonic.move(1); // Lado direito = mover direita
      }
    }
  } else if (gameState === "victory" || gameState === "gameOver") {
    startGame(); // Tocar para reiniciar
  }
  
  // Prevenir comportamento padrão
  return false;
}

function touchEnded() {
  if (gameState === "playing") {
    sonic.stop();
  }
  return false;
}

// ==== INSTRUÇÕES PARA ADICIONAR IMAGENS ====
/*
COMO ADICIONAR SUAS IMAGENS:

1. IMAGENS OBRIGATÓRIAS (descomente e adicione os caminhos):
   - bgImg = loadImage('Assets/bg-ending.png');        // Fundo do jogo
   - sonicImg = loadImage('Assets/sonic.gif');         // Sonic principal
   - ringImg = loadImage('Assets/anel.gif');          // Anéis coletáveis
   - enemyImg = loadImage('Assets/inimigos.png');     // Inimigos genéricos
   - robImg = loadImage('Assets/robtinick.png');      // Dr. Eggman/Boss

2. IMAGENS OPCIONAIS (para melhor animação):
   - sonicIdleImg = loadImage('Assets/sonic-idle.png');    // Sonic parado
   - sonicRunImg = loadImage('Assets/sonic-run.gif');      // Sonic correndo
   - sonicJumpImg = loadImage('Assets/sonic-jump.png');    // Sonic pulando
   - enemy1Img = loadImage('Assets/enemy-crawler.png');    // Inimigo tipo crawler
   - enemy2Img = loadImage('Assets/enemy-jumper.png');     // Inimigo tipo jumper
   - groundImg = loadImage('Assets/ground-texture.png');   // Textura do chão
   - cloudImg = loadImage('Assets/cloud.png');             // Nuvens

3. SONS OPCIONAIS:
   - jumpSound = loadSound('Assets/jump.wav');         // Som do pulo
   - ringSound = loadSound('Assets/ring.wav');         // Som do anel

LOCALIZAÇÃO: Adicione essas linhas na função preload() removendo os comentários //

MUDANÇAS NA DIFICULDADE:
✅ Gravidade mais suave (0.6 em vez de 0.8)
✅ Pulo menor (-13 em vez de -15)
✅ Velocidade do Sonic reduzida
✅ Inimigos mais lentos e espaçados
✅ Boss com 3 HP em vez de 5
✅ Projéteis mais lentos e menos frequentes
✅ Áreas de colisão maiores para facilitar
✅ Invulnerabilidade maior (3 segundos)
✅ Removido inimigo "shooter" (mais difícil)
✅ Menos objetos simultâneos na tela
✅ Boss ativa com 12 anéis em vez de 15

CONTROLES DA TELA DE START:
✅ ENTER ou clique no botão START para começar
✅ Toque na tela (mobile) para começar
✅ Animações e efeitos visuais legais
✅ Campo de estrelas animado
✅ Sonic correndo no fundo
✅ Botão com hover effect

O jogo agora está bem mais fácil e amigável para iniciantes! 🎮
*/