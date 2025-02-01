const config = {
  renderer: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload,
    create,
    update,
  },
  }


const game = new Phaser.Game(config);
let isGameStarted = false;
let bird;
let hasLanded = false;
let hasBumped = false;
let cursors;
let messageToPlayer;
let topColumn1;
let bottomColumn1;
let topColumn2;
let bottomColumn2;
let topColumn3;
let bottomColumn3;
let topColumn4;
let bottomColumn4;
let topColumn5;
let bottomColumn5;
let roads;
let background;
let line1;
let line2;
let line3;
let line4;
let line5;
let line6;

const VELOCITY_X = 15;
const VELOCITY_Y = -150;
const COLUMN_VELOCITY_X = -70;
const STOP_POSITION_X = 350;

function preload() {
  this.load.image('background', 'assets/background.png');
  this.load.image('road', 'assets/road.png');
  this.load.image('line', 'assets/line.png');
  this.load.image('column', 'assets/column.png');
  this.load.spritesheet('bird', 'assets/bird.png', { frameWidth: 64, frameHeight: 96 });
}

function create() {
  createBackground.call(this);
  createRoad.call(this);
  createColumns.call(this);
  createLines.call(this)
  createBird.call(this);
  createControls.call(this);
  createMessage.call(this);
}



function createBackground() {
  background = this.add.image(0, 0, 'background').setOrigin(0, 0).setDepth(0);
  background.displayWidth = window.innerWidth;
  background.displayHeight = window.innerHeight - 120;
}

function createRoad() {
  roads = this.physics.add.staticGroup();
  roads.create(window.innerWidth / 2, window.innerHeight - 90, 'road').setScale(2).refreshBody().setDepth(3);
  }

function  createLines() {
  line1 = this.physics.add.group({
    key: 'line',
    repeat: 0,
    setXY: { x: 250, y: window.innerHeight - 90, stepX: 350 },
  });

  line2 = this.physics.add.group({
    key: 'line',
    repeat: 0,
    setXY: { x: 600, y: window.innerHeight - 90, stepX: 350},
  });

  line3 = this.physics.add.group({
    key: 'line',
    repeat: 0,
    setXY: { x: 950, y: window.innerHeight - 90, stepX: 350},
  });

  line4 = this.physics.add.group({
    key: 'line',
    repeat: 0,
    setXY: { x: 1300, y: window.innerHeight - 90, stepX: 350},
  });

  line5 = this.physics.add.group({
    key: 'line',
    repeat: 0,
    setXY: { x: 1650, y: window.innerHeight - 90, stepX: 350},
  });

  line6 = this.physics.add.group({
    key: 'line',
    repeat: 0,
    setXY: { x: 1950, y: window.innerHeight - 90, stepX: 350},
  });

  line1.children.iterate((line) => {
    line.setScale(0.1,0.02);
    line.body.allowGravity = false;
    line.setVelocityX(0);
    line.setDepth(4);
  });

  line2.children.iterate((line) => {
    line.setScale(0.1,0.02);
    line.body.allowGravity = false;
    line.setVelocityX(0);
    line.setDepth(4);
  });

  line3.children.iterate((line) => {
    line.setScale(0.1,0.02);
    line.body.allowGravity = false;
    line.setVelocityX(0);
    line.setDepth(4);
  });

  line4.children.iterate((line) => {
    line.setScale(0.1,0.02);
    line.body.allowGravity = false;
    line.setVelocityX(0);
    line.setDepth(4);
  });

  line5.children.iterate((line) => {
    line.setScale(0.1,0.02);
    line.body.allowGravity = false;
    line.setVelocityX(0);
    line.setDepth(4);
  });

  line6.children.iterate((line) => {
    line.setScale(0.1,0.02);
    line.body.allowGravity = false;
    line.setVelocityX(0);
    line.setDepth(4);
  });
}

function createColumns() {
  topColumn1 = this.physics.add.group({
    key: 'column',
    repeat: 0,
    setXY: { x: 300, y: Phaser.Math.Between(0, 50), stepX: 150 },
  });

  bottomColumn1 = this.physics.add.group({
    key: 'column',
    repeat: 0,
    setXY: { x: 450, y: Phaser.Math.Between(450, 700), stepX: 150 },
  });

  topColumn2 = this.physics.add.group({
    key: 'column',
    repeat: 0,
    setXY: { x: 600, y: Phaser.Math.Between(0, 50), stepX: 150 },
  });

  bottomColumn2 = this.physics.add.group({
    key: 'column',
    repeat: 0,
    setXY: { x: 750, y: Phaser.Math.Between(450, 700), stepX: 150 },
  });

  topColumn3 = this.physics.add.group({
    key: 'column',
    repeat: 0,
    setXY: { x: 900, y: Phaser.Math.Between(0, 50), stepX: 150 },
  });

  bottomColumn3 = this.physics.add.group({
    key: 'column',
    repeat: 0,
    setXY: { x: 1050, y: Phaser.Math.Between(450, 700), stepX: 150 },
  });

  topColumn4 = this.physics.add.group({
    key: 'column',
    repeat: 0,
    setXY: { x: 1200, y: Phaser.Math.Between(0, 50), stepX: 150 },
  });

  bottomColumn4 = this.physics.add.group({
    key: 'column',
    repeat: 0,
    setXY: { x: 1350, y: Phaser.Math.Between(450, 700), stepX: 150 },
  });

  topColumn5 = this.physics.add.group({
    key: 'column',
    repeat: 0,
    setXY: { x: 1500, y: Phaser.Math.Between(0, 50), stepX: 150 },
  });

  bottomColumn5 = this.physics.add.group({
    key: 'column',
    repeat: 0,
    setXY: { x: 1650, y: Phaser.Math.Between(450, 700), stepX: 150 },
  });

  topColumn1.children.iterate((column) => {
    column.body.setAllowGravity(false);
    column.setVelocityX(0); 
    column.setDepth(2);
  });

  bottomColumn1.children.iterate((column) => {
    column.body.setAllowGravity(false);
    column.setVelocityX(0);
    column.setDepth(2);
  });

  topColumn2.children.iterate((column) => { 
    column.body.setAllowGravity(false);
    column.setVelocityX(0);
    column.setVelocityY(0);
    column.setDepth(2);
  });

  bottomColumn2.children.iterate((column) => {
    column.body.setAllowGravity(false);
    column.setVelocityX(0);
    column.setDepth(2);
  });

  topColumn3.children.iterate((column) => {
    column.body.setAllowGravity(false);
    column.setVelocityX(0);
    column.setDepth(2);
  });

  bottomColumn3.children.iterate((column) => {  
    column.body.setAllowGravity(false);
    column.setVelocityX(0);
    column.setDepth(2);
  });

  topColumn4.children.iterate((column) => { 
    column.body.setAllowGravity(false);
    column.setVelocityX(0);
    column.setDepth(2);
  });

  bottomColumn4.children.iterate((column) => {
    column.body.setAllowGravity(false);
    column.setVelocityX(0);
    column.setDepth(2);
  });

  topColumn5.children.iterate((column) => {
    column.body.setAllowGravity(false);
    column.setVelocityX(0);
    column.setDepth(2);
  });

  bottomColumn5.children.iterate((column) => {
    column.body.setAllowGravity(false);
    column.setVelocityX(0);
    column.setDepth(2);
  });

}

function createBird() {
  bird = this.physics.add.sprite(100, 100, 'bird').setScale(2);
  bird.setBounce(0.2);
  bird.setCollideWorldBounds(true);

  this.physics.add.overlap(bird, roads, () => (hasLanded = true), null, this);
  this.physics.add.collider(bird, roads);
  bird.setDepth(4);
}

function createControls() {
  cursors = this.input.keyboard.createCursorKeys();
  this.physics.add.overlap(bird, [topColumn1, topColumn2, topColumn3, topColumn4, topColumn5, bottomColumn1, bottomColumn2, bottomColumn3, bottomColumn4, bottomColumn5], () => (hasBumped = true), null, this);
  this.physics.add.collider(bird, [topColumn1, topColumn2, topColumn3, topColumn4, topColumn5, bottomColumn1, bottomColumn2, bottomColumn3, bottomColumn4, bottomColumn5]);
}

function createMessage() {
  messageToPlayer = this.add.text(0, 0, `Instructions: Press space bar to start`, {
    fontFamily: '"Comic Sans MS", Times, serif',
    fontSize: '32px',
    color: 'white',
    backgroundColor: 'black',
  });
  Phaser.Display.Align.In.BottomCenter(messageToPlayer, background, 250, 250);
  messageToPlayer.setDepth(5);
}


function update() {
  if (cursors.space.isDown && !isGameStarted) {
    startGame.call(this)
  }

  if (cursors.up.isDown && !hasLanded && !hasBumped) {
    bird.setVelocityY(VELOCITY_Y);
  }
  checkCollisions.call(this);
  updateBirdVelocity.call(this);
  updateColumns.call(this);
  updateLines.call(this);
}

function startGame() {
  isGameStarted = true;
  messageToPlayer.text = 'Instructions: Press the "^" button to stay upright\n          and don\'t hit the columns or ground';

  topColumn1.children.iterate((column) => {
    column.setVelocityX(COLUMN_VELOCITY_X);
  });
   
  bottomColumn1.children.iterate((column) => {
    column.setVelocityX(COLUMN_VELOCITY_X);
  });

  topColumn2.children.iterate((column) => {
    column.setVelocityX(COLUMN_VELOCITY_X);
  });

  bottomColumn2.children.iterate((column) => {
    column.setVelocityX(COLUMN_VELOCITY_X);
  });

  topColumn3.children.iterate((column) => {
    column.setVelocityX(COLUMN_VELOCITY_X);
  });

  bottomColumn3.children.iterate((column) => {
    column.setVelocityX(COLUMN_VELOCITY_X);
  });

  topColumn4.children.iterate((column) => {
    column.setVelocityX(COLUMN_VELOCITY_X);
  });

  bottomColumn4.children.iterate((column) => {
    column.setVelocityX(COLUMN_VELOCITY_X);
  });

  topColumn5.children.iterate((column) => {
    column.setVelocityX(COLUMN_VELOCITY_X);
  });

  bottomColumn5.children.iterate((column) => {
    column.setVelocityX(COLUMN_VELOCITY_X);
  });

  line1.children.iterate((line) => {
    line.setVelocityX(COLUMN_VELOCITY_X);
  });

  line2.children.iterate((line) => {
    line.setVelocityX(COLUMN_VELOCITY_X);
  });

  line3.children.iterate((line) => {
    line.setVelocityX(COLUMN_VELOCITY_X);
  });

  line4.children.iterate((line) => {
    line.setVelocityX(COLUMN_VELOCITY_X);
  });

  line5.children.iterate((line) => {
    line.setVelocityX(COLUMN_VELOCITY_X);
  });

  line6.children.iterate((line) => {
    line.setVelocityX(COLUMN_VELOCITY_X);
  });

}

function updateBirdVelocity() {
  
  if (!hasLanded || !hasBumped && !isGameStarted) {
    bird.body.velocity.x = VELOCITY_X;
  }

  if (hasLanded || hasBumped) {
    bird.body.velocity.x = 0;
    bird.setVelocityY(500);
    stopColumns();
    stopLines();
  }

  if (hasLanded) {
    bird.setAngle(270)
    };
  
  if (hasBumped) {
    bird.setAngle(90)
  }

  if (bird.x > 350) {
    bird.setVelocityX(0);
  }

}



function stopColumns() {
  topColumn1.children.iterate((column) => {
    column.setVelocity(0);
  });

  bottomColumn1.children.iterate((column) => {
    column.setVelocity(0);
  });

  topColumn2.children.iterate((column) => {
    column.setVelocity(0);
  });

  bottomColumn2.children.iterate((column) => {
    column.setVelocity(0);
  });

  topColumn3.children.iterate((column) => {
    column.setVelocity(0);
  });

  bottomColumn3.children.iterate((column) => {
    column.setVelocity(0);
  });

  topColumn4.children.iterate((column) => {
    column.setVelocity(0);
  });

  bottomColumn4.children.iterate((column) => {
    column.setVelocity(0);
  });

  topColumn5.children.iterate((column) => {
    column.setVelocity(0);
  });

  bottomColumn5.children.iterate((column) => {
    column.setVelocity(0);
  });
}

function stopLines() {
 line1.children.iterate((line) => {
    line.setVelocityX(0);
  });

  line2.children.iterate((line) => {
    line.setVelocityX(0);
  });

  line3.children.iterate((line) => {
    line.setVelocityX(0);
  });

  line4.children.iterate((line) => {
    line.setVelocityX(0);
  });

  line5.children.iterate((line) => {
    line.setVelocityX(0);
  });

  line6.children.iterate((line) => {
    line.setVelocityX(0);
  });
}

function checkCollisions() {
  if (hasLanded || hasBumped) {
    messageToPlayer.text = `Oh no! You crashed!`;
  }
}

function updateColumns() {

  topColumn1.children.iterate((column) => {
    if (column.x < -column.width) {
      column.x = this.scale.width;
      column.y = Phaser.Math.Between(0, -120);
    }
  });

  bottomColumn1.children.iterate((column) => {
    if (column.x < -column.width) {
      column.x = this.scale.width;
      column.y = Phaser.Math.Between(450, 600);
    }
  });

  topColumn2.children.iterate((column) => {
    if (column.x < -column.width) {
      column.x = this.scale.width;
      column.y = Phaser.Math.Between(0, -120);
    }
  });

  bottomColumn2.children.iterate((column) => {
    if (column.x < -column.width) {
      column.x = this.scale.width;
      column.y = Phaser.Math.Between(450, 600);
    }
  });

  topColumn3.children.iterate((column) => {
    if (column.x < -column.width) {
      column.x = this.scale.width;
      column.y = Phaser.Math.Between(0, -120);
    }
  });

  bottomColumn3.children.iterate((column) => {
    if (column.x < -column.width) {
      column.x = this.scale.width;
      column.y = Phaser.Math.Between(450, 600);
    }
  });

  topColumn4.children.iterate((column) => {
    if (column.x < -column.width) {
      column.x = this.scale.width;
      column.y = Phaser.Math.Between(0, -120);
    }
  });

  bottomColumn4.children.iterate((column) => {
    if (column.x < -column.width) {
      column.x = this.scale.width;
      column.y = Phaser.Math.Between(450, 600);
    }
  });

  topColumn5.children.iterate((column) => {
    if (column.x < -column.width) {
      column.x = this.scale.width;
      column.y = Phaser.Math.Between(0, -120);
    }
  });

  bottomColumn5.children.iterate((column) => {
    if (column.x < -column.width) {
      column.x = this.scale.width;
      column.y = Phaser.Math.Between(450, 600);
    }
  });
}

function updateLines() {

 line1.children.iterate((line) => {
    if (line.x < -50) {
      line.x = this.scale.width;
      line.y = window.innerHeight - 90;
    }
  });

  line2.children.iterate((line) => {
    if (line.x < -50) {
      line.x = this.scale.width;
      line.y = window.innerHeight - 90;
    }
  });

  line3.children.iterate((line) => { 
    if (line.x < -50) {
      line.x = this.scale.width;
      line.y = window.innerHeight - 90;
    }
  });

  line4.children.iterate((line) => {
    if (line.x < -50) {
      line.x = this.scale.width;
      line.y = window.innerHeight - 90;
    }
  });

  line5.children.iterate((line) => {
    if (line.x < -50) {
      line.x = this.scale.width + 90;
      line.y = window.innerHeight - 90;
    }
  });

  line6.children.iterate((line) => {
    if (line.x < -50) {
      line.x = this.scale.width;
      line.y = window.innerHeight - 90;
    }
  }); 
}

window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});