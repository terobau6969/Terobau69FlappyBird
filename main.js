import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import HowToPlayScene from './scenes/HowToPlayScene.js';
import PickBirdScene from './scenes/PickBirdScene.js';
import LeaderboardScene from './scenes/LeaderboardScene.js';

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: { default: 'arcade', arcade: { gravity: { y: 300 }, debug: false } },
  scene: [MenuScene, GameScene, HowToPlayScene, PickBirdScene, LeaderboardScene],
};

new Phaser.Game(config);
