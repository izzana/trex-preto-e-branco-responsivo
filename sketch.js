var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
 
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50, height - 80, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200, height - 50, 400, 20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(width/2, height/2);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width / 2, height / 2 + 50);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false
  restart.visible = false
  
  invisibleGround = createSprite(200, height - 40, 400, 10);
  invisibleGround.visible = false;
  
  //criar grupos de obstáculos e nuvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  score = 0;
}

function draw() {
  background(180);
  //exibindo pontuação
  text("Pontuação: " + score, width - 100, 50);
  
  
  
  if(gameState === PLAY){
    //mover o solo
    ground.velocityX = -(6 + (3 * score) / 100)
    //pontuação
    score = score + Math.round(frameCount/60);

    
    //pular 
    if ((touches.length > 0 || keyDown('space')) && trex.y >= height - 90) {
      trex.velocityY = -12
    }  

    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    //adicionar gravidade
    trex.velocityY = trex.velocityY + 0.8
  
    //gerar as nuvens
    spawnClouds();
  
    //gerar obstáculos no chão
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    ground.velocityX = 0;

    gameOver.visible = true;
    restart.visible = true;

    ground.velocityX = 0;
    trex.velocityY = 0

    //mudar a animação do trex
    trex.changeAnimation("collided", trex_collided);

    //definir tempo de vida aos objetos do jogo para que nunca sejam destruídos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    if (touches.length > 0 || mousePressedOver(restart)) {
      reset()
      touches = []
    }
  }
  
  //impedir que o trex caia
  trex.collide(invisibleGround);
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600, height - 65, 10, 40);
   obstacle.velocityX = -(6 + (3 * score) / 100)
   
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribua dimensão e tempo de vida aos obstáculos              
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //adicione cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
   if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(100, height - 100));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //atribua tempo de vida à variável
    cloud.lifetime = 200;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionando nuvens ao grupo
   cloudsGroup.add(cloud);
    }
}

function reset() {
  gameState = PLAY
  gameOver.visible = false
  restart.visible = false

  obstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()

  trex.changeAnimation('running', trex_running)

  score = 0
}

