export const formatTime = (time: number): string => {
    const hrs = Math.floor(time / 3600).toString().padStart(2, '0');
      const mins = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
      const secs = (time % 60).toString().padStart(2, '0');

      return `${hrs}:${mins}:${secs}`;
}