let config = {
  renderer: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 300 },
          debug: false
      }
  },
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

let game = new Phaser.Game(config);
let isGameStarted = false;
let bird;
let hasLanded = false;
let hasBumped = false;
let cursors;
let messageToPlayer;
let topColumns; // Global for access in update()
let bottomColumns; // Global for access in update()

function preload() {
  this.load.image('background', 'assets/background.png');
  this.load.image('road', 'assets/road.png');
  this.load.image('column', 'assets/column.png');
  this.load.spritesheet('bird', 'assets/bird.png', { frameWidth: 64, frameHeight: 96 });
}

function create() {
  const background = this.add.image(0, 0, 'background').setOrigin(0, 0);
  const roads = this.physics.add.staticGroup();

  // Creating top columns
  topColumns = this.physics.add.group({
      key: 'column',
      repeat: 2,
      setXY: { x: 300, y: 0, stepX: 300 }
  });

  // Creating bottom columns
  bottomColumns = this.physics.add.group({
      key: 'column',
      repeat: 2,
      setXY: { x: 350, y: 400, stepX: 300 }
  });

  // Setting up initial velocity for all columns
  topColumns.children.iterate((column) => {
      column.body.setAllowGravity(false);
      column.setVelocityX(-100); // Move top columns to the left
  });

  bottomColumns.children.iterate((column) => {
      column.setVelocityX(-100);
      column.body.setAllowGravity(false); // Move bottom columns to the left
  });

  const road = roads.create(400, 568, 'road').setScale(2).refreshBody();

    bird = this.physics.add.sprite(0, 50, 'bird').setScale(2);
    bird.setBounce(0.2);
    bird.setCollideWorldBounds(true);
    this.physics.add.overlap(bird, road, () => hasLanded = true, null, this);
    this.physics.add.collider(bird, road);

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.overlap(bird, topColumns, ()=>hasBumped=true,null, this);
    this.physics.add.overlap(bird, bottomColumns, ()=>hasBumped=true,null, this);
    this.physics.add.collider(bird, topColumns);
    this.physics.add.collider(bird, bottomColumns);

    messageToPlayer = this.add.text(0, 0, `Instructions: Press space bar to start`, { fontFamily: '"Comic Sans MS", Times, serif', fontSize: "20px", color: "white", backgroundColor: "black" });
    Phaser.Display.Align.In.BottomCenter(messageToPlayer, background, 0, 50);
  }
  
  function update() {
    if (!isGameStarted) {
        bird.setVelocityY(-160);
      }

    if (cursors.space.isDown && !isGameStarted) {
        isGameStarted = true;
        messageToPlayer.text = 'Instructions: Press the "^" button to stay upright\n          and don\'t hit the columns or ground';
      }
    
    if (cursors.up.isDown && !hasLanded && !hasBumped) {
      bird.setVelocityY(-160);
    }
  
    if (!hasLanded || !hasBumped) {
        bird.body.velocity.x = 50;
      }
      
    if (hasLanded || hasBumped || !isGameStarted) {
        bird.body.velocity.x = 0;
      }

      if (hasLanded || hasBumped) {
        messageToPlayer.text = `Oh no! You crashed!`;
      }
    

    if (cursors.space.isDown && !isGameStarted) {
        isGameStarted = true;
    }

    if (bird.x > 750) {
        bird.setVelocityY(40);
        messageToPlayer.text = `Congrats! You won!`;
      } 
    

   
}
