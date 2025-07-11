export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('road', 'assets/road.png');
    this.load.image('line', 'assets/line.png');
    this.load.image('column', 'assets/column.png');
    this.load.image('backArrow', 'assets/backarrow.png');
    this.load.spritesheet('bird2', 'assets/bird2.png', { frameWidth: 64, frameHeight: 96 });
    this.load.spritesheet('bird3', 'assets/bird3.png', { frameWidth: 64, frameHeight: 96 });
    this.load.spritesheet('bird1', 'assets/bird1.png', { frameWidth: 64, frameHeight: 96 });
  }

  create() {
    // Constants
    this.PIPE_VELOCITY_X = -170;
    this.PIPE_SPACING = 300;
    this.PIPE_GAP_SIZE = 150;
    this.PIPE_MIN_Y = 100;
    this.PIPE_MAX_Y = 400;
    this.FORWARD_VELOCITY_X = 60;
    this.VELOCITY_Y = -150;
    this.STOP_POSITION_X = 600;

    // Game state flags
    this.isGameStarted = false;
    this.hasLanded = false;
    this.hasBumped = false;

    this.lineGroups = [];
    this.pipePairs = [];

    // Create game objects
    this.createBackground();
    this.createRoad();
    this.createLines();
    this.createBird();
    this.createColumns();
    this.createControls();

    // Create message text
    this.createMessage();

    // Back button
    this.backButton = this.add.image(30, 30, 'backArrow').setInteractive({ useHandCursor: true }).setDepth(10);
    this.backButton.setScale(0.4);

    this.backButton.on('pointerdown', () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('MenuScene');
      });
    });

    // Add collisions AFTER all relevant objects exist
    this.physics.add.collider(this.bird, this.roads, () => {
      this.hasLanded = true;
    });

    this.pipePairs.forEach(({ topPipe, bottomPipe }) => {
      this.physics.add.collider(this.bird, topPipe, () => {
        this.hasBumped = true;
      });
      this.physics.add.collider(this.bird, bottomPipe, () => {
        this.hasBumped = true;
      });
    });
  }

  update() {
    if (this.cursors.space.isDown && !this.isGameStarted) {
      this.startGame();
    }

    if (this.hasLanded || this.hasBumped) {
      this.messageToPlayer.setText('Oh no! You crashed! Press SPACE to restart');

      if (this.cursors.space.isDown) {
        this.resetGame();
      }

      this.stopPipes();
      this.stopLines();
      this.bird.setVelocityY(500);
      this.bird.body.allowGravity = true;
      this.bird.setAngle(this.hasLanded ? 270 : 90);
      return;
    }

    if (this.isGameStarted) {
      if (this.cursors.up.isDown && !this.hasLanded && !this.hasBumped) {
        this.bird.setVelocityY(this.VELOCITY_Y);
      }

      if (this.bird.x < this.STOP_POSITION_X) {
        this.bird.setVelocityX(this.FORWARD_VELOCITY_X);
      } else {
        this.bird.setVelocityX(0);
      }

      this.updatePipes();
      this.updateLines();
    } else {
      this.bird.setVelocity(0, 0);
    }
  }

  createBackground() {
    this.background = this.add.image(0, 0, 'background').setOrigin(0, 0).setDepth(0);
    this.background.displayWidth = this.scale.width;
    this.background.displayHeight = this.scale.height - 120;
  }

  createRoad() {
    this.roads = this.physics.add.staticGroup();
    const roadSprite = this.roads.create(this.scale.width / 2, this.scale.height - 85, 'road');
    roadSprite.setDisplaySize(this.scale.width, 150);
    roadSprite.setDepth(3);
    roadSprite.refreshBody();
  }

  createLines() {
    const linePositionsX = [250, 600, 950, 1300, 1650];
    linePositionsX.forEach((posX) => {
      const lineGroup = this.physics.add.group({
        key: 'line',
        repeat: 0,
        setXY: { x: posX, y: this.scale.height - 90 },
        immovable: true,
        allowGravity: false,
      });

      lineGroup.children.iterate((line) => {
        line.setScale(0.1, 0.02);
        line.body.allowGravity = false;
        line.setVelocityX(0);
        line.setDepth(4);
      });

      this.lineGroups.push(lineGroup);
    });
  }

  createBird() {
    const selectedBirdKey = localStorage.getItem('selectedBird') || 'bird1';
    this.bird = this.physics.add.sprite(100, 100, selectedBirdKey);
    this.bird.setScale(1);
    this.bird.setBounce(0.2);
    this.bird.setCollideWorldBounds(true);
    this.bird.body.allowGravity = false;
    this.bird.setVelocity(0, 0);
    this.bird.setDepth(4);
  }

  createColumns() {
    const totalPairs = Math.floor(this.scale.width / this.PIPE_SPACING) + 2;
    const startX = 750;

    for (let i = 0; i < totalPairs; i++) {
      const x = startX + i * this.PIPE_SPACING;
      const gapY = Phaser.Math.Between(this.PIPE_MIN_Y, this.PIPE_MAX_Y);

      const topPipe = this.physics.add.sprite(x, gapY - this.PIPE_GAP_SIZE / 2, 'column');
      topPipe.setOrigin(0.5, 1);
      topPipe.displayHeight = gapY;
      topPipe.body.allowGravity = false;
      topPipe.body.immovable = true;
      topPipe.setVelocityX(0);
      topPipe.setDepth(2);

      const bottomPipe = this.physics.add.sprite(x, gapY + this.PIPE_GAP_SIZE / 2, 'column');
      bottomPipe.setOrigin(0.5, 0);
      bottomPipe.displayHeight = this.background.displayHeight - bottomPipe.y;
      bottomPipe.body.allowGravity = false;
      bottomPipe.body.immovable = true;
      bottomPipe.setVelocityX(0);
      bottomPipe.setDepth(2);

      this.pipePairs.push({ topPipe, bottomPipe });
    }
  }

  createControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createMessage() {
    this.messageToPlayer = this.add.text(
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
    ).setOrigin(0.5, 0.5).setDepth(5);
  }

  startGame() {
    this.isGameStarted = true;
    this.hasLanded = false;
    this.hasBumped = false;

    this.bird.body.allowGravity = true;
    this.bird.setAngle(0);
    this.messageToPlayer.setText('Press UP to stay upright. Avoid pipes and ground!');

    this.pipePairs.forEach(({ topPipe, bottomPipe }) => {
      topPipe.setVelocityX(this.PIPE_VELOCITY_X);
      bottomPipe.setVelocityX(this.PIPE_VELOCITY_X);
    });

    this.setVelocityXForGroup(this.lineGroups, this.PIPE_VELOCITY_X);
  }

  resetGame() {
    this.isGameStarted = false;
    this.hasLanded = false;
    this.hasBumped = false;

    this.messageToPlayer.setText('Press SPACE to start');

    this.bird.setPosition(100, 100);
    this.bird.setAngle(0);
    this.bird.setVelocity(0, 0);
    this.bird.body.allowGravity = false;

    const startX = 750;

    this.pipePairs.forEach(({ topPipe, bottomPipe }, i) => {
      const x = startX + i * this.PIPE_SPACING;
      const gapY = Phaser.Math.Between(this.PIPE_MIN_Y, this.PIPE_MAX_Y);

      topPipe.x = x;
      topPipe.displayHeight = gapY;
      topPipe.y = gapY - this.PIPE_GAP_SIZE / 2;
      topPipe.setVelocityX(0);

      bottomPipe.x = x;
      bottomPipe.y = gapY + this.PIPE_GAP_SIZE / 2;
      bottomPipe.displayHeight = this.background.displayHeight - bottomPipe.y;
      bottomPipe.setVelocityX(0);
    });

    const positions = [250, 600, 950, 1300, 1650];
    this.lineGroups.forEach((group, idx) => {
      group.children.iterate((line) => {
        line.x = positions[idx];
        line.setVelocityX(0);
      });
    });
  }

  getRightMostPipeX() {
    return Math.max(...this.pipePairs.map(({ topPipe }) => topPipe.x));
  }

  updatePipes() {
    this.pipePairs.forEach(({ topPipe, bottomPipe }) => {
      if (topPipe.x + topPipe.displayWidth < 0) {
        const newX = this.getRightMostPipeX() + this.PIPE_SPACING;
        const gapY = Phaser.Math.Between(this.PIPE_MIN_Y, this.PIPE_MAX_Y);

        topPipe.x = newX;
        topPipe.displayHeight = gapY;
        topPipe.y = gapY - this.PIPE_GAP_SIZE / 2;

        bottomPipe.x = newX;
        bottomPipe.y = gapY + this.PIPE_GAP_SIZE / 2;
        bottomPipe.displayHeight = this.background.displayHeight - bottomPipe.y;
      }
    });
  }

  updateLines() {
    this.lineGroups.forEach((group) => {
      group.children.iterate((line) => {
        if (line.x < -50) {
          line.x = this.scale.width + 90;
          line.y = this.scale.height - 90;
        }
      });
    });
  }

  stopPipes() {
    this.pipePairs.forEach(({ topPipe, bottomPipe }) => {
      topPipe.setVelocityX(0);
      bottomPipe.setVelocityX(0);
    });
  }

  stopLines() {
    this.setVelocityXForGroup(this.lineGroups, 0);
  }

  setVelocityXForGroup(groupArray, velocityX) {
    groupArray.forEach((group) => {
      group.children.iterate((child) => {
        child.setVelocityX(velocityX);
      });
    });
  }
}
