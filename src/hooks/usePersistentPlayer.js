import { useEffect } from 'react';
import { usePlayerStore } from '../store/index.js';

export const usePersistentPlayer = () => {
  const {
    queue,
    currentIndex,
    audioElement,
    setAudioElement,
    updateTime,
    updateDuration,
    isPlaying,
  } = usePlayerStore();

  useEffect(() => {
    if (!audioElement) {
      const audio = new Audio();
      audio.addEventListener('timeupdate', () => {
        updateTime(audio.currentTime);
      });
      audio.addEventListener('loadedmetadata', () => {
        updateDuration(audio.duration);
      });
      audio.addEventListener('ended', () => {
        usePlayerStore.getState().next();
      });
      setAudioElement(audio);
    }
  }, []);

  useEffect(() => {
    if (queue.length > 0 && audioElement) {
      const currentSong = queue[currentIndex];
      if (currentSong) {
        audioElement.src = currentSong.audio_url;
        if (isPlaying) {
          audioElement.play();
        }
      }
    }
  }, [currentIndex, queue]);

  return { audioElement };
};
