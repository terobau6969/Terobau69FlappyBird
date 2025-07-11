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
};

const game = new Phaser.Game(config);

// Constants for pipe logic
const PIPE_VELOCITY_X = -170;
const PIPE_SPACING = 300;    // Horizontal spacing between pipe pairs
const PIPE_GAP_SIZE = 150;   // Vertical gap between top and bottom pipe
const PIPE_MIN_Y = 100;      // Min gap center y-position
const PIPE_MAX_Y = 400;      // Max gap center y-position
const FORWARD_VELOCITY_X = 60; // You can adjust this value for speed
const VELOCITY_Y = -150;
const STOP_POSITION_X = 600;

let bird;
let cursors;
let messageToPlayer;
let background;
let roads;
let lineGroups = [];
let pipePairs = [];

let isGameStarted = false;
let hasLanded = false;
let hasBumped = false;

function preload() {
  this.load.image('background', 'assets/background.png');
  this.load.image('road', 'assets/road.png');
  this.load.image('line', 'assets/line.png');
  this.load.image('column', 'assets/column.png');
  this.load.spritesheet('bird', 'assets/bird.png', { frameWidth: 64, frameHeight: 96 });
}

function create() {
  createBackground.call(this);
  this.gameWidth = this.scale.width;
  this.gameHeight = this.scale.height;
  this.backgroundHeight = background.displayHeight;
  createRoad.call(this);
  createLines.call(this);
  createBird.call(this);
  createColumns.call(this);
  createControls.call(this);
  createMessage.call(this);

  // Setup collisions after bird and pipes exist
  pipePairs.forEach(({ topPipe, bottomPipe }) => {
    this.physics.add.collider(bird, topPipe, () => { hasBumped = true; }, null, this);
    this.physics.add.collider(bird, bottomPipe, () => { hasBumped = true; }, null, this);
  });

  this.physics.add.collider(bird, roads, () => { hasLanded = true; }, null, this);
}

function createBackground() {
  background = this.add.image(0, 0, 'background').setOrigin(0, 0).setDepth(0);
  background.displayWidth = window.innerWidth;
  background.displayHeight = window.innerHeight - 120;
}

function createRoad() {
  roads = this.physics.add.staticGroup();

  // Create the road sprite at bottom center of the screen
  const roadSprite = roads.create(window.innerWidth / 2, window.innerHeight - 85, 'road');

  // Stretch width and height as needed
  roadSprite.setDisplaySize(window.innerWidth, 150);  // Stretch width only (maintain aspect ratio for height)
  roadSprite.setDepth(3);
  roadSprite.refreshBody();
}


function createLines() {
  lineGroups = [];
  const linePositionsX = [250, 600, 950, 1300, 1650];

  linePositionsX.forEach((posX) => {
    let lineGroup = this.physics.add.group({
      key: 'line',
      repeat: 0,
      setXY: { x: posX, y: window.innerHeight - 90 },
      immovable: true,
      allowGravity: false,
    });

    lineGroup.children.iterate((line) => {
      line.setScale(0.1, 0.02);
      line.body.allowGravity = false;
      line.setVelocityX(0);
      line.setDepth(4);
    });

    lineGroups.push(lineGroup);
  });
}

function createColumns() {
  pipePairs = [];
  const totalPairs = Math.floor(window.innerWidth / PIPE_SPACING) + 2;

  // Start columns *on screen* spaced evenly
  const startX = 750; // Start first pipe at PIPE_SPACING from left edge

  for (let i = 0; i < totalPairs; i++) {
    const x = startX + i * PIPE_SPACING;

    const gapY = Phaser.Math.Between(PIPE_MIN_Y, PIPE_MAX_Y);

    // Top pipe
    const topPipe = this.physics.add.sprite(x, gapY - PIPE_GAP_SIZE / 2, 'column');
    topPipe.setOrigin(0.5, 1);
    topPipe.displayHeight = gapY;
    topPipe.body.allowGravity = false;
    topPipe.body.immovable = true;        // <-- Make immovable to avoid falling on collision
    topPipe.setVelocityX(0);
    topPipe.setDepth(2);

    // Bottom pipe
    const bottomPipe = this.physics.add.sprite(x, gapY + PIPE_GAP_SIZE / 2, 'column');
    bottomPipe.setOrigin(0.5, 0);
    bottomPipe.displayHeight = background.displayHeight - bottomPipe.y;
    bottomPipe.body.allowGravity = false;
    bottomPipe.body.immovable = true;     // <-- Make immovable
    bottomPipe.setVelocityX(0);
    bottomPipe.setDepth(2);

    pipePairs.push({ topPipe, bottomPipe });
  }
}

function createBird() {
  bird = this.physics.add.sprite(100, 100, 'bird').setScale(2);
  bird.setBounce(0.2);
  bird.setCollideWorldBounds(true);
  bird.body.allowGravity = false;
  bird.setVelocity(0, 0);
  bird.setDepth(4);
}

function createControls() {
  cursors = this.input.keyboard.createCursorKeys();
}

function createMessage() {
  messageToPlayer = this.add.text(
    this.scale.width / 2,
    this.scale.height - 60,
    'Press SPACE to start',
    {
      fontFamily: '"Comic Sans MS", Times, serif',
      fontSize: '32px',
      color: 'white',
      backgroundColor: 'black',
      padding: { x: 10, y: 10 },
    }
  );
  messageToPlayer.setOrigin(0.5, 0.5);
  messageToPlayer.setDepth(5);
}

function update() {
  if (cursors.space.isDown && !isGameStarted) {
    startGame.call(this);
  }

  if (hasLanded || hasBumped) {
    messageToPlayer.text = 'Oh no! You crashed! Press SPACE to restart';
    if (cursors.space.isDown) {
      resetGame.call(this);
    }
    stopPipes();
    stopLines();
    bird.setVelocityY(500);
    bird.body.allowGravity = true;
    if (hasLanded) bird.setAngle(270);
    if (hasBumped) bird.setAngle(90);
    return;
  }

  if (isGameStarted) {
    if (cursors.up.isDown && !hasLanded && !hasBumped) {
      bird.setVelocityY(VELOCITY_Y);
    }

    if (bird.x < STOP_POSITION_X) {
    bird.setVelocityX(FORWARD_VELOCITY_X);
  } else {
    bird.setVelocityX(0);
  }

    updatePipes.call(this);
    updateLines.call(this);
  } else {
    bird.setVelocity(0, 0);
  }
}

function startGame() {
  isGameStarted = true;
  hasLanded = false;
  hasBumped = false;

  bird.body.allowGravity = true;
  bird.setAngle(0);
  messageToPlayer.text = 'Press UP to stay upright. Avoid pipes and ground!';

  pipePairs.forEach(({ topPipe, bottomPipe }) => {
    topPipe.setVelocityX(PIPE_VELOCITY_X);
    bottomPipe.setVelocityX(PIPE_VELOCITY_X);
  });

  lineGroups.forEach((group) => {
    group.children.iterate((line) => {
      line.setVelocityX(PIPE_VELOCITY_X);
    });
  });
}

function setVelocityXForGroup(groupArray, velocityX) {
  groupArray.forEach((group) => {
    group.children.iterate((child) => {
      child.setVelocityX(velocityX);
    });
  });
}

function resetGame() {
  isGameStarted = false;
  hasLanded = false;
  hasBumped = false;

  messageToPlayer.text = 'Press SPACE to start';

  bird.setPosition(100, 100);
  bird.setAngle(0);
  bird.setVelocity(0, 0);
  bird.body.allowGravity = false;

  const startX = 750; // also reset pipe positions to start on screen

  pipePairs.forEach(({ topPipe, bottomPipe }, i) => {
    const x = startX + i * PIPE_SPACING;
    const gapY = Phaser.Math.Between(PIPE_MIN_Y, PIPE_MAX_Y);

    topPipe.x = x;
    topPipe.displayHeight = gapY;
    topPipe.y = gapY - PIPE_GAP_SIZE / 2;
    topPipe.setVelocityX(0);

    bottomPipe.x = x;
    bottomPipe.y = gapY + PIPE_GAP_SIZE / 2;
    bottomPipe.displayHeight = background.displayHeight - bottomPipe.y;
    bottomPipe.setVelocityX(0);
  });

  lineGroups.forEach((group, idx) => {
    const positions = [250, 600, 950, 1300, 1650];
    group.children.iterate((line) => {
      line.x = positions[idx];
      line.setVelocityX(0);
    });
  });
}


function getRightMostPipeX() {
  let rightMostX = 0;
  pipePairs.forEach(({ topPipe }) => {
    if (topPipe.x > rightMostX) rightMostX = topPipe.x;
  });
  return rightMostX;
}

function updateLines() {
  lineGroups.forEach((group) => {
    group.children.iterate((line) => {
      if (line.x < -50) {
        line.x = this.gameWidth + 90;
        line.y = this.gameHeight - 90;
      }
    });
  });
}

function updatePipes() {
  pipePairs.forEach(({ topPipe, bottomPipe }) => {
    // If the pipe has moved off screen (fully to the left)
    if (topPipe.x + topPipe.displayWidth < 0) {
      const rightMostX = getRightMostPipeX();
      const newX = rightMostX + PIPE_SPACING;
      const gapY = Phaser.Math.Between(PIPE_MIN_Y, PIPE_MAX_Y);

      topPipe.x = newX;
      topPipe.displayHeight = gapY;
      topPipe.y = gapY - PIPE_GAP_SIZE / 2;

      bottomPipe.x = newX;
      bottomPipe.y = gapY + PIPE_GAP_SIZE / 2;
      bottomPipe.displayHeight = background.displayHeight - bottomPipe.y;
    }
  });
}


function stopPipes() {
  pipePairs.forEach(({ topPipe, bottomPipe }) => {
    [topPipe, bottomPipe].forEach(pipe => pipe.setVelocityX(0));
  });
}



function stopLines() {
  setVelocityXForGroup(lineGroups, 0);
}

window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
  const scene = game.scene.getScene();
  if (scene) {
    scene.gameWidth = scene.scale.width;
    scene.gameHeight = scene.scale.height;
    if (background) scene.backgroundHeight = background.displayHeight;
  }
});
