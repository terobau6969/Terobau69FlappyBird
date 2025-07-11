
export default class HowToPlayScene extends Phaser.Scene {
  constructor() {
    super('HowToPlayScene');
  }

  create() {
    this.add.text(100, 100, 'How to Play:\nPress SPACE to flap your wings\nAvoid the pipes!', {
      fontSize: '24px',
      color: '#fff'
    });

    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });
  }
}