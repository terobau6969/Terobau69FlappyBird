export default class LeaderboardScene extends Phaser.Scene {
    constructor() {
        super('LeaderboardScene');
    }
    
    create() {
        this.add.text(100, 100, 'Leaderboard:\n1. Player1 - 100\n2. Player2 - 90\n3. Player3 - 80', {
        fontSize: '24px',
        color: '#fff'
        });
    
        this.input.keyboard.on('keydown-SPACE', () => {
        this.scene.start('MenuScene');
        });
    }
}
