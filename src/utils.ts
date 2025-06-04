import { TINT_COLORS } from './constants';

export const formatTime = (time: number): string => {
    const hrs = Math.floor(time / 3600).toString().padStart(2, '0');
    const mins = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
    const secs = (time % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
};

export function getSettingsByDifficulty(): { colors: number[], specials: number } {
    const dificultat = localStorage.getItem('dificultatSeleccionada') || 'dificil';
    switch (dificultat) {
        case 'facil':
            return { colors: TINT_COLORS.slice(0, 3), specials: 3 };
        case 'mitjana':
            return { colors: TINT_COLORS.slice(0, 4), specials: 2 };
        case 'dificil':
        default:
            return { colors: TINT_COLORS, specials: 1 };
    }
}
