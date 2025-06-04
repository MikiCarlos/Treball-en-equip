import Phaser from 'phaser';
import { formatTime, getSettingsByDifficulty } from './utils';
import { Grid } from './grid';
import {
    COLS, HEIGHT, IMAGE_SIZE, MAX_ROWS, ROWS, WIDTH, SPECIAL_BUBBLE_COLOR,
    TINT_COLORS, POINTS_PER_BUBBLE, MIN_BUBBLES_TO_POP
} from './constants';

export class MainGame extends Phaser.Scene {
    scoreText!: Phaser.GameObjects.Text;
    timerText!: Phaser.GameObjects.Text;
    timer!: Phaser.Time.TimerEvent;

    bubbles!: Phaser.Physics.Arcade.Group;
    currentBubble!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    nextBubble!: Phaser.GameObjects.Image;

    grid: Grid = new Grid(ROWS, COLS, MAX_ROWS);
    isMoving: boolean = false;

    specialBubblesLeft!: number;
    specialIndicator!: Phaser.GameObjects.Text;


    constructor() {
        super('MainGame');
    }

    preload() {
        this.load.image('bubble', '/bubble.png');
    }

    create() {

        const settings = getSettingsByDifficulty();
        this.specialBubblesLeft = settings.specials;

        this.specialIndicator = this.add.text(WIDTH - 120, 16, `Especials: ${this.specialBubblesLeft}`, { color: '#ffffff' });

        this.createNewBubble(Phaser.Utils.Array.GetRandom(settings.colors));
        this.nextBubble = this.add.image(16, HEIGHT - 16, 'bubble');
        this.nextBubble.tint = Phaser.Utils.Array.GetRandom(settings.colors);

        this.data.set('pts', 0);

        this.timerText = this.add.text(0, 16, formatTime(0));
        this.timerText.x = WIDTH / 2 - this.timerText.width / 2;

        this.scoreText = this.add.text(16, 16, this.data.get('pts').toString());

        this.bubbles = this.physics.add.group();

        const colors = getSettingsByDifficulty().colors;

        // Bubble inicial
        this.createNewBubble(Phaser.Utils.Array.GetRandom(colors));

        // Siguiente burbuja
        this.nextBubble = this.add.image(16, HEIGHT - 16, 'bubble');
        this.nextBubble.tint = Phaser.Utils.Array.GetRandom(colors);

        this.populateBoard();

        this.timer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.timerText.text = formatTime(Math.floor(this.time.now * 0.001));
            },
            loop: true
        });

        this.input.on('pointerdown', (pointer: any) => {
            if (!this.isMoving) {
                this.isMoving = true;
                this.physics.moveTo(this.currentBubble, pointer.x, pointer.y, 600);
            }
        });
    }

    populateBoard(): void {
        const colors = getSettingsByDifficulty().colors;

        let x = 16;
        let y = 48;

        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const bubble = this.physics.add.image(x, y, 'bubble');
                bubble.tint = Phaser.Utils.Array.GetRandom(colors);
                this.bubbles.add(bubble);

                this.grid.set(row, col, bubble);

                x += IMAGE_SIZE;
            }

            x = 16;
            y += 32;
        }
    }

    createNewBubble(color?: number) {
        const settings = getSettingsByDifficulty();
        const chanceSpecial = Math.random() < 0.1 && this.specialBubblesLeft > 0;

        const bubbleColor = chanceSpecial ? SPECIAL_BUBBLE_COLOR : (color ?? this.nextBubble.tint);

        this.currentBubble = this.physics.add.image(WIDTH / 2, HEIGHT - 16, 'bubble');
        this.currentBubble.tint = bubbleColor;
        this.currentBubble.setCollideWorldBounds(true);
        this.currentBubble.setBounce(1);

        this.physics.add.overlap(this.currentBubble, this.bubbles, (current: any, touched: any) => {
            const row = Math.floor(touched.y / 32);
            const col = Math.round((current.x - 16) / 32);

            const bubble = this.physics.add.image(16 + col * 32, 48 + row * 32, 'bubble');
            bubble.tint = this.currentBubble.tint;
            this.bubbles.add(bubble);
            this.grid.set(row, col, bubble);

            this.currentBubble.body.stop();
            this.currentBubble.destroy();

            if (bubble.tint === SPECIAL_BUBBLE_COLOR && this.specialBubblesLeft > 0) {
                this.destroyRow(row);
                this.destroyCol(col)
                this.specialBubblesLeft--;
                this.specialIndicator.setText(`Especials: ${this.specialBubblesLeft}`);
            } else {
                const connected = this.grid.getConnected(row, col, bubble.tint);
                if (connected.length >= MIN_BUBBLES_TO_POP) {
                    connected.forEach(item => {
                        item.bubble.destroy();
                        this.grid.set(item.row, item.col, null);
                    });

                    this.data.inc('pts', connected.length * POINTS_PER_BUBBLE);
                    this.scoreText.text = this.data.get('pts').toString();
                }
            }

            this.createNewBubble();
            this.nextBubble.tint = Phaser.Utils.Array.GetRandom(settings.colors);
            this.isMoving = false;
        });
    }

    destroyRow(row: number) {
        for (let col = 0; col < COLS; col++) {
            const bubble = this.grid.get(row, col);
            if (bubble) {
                bubble.destroy();
                this.grid.set(row, col, null);
            }
        }

        // Puntos opcionales por destruir fila completa
        this.data.inc('pts', COLS * POINTS_PER_BUBBLE);
        this.scoreText.text = this.data.get('pts').toString();
    }

    destroyCol(col: number) {
    for (let row = 0; row < ROWS; row++) {
        const bubble = this.grid.get(row, col);
        if (bubble) {
            bubble.destroy();
            this.grid.set(row, col, null);
        }
    }

    // Punts opcionals per destruir columna completa
    this.data.inc('pts', ROWS * POINTS_PER_BUBBLE);
    this.scoreText.text = this.data.get('pts').toString();
}


}
