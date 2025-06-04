export class Grid {
    #rows: number;
    #cols: number;
    #maxRows: number;

    #board: Array<Array<Phaser.Types.Physics.Arcade.ImageWithDynamicBody | null>>;

    constructor(rows: number, cols: number, maxRows: number) {
        this.#rows = rows;
        this.#cols = cols;
        this.#maxRows = maxRows;

        this.#board = Array.from({ length: maxRows }, () => Array(cols).fill(null));
    }

    set(row: number, col: number, bubble: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | null): void {
        this.#board[row][col] = bubble;
    }

    get(row: number, col: number): Phaser.Types.Physics.Arcade.ImageWithDynamicBody | null {
        return this.#board[row][col];
    }

    maxRow(): number {
        let max = 0;

        this.table();

        for (let row = 0; row < this.#board.length; row++) {
            if (this.#board[row].some(cell => cell !== null)) max = row;
        }

        return max + 1;
    }

    table(): void {
        console.table(this.#board)
    }

    // algoritme dfs
    getConnected(startRow: number, startCol: number, tint: number): Array<IConnected> {
        const visited = new Set<string>();
        const connected: Array<IConnected> = [];

        const dfs = (row: number, col: number) => {
            if (row < 0 || row >= this.#board.length || col < 0 || col >= this.#board[0].length) return;

            const bubble = this.#board[row][col];
            const key = `${row},${col}`;

            if (!bubble || bubble.tint !== tint || visited.has(key)) return;
            
            visited.add(key);
            connected.push({ row, col, bubble });

            dfs(row - 1, col);
            dfs(row + 1, col);
            dfs(row, col - 1);
            dfs(row, col + 1);
        }

        dfs(startRow, startCol);

        return connected;
    }
}

interface IConnected {
    row: number;
    col: number;
    bubble: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
}