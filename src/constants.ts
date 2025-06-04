export const COLS: number = 15;
export const ROWS: number = 7;
export const MAX_ROWS: number = 11;

export const IMAGE_SIZE: number = 32;
export const POINTS_PER_BUBBLE: number = 200;
export const MIN_BUBBLES_TO_POP: number = 3;

export const TINT_COLORS: Array<number> = [
    0xff0000, // rojo
    0x00ff00, // verde
    0x0000ff, // azul
    0xffff00, // amarillo (nuevo)
    0xff00ff  // magenta (nuevo)
];

export const SPECIAL_BUBBLE_COLOR = 0xff00ff; 
export const WIDTH: number = COLS * IMAGE_SIZE;
export const HEIGHT: number = MAX_ROWS * 32 + 48 + 100;