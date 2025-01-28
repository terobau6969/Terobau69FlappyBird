const config = {
  renderer: Phaser.AUTO,
  width: 800,
  height: 600,
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
};

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

const VELOCITY_X = 15;
const VELOCITY_Y = -150;
const COLUMN_VELOCITY_X = -70;
const WIN_POSITION_X = 750;

function preload() {
  this.load.image('background', 'assets/background.png');
  this.load.image('road', 'assets/road.png');
  this.load.image('column', 'assets/column.png');
  this.load.spritesheet('bird', 'assets/bird.png', { frameWidth: 64, frameHeight: 96 });
}

function create() {
  createBackground.call(this);
  createRoad.call(this);
  createColumns.call(this);
  createBird.call(this);
  createControls.call(this);
  createMessage.call(this);
}

function update() {
  if (!isGameStarted) {
    bird.setVelocityY(VELOCITY_Y);
  }

  if (cursors.space.isDown && !isGameStarted) {
    startGame.call(this);
  }

  if (cursors.up.isDown && !hasLanded && !hasBumped) {
    bird.setVelocityY(VELOCITY_Y);
  }

 // updateBirdVelocity();
 // checkCollisions.call(this);
    updateColumns();
}

function createBackground() {
  this.add.image(0, 0, 'background').setOrigin(0, 0).setDepth(0);
}

function createRoad() {
  const roads = this.physics.add.staticGroup();
  roads.create(400, 568, 'road').setScale(2).refreshBody().setDepth(3);
}

function createColumns() {
  topColumn1 = this.physics.add.group({
    key: 'column',
    repeat: 0,
    setXY: { x: 300, y: Phaser.Math.Between(0, -100), stepX: 150 },
  });

  bottomColumn1 = this.physics.add.group({
    key: 'column',
    repeat: 0,
    setXY: { x: 450, y: Phaser.Math.Between(450, 600), stepX: 150 },
  });

  topColumn2 = this.physics.add.group({
    key: 'column',
    repeat: 0,
    setXY: { x: 600, y: Phaser.Math.Between(0, -50), stepX: 150 },
  });

  bottomColumn2 = this.physics.add.group({
    key: 'column',
    repeat: 0,
    setXY: { x: 750, y: Phaser.Math.Between(450, 600), stepX: 150 },
  });

  topColumn1.children.iterate((column, index) => {
    column.body.setAllowGravity(false);
    column.setVelocityX(0); 
    column.setDepth(2);
  });

  bottomColumn1.children.iterate((column, index) => {
    column.body.setAllowGravity(false);
    column.setVelocityX(0);
    column.setDepth(2);
  });

  topColumn2.children.iterate((column, index) => {
    column.body.setAllowGravity(false);
    column.setVelocityX(0);
    column.setDepth(2);
  });

  bottomColumn2.children.iterate((column, index) => {
    column.body.setAllowGravity(false);
    column.setVelocityX(0);
    column.setDepth(2);
  });
}

function createBird() {
  bird = this.physics.add.sprite(0, 50, 'bird').setScale(2);
  bird.setBounce(0.2);
  bird.setCollideWorldBounds(true);
  //this.physics.add.overlap(bird, this.physics.add.staticGroup(), () => (hasLanded = true), null, this);
  //this.physics.add.collider(bird, this.physics.add.staticGroup());
  bird.setDepth(4);
}

function createControls() {
  cursors = this.input.keyboard.createCursorKeys();
  //this.physics.add.overlap(bird, [topColumns, bottomColumns], () => (hasBumped = true), null, this);
  //this.physics.add.collider(bird, [topColumns, bottomColumns]);
}

function createMessage() {
  messageToPlayer = this.add.text(0, 0, `Instructions: Press space bar to start`, {
    fontFamily: '"Comic Sans MS", Times, serif',
    fontSize: '20px',
    color: 'white',
    backgroundColor: 'black',
  });
  Phaser.Display.Align.In.BottomCenter(messageToPlayer, this.add.image(0, 0, 'background').setOrigin(0, 0), 0, 50);
  messageToPlayer.setDepth(5);
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
}

/*function updateBirdVelocity() {
  if (!hasLanded || !hasBumped) {
    bird.body.velocity.x = VELOCITY_X;
  }

  if (hasLanded || hasBumped || !isGameStarted) {
    bird.body.velocity.x = 0;
    stopColumns();
  }

  if (bird.x > WIN_POSITION_X) {
    bird.setVelocityY(40);
    messageToPlayer.text = `Congrats! You won!`;
  }
}

function stopColumns() {
  topColumns.children.iterate((column) => {
    column.setVelocityX(0);
  });

  bottomColumns.children.iterate((column) => {
    column.setVelocityX(0);
  });
}

function checkCollisions() {
  if (hasLanded || hasBumped) {
    messageToPlayer.text = `Oh no! You crashed!`;
  }
}*/

function updateColumns() {

  topColumn1.children.iterate((column, index) => {
    if (column.x < -column.width) {
      column.x = 900 ;
      column.y = Phaser.Math.Between(0, -120);
    }
  });

  bottomColumn1.children.iterate((column, index) => {
    if (column.x < -column.width) {
      column.x = 900 ;
      column.y = Phaser.Math.Between(450, 600);
    }
  });

  topColumn2.children.iterate((column, index) => {
    if (column.x < -column.width) {
      column.x = 900;
      column.y = Phaser.Math.Between(0, -120);
    }
  });

  bottomColumn2.children.iterate((column, index) => {
    if (column.x < -column.width) {
      column.x = 900 ;
      column.y = Phaser.Math.Between(450, 600);
    }
  });
}