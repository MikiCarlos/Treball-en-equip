import Phaser from 'phaser'
import { formatTime } from './utils';
import { Grid } from './grid';
import { COLS, HEIGHT, IMAGE_SIZE, MAX_ROWS, ROWS, WIDTH, TINT_COLORS, POINTS_PER_BUBBLE, MIN_BUBBLES_TO_POP } from './constants';

export class MainGame extends Phaser.Scene {
    scoreText!: Phaser.GameObjects.Text;
    timerText!: Phaser.GameObjects.Text;
    timer!: Phaser.Time.TimerEvent;

    bubbles!: Phaser.Physics.Arcade.Group;
    currentBubble!: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    nextBubble!: Phaser.GameObjects.Image;

    grid: Grid = new Grid(ROWS, COLS, MAX_ROWS);
    isMoving: boolean = false;

    constructor () {
        super('MainGame');
    }

    preload () {
        this.load.image('bubble', '/bubble.png');
    }

    create () {
        // punts inicials
        this.data.set('pts', 0);

        this.timerText = this.add.text(0, 16, formatTime(0));
        this.timerText.x = WIDTH / 2 - this.timerText.width / 2;

        this.scoreText = this.add.text(16, 16, this.data.get('pts').toString())

        this.bubbles = this.physics.add.group();

        // Create bullet bubble
        this.createNewBubble(Phaser.Utils.Array.GetRandom(TINT_COLORS));

        // Next bubble color
        this.nextBubble = this.add.image(16, HEIGHT - 16, 'bubble');
        this.nextBubble.tint = Phaser.Utils.Array.GetRandom(TINT_COLORS);

        this.populateBoard();

        // timer pel temps total del joc
        this.timer = this.time.addEvent({ delay: 1000, callback: () => {
            this.timerText.text = formatTime(Math.floor(this.time.now * .001));
        }, loop: true });

        this.input.on('pointerdown', (pointer: any) => {
            if (!this.isMoving) {
                this.isMoving = true;

                this.physics.moveTo(this.currentBubble, pointer.x, pointer.y, 600);
            }
        });
    }

    populateBoard(): void {
        let x = 16;
        let y = 48;

        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const bubble = this.physics.add.image(x, y, 'bubble');
                bubble.tint = Phaser.Utils.Array.GetRandom(TINT_COLORS);
                this.bubbles.add(bubble);
                
                this.grid.set(row, col, bubble);
                
                x += IMAGE_SIZE;
            }

            x = 16;
            y += 32;
        }
    }

    createNewBubble(color?: number) {
        this.currentBubble = this.physics.add.image(WIDTH / 2, HEIGHT - 16, 'bubble');
        this.currentBubble.tint = color ?? this.nextBubble.tint;
        this.currentBubble.setCollideWorldBounds(true);
        this.currentBubble.setBounce(1);

        this.physics.add.overlap(this.currentBubble, this.bubbles, (current: any, touched: any) => {
            const row = Math.floor((touched.y) / 32);
            const col = Math.round((current.x - 16) / 32);

            const bubble = this.physics.add.image(16 + col * 32, 48 + row * 32, 'bubble');
            bubble.tint = this.currentBubble.tint;
            this.bubbles.add(bubble);

            this.grid.set(row, col, bubble);

            this.currentBubble.body.stop();
            this.currentBubble.destroy();

            const connected = this.grid.getConnected(row, col, bubble.tint);

            if (connected.length >= MIN_BUBBLES_TO_POP) {
                connected.forEach(item => {
                    item.bubble.destroy();

                    this.grid.set(item.row, item.col, null);
                });

                this.data.inc('pts', connected.length * POINTS_PER_BUBBLE);

                this.scoreText.text = this.data.get('pts').toString();
            }

            this.createNewBubble();

            this.nextBubble.tint = Phaser.Utils.Array.GetRandom(TINT_COLORS);

            this.isMoving = false;

            console.log(this.grid.maxRow())
            this.grid.table()
        });
    }
}