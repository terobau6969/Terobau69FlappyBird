export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    this.add.text(100, 100, 'Welcome to Flappy Bird Clone\nPress SPACE to Start', {
      fontSize: '24px',
      color: '#fff'
    });

    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });
  }
}
