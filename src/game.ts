import Phaser from 'phaser';
import { formatTime, getSettingsByDifficulty } from './utils';
import { Grid } from './grid';
import { COLS, HEIGHT, IMAGE_SIZE, MAX_ROWS, ROWS, WIDTH, SPECIAL_BUBBLE_COLOR, POINTS_PER_BUBBLE, MIN_BUBBLES_TO_POP } from './constants';

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
        this.load.image('bubble', 'bubble.png');
    }

    getActiveColors(): number[] {
        const colorSet = new Set<number>();
        for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
                const bubble = this.grid.get(row, col);
                if (bubble && bubble.tint !== SPECIAL_BUBBLE_COLOR) {
                    colorSet.add(bubble.tint);
                }
            }
        }
        return Array.from(colorSet);
    }

    create() {
        const settings = getSettingsByDifficulty();
        this.specialBubblesLeft = settings.specials;

        this.specialIndicator = this.add.text(WIDTH - 120, 16, `Especials: ${this.specialBubblesLeft}`, {
            color: '#ffffff'
        });

        this.data.set('pts', 0);

        this.timerText = this.add.text(0, 16, formatTime(0));
        this.timerText.x = WIDTH / 2 - this.timerText.width / 2;

        this.scoreText = this.add.text(16, 16, '0', { color: '#ffffff' });

        this.bubbles = this.physics.add.group();

        this.populateBoard();

        this.createNewBubble(Phaser.Utils.Array.GetRandom(settings.colors));
        this.nextBubble = this.add.image(16, HEIGHT - 16, 'bubble');
        this.nextBubble.tint = Phaser.Utils.Array.GetRandom(settings.colors);

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

    checkGameEnd() {
        if (this.grid.maxRow() > MAX_ROWS - 1) {
            this.gameOver(false);
            return;
        }

        if (this.bubbles.countActive(true) === 0) {
            this.gameOver(true);
        }
    }

    gameOver(win: boolean) {
        this.physics.pause();
        this.timer.paused = true;

        const msg = win ? 'Has guanyat!' : 'Has perdut!';
        this.add.text(WIDTH / 2, HEIGHT / 2, msg, {
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        this.input.off('pointerdown');
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
        const isSpecial = Math.random() < 0.1 && this.specialBubblesLeft > 0;
        const bubbleColor = isSpecial
            ? SPECIAL_BUBBLE_COLOR
            : (color ?? this.nextBubble.tint);

        this.currentBubble = this.physics.add.image(WIDTH / 2, HEIGHT - 16, 'bubble');
        this.currentBubble.tint = bubbleColor;
        this.currentBubble.setCollideWorldBounds(true);
        this.currentBubble.setBounce(1);

        this.physics.add.overlap(this.currentBubble, this.bubbles, (current: any, touched: any) => {
            const row = Math.floor(touched.y / 32);
            const col = Math.round((current.x - 16) / 32);

            // No permitir colocar fuera del grid
            if (row >= MAX_ROWS || row < 0 || col < 0 || col >= COLS) {
                this.currentBubble.body.stop();
                this.currentBubble.destroy();
                this.isMoving = false;
                this.gameOver(false);
                return;
            }

            const bubble = this.physics.add.image(16 + col * 32, 48 + row * 32, 'bubble');
            bubble.tint = this.currentBubble.tint;

            const setSuccess = this.grid.set(row, col, bubble);
            if (!setSuccess) {
                this.currentBubble.body.stop();
                this.currentBubble.destroy();
                this.isMoving = false;
                return;
            }

            this.bubbles.add(bubble);
            this.currentBubble.body.stop();
            this.currentBubble.destroy();

            if (bubble.tint === SPECIAL_BUBBLE_COLOR && this.specialBubblesLeft > 0) {
                this.destroyRow(row);
                this.destroyCol(col);
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
                    this.scoreText.setText(this.data.get('pts').toString());
                }
            }

            this.createNewBubble();

            const activeColors = this.getActiveColors();
            this.nextBubble.tint = activeColors.length > 0
                ? Phaser.Utils.Array.GetRandom(activeColors)
                : Phaser.Utils.Array.GetRandom(getSettingsByDifficulty().colors);

            this.isMoving = false;
            this.checkGameEnd();
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

        this.data.inc('pts', COLS * POINTS_PER_BUBBLE);
        this.scoreText.setText(this.data.get('pts').toString());
    }

    destroyCol(col: number) {
        for (let row = 0; row < ROWS; row++) {
            const bubble = this.grid.get(row, col);
            if (bubble) {
                bubble.destroy();
                this.grid.set(row, col, null);
            }
        }

        this.data.inc('pts', ROWS * POINTS_PER_BUBBLE);
        this.scoreText.setText(this.data.get('pts').toString());
    }
}
