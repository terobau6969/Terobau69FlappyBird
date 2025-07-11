export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  preload() {
    // preload any images or sprites for UI if needed
  }

  create() {
    this.cameras.main.fadeIn(500);

    // Add title text
    this.add.text(this.scale.width / 2, 80, 'Welcome to Flappy Bird Clone', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '20px',
      color: '#fff',
    }).setOrigin(0.5);

    // Load or assign username
    this.username = localStorage.getItem('username') || '';
    if (!this.username) {
      this.username = this.generateGuestUsername();
      localStorage.setItem('username', this.username);
    }

    // Create HTML input over Phaser canvas
    this.createUsernameInput();

    // Create buttons
    this.createButton('Start Game', this.scale.height / 2 - 40, () => this.startGame());
    this.createButton('How to Play', this.scale.height / 2 + 10, () => this.scene.start('HowToPlayScene'));
    this.createButton('Pick Bird', this.scale.height / 2 + 60, () => this.scene.start('PickBirdScene'));
    this.createButton('Leaderboard', this.scale.height / 2 + 110, () => this.scene.start('LeaderboardScene'));
  }

  createUsernameInput() {
    // Create or reuse HTML input element
    if (!document.getElementById('username-input')) {
      this.usernameInput = document.createElement('input');
      this.usernameInput.id = 'username-input';
      this.usernameInput.type = 'text';
      this.usernameInput.placeholder = 'Enter username (optional)';
      document.body.appendChild(this.usernameInput);
    } else {
      this.usernameInput = document.getElementById('username-input');
      this.usernameInput.style.display = 'block';
    }
    this.usernameInput.value = this.username;

    this.usernameInput.oninput = () => {
      let val = this.usernameInput.value.trim();
      if (val === '') {
        // Assign guest username if empty
        val = this.generateGuestUsername();
      }
      this.username = val;
      localStorage.setItem('username', val);
    };
  }

  createButton(text, y, callback) {
    const btn = this.add.text(this.scale.width / 2, y, text, {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '14px',
      color: '#000',
      backgroundColor: '#7a7a7a',
      padding: { x: 15, y: 10 },
      align: 'center',
      fixedWidth: 200,
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', () => {
      this.usernameInput.style.display = 'none';
      callback();
    })
    .on('pointerover', () => btn.setStyle({ fill: '#fff', backgroundColor: '#999' }))
    .on('pointerout', () => btn.setStyle({ fill: '#000', backgroundColor: '#7a7a7a' }));

    return btn;
  }

  generateGuestUsername() {
    let guestCount = parseInt(localStorage.getItem('guestCount') || '0', 10);
    guestCount++;
    localStorage.setItem('guestCount', guestCount.toString());
    return `guest${guestCount}`;
  }

  startGame() {
    this.scene.start('GameScene', { username: this.username });
  }
}
