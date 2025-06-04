import Phaser from 'phaser'
import { HEIGHT, WIDTH } from './constants';
import { MainGame } from './game';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: HEIGHT,
    height: WIDTH,
    parent: 'gameContainer',
    backgroundColor: '#222222',
    scene: [MainGame],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

new Phaser.Game(config);
