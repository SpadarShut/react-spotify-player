import { createContext, PropsWithChildren, useCallback, useContext, useState } from 'react';
import { Track } from '../../shared/types';

export const playerContext = createContext<PlayerContextType>({} as PlayerContextType);

export const usePlayer = () => {
  const context = useContext(playerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}

const usePlayerImplementation = () => {
  const [ playList, _setPlayList] = useState<Track[]>([]);
  const [ currentTrack, _setCurrentTrack ] = useState<{ track: Track, index: number } | null>(null);
  const [ isPlaying, setIsPlaying ] = useState(false);

  const setCurrentTrack = useCallback((trackId: string | null) => {
    if (!trackId) {
      _setCurrentTrack(null);
      return;
    }
    const track = playList.find((track) => track.id === trackId);
    if (track) {
      _setCurrentTrack({
        track,
        index: playList.indexOf(track)
      });
      return track;
    }
  }, [playList]);

  const play = useCallback((trackId: string) => {
    const ok = setCurrentTrack(trackId);
    if (ok) {
      setIsPlaying(true);
    }
  }, [setCurrentTrack]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  },[]);

  const togglePlay = useCallback(() => {
    if (!currentTrack) {
      play(playList[0].id);
    } else {
      setIsPlaying((playing) => !playing);
    }
  }, [currentTrack, play, playList]);

  const playNext = useCallback(() => {
    if (!currentTrack) {
      play(playList[0].id);
    } else {
      const nextTrack = playList[currentTrack.index + 1];
      if (nextTrack) {
        play(nextTrack.id);
      }
    }
  }, [currentTrack, play, playList]);

  const playPrev = useCallback(() => {
    if (currentTrack) {
      const prevTrack = playList[currentTrack.index - 1];
      if (prevTrack) {
        play(prevTrack.id);
      }
    } else {
      play(playList[0].id);
    }
  }, [currentTrack, playList, play]);

  const setPlayList = useCallback((tracks: Track[]) => {
    _setPlayList(tracks);
    setCurrentTrack(tracks[0]?.id);
  }, [_setPlayList, setCurrentTrack])

  return {
    isPlaying,
    playList,
    currentTrack,
    togglePlay,
    setPlayList,
    setCurrentTrack,
    play,
    pause,
    playNext,
    playPrev,
  }
}

export type PlayerContextType = ReturnType<typeof usePlayerImplementation>;

export const PlayerProvider = ({ children }: PropsWithChildren) => {
  const player = usePlayerImplementation();
  return (
    <playerContext.Provider value={player}>
      {children}
    </playerContext.Provider>
  )
}
