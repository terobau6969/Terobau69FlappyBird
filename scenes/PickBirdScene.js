export default class PickBirdScene extends Phaser.Scene {
  constructor() {
    super('PickBirdScene');
  }

  preload() {
    this.load.image('bird1', 'assets/bird1.png');
    this.load.image('bird2', 'assets/bird2.png');
    this.load.image('bird3', 'assets/bird3.png');
  }

  create() {
    this.cameras.main.setBackgroundColor('#000000');

    // Title
    this.add.text(this.scale.width / 2, 50, 'Pick Your Bird', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '28px',
      color: '#eee',
    }).setOrigin(0.5);

    this.selectedBird = null;
    this.birdBoxes = [];
    this.birdSprites = [];

    const birdKeys = ['bird1', 'bird2', 'bird3'];
    const boxSize = 120;          // fixed size for selection box (square)
    const boxPadding = 30;        // space between boxes
    const totalWidth = birdKeys.length * boxSize + (birdKeys.length - 1) * boxPadding;
    const startX = (this.scale.width - totalWidth) / 2;
    const boxY = 150;

    birdKeys.forEach((key, index) => {
      const boxX = startX + index * (boxSize + boxPadding);

      // Draw selection box (transparent with white border)
      const box = this.add.rectangle(boxX + boxSize / 2, boxY + boxSize / 2, boxSize, boxSize, 0x222222, 0.8)
        .setStrokeStyle(3, 0xffffff)
        .setInteractive();

      // Add bird sprite centered inside box, scaled to fit nicely (max 80x80)
      const sprite = this.add.sprite(boxX + boxSize / 2, boxY + boxSize / 2, key);

      // Scale sprite to max 80x80 while preserving aspect ratio
      const maxSpriteSize = 80;
      const scaleX = maxSpriteSize / sprite.width;
      const scaleY = maxSpriteSize / sprite.height;
      const scale = Math.min(scaleX, scaleY);
      sprite.setScale(scale);

      box.setData('birdKey', key);
      box.setData('sprite', sprite);

      box.on('pointerdown', () => this.selectBird(box));

      this.birdBoxes.push(box);
      this.birdSprites.push(sprite);
    });

    // Select button (disabled initially)
    this.selectButton = this.add.text(this.scale.width / 2, boxY + boxSize + 70, 'Select', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '24px',
      backgroundColor: '#808080',
      color: '#f0f0f0',
      padding: { x: 20, y: 10 },
      fontWeight: 'bold',
    })
      .setOrigin(0.5)
      .setAlpha(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        if (this.selectedBird) {
          localStorage.setItem('selectedBird', this.selectedBird);
          this.fadeOut(() => this.scene.start('MenuScene'));
        }
      });

    // Back button
    this.backText = this.add.text(20, 20, 'Back', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '20px',
      backgroundColor: '#555555',
      color: '#f0f0f0',
      padding: { x: 10, y: 5 },
      fontWeight: 'bold',
      cursor: 'pointer',
    })
      .setInteractive()
      .on('pointerdown', () => this.fadeOut(() => this.scene.start('MenuScene')));

    // Graphics object for green outline of selected box
    this.selectionOutline = this.add.graphics();
    this.fadeIn();
  }

  selectBird(box) {
    this.selectedBird = box.getData('birdKey');

    // Clear previous outline
    this.selectionOutline.clear();

    // Draw green rectangle around selected box
    this.selectionOutline.lineStyle(4, 0x00ff00);
    this.selectionOutline.strokeRect(
      box.x - box.width / 2,
      box.y - box.height / 2,
      box.width,
      box.height
    );

    // Enable select button
    this.selectButton.setAlpha(1);
  }

  fadeOut(callback) {
    const fadeRect = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000)
      .setOrigin(0)
      .setDepth(100);
    fadeRect.alpha = 0;
    this.tweens.add({
      targets: fadeRect,
      alpha: 1,
      duration: 500,
      onComplete: () => callback(),
    });
  }

  fadeIn() {
    const fadeRect = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000)
      .setOrigin(0)
      .setDepth(100);
    fadeRect.alpha = 1;
    this.tweens.add({
      targets: fadeRect,
      alpha: 0,
      duration: 500,
      onComplete: () => fadeRect.destroy(),
    });
  }
}
