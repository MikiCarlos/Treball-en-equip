import Phaser from 'phaser'
import { HEIGHT, WIDTH } from './constants';
import { MainGame } from './game';

new Phaser.Game({
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: 0x242424,
    parent: 'game',
    scene: [ MainGame ],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    }
});