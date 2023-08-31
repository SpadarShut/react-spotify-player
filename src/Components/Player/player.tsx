import { createContext, PropsWithChildren, useCallback, useContext, useState } from 'react';
import shuffle from 'lodash.shuffle';
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
  const [ displayedPlaylist, _setDisplayedPlaylist] = useState<Track[]>([]);
  const [ sourcePlaylist, setSourcePlaylist ] = useState<Track[]>([]);
  const [ isShuffled, setIsShuffled] = useState(false);
  const [ currentTrack, _setCurrentTrack ] = useState<{ track: Track, index: number } | null>(null);
  const [ isPlaying, setIsPlaying ] = useState(false);

  const setCurrentTrack = useCallback((trackId: string | null, list = displayedPlaylist) => {
    if (!trackId) {
      _setCurrentTrack(null);
      return;
    }
    const track = list.find((track) => track.id === trackId);
    if (track) {
      _setCurrentTrack({
        track,
        index: list.indexOf(track)
      });
      return track;
    }
  }, [displayedPlaylist]);

  const setPlayList = useCallback((tracks: Track[]) => {
    const playlist = isShuffled ? shuffle(tracks) : tracks;
    setCurrentTrack(playlist[0]?.id, playlist);
    setSourcePlaylist(tracks);
    _setDisplayedPlaylist(playlist);
  }, [isShuffled, setCurrentTrack])

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
      play(displayedPlaylist[0].id);
    } else {
      setIsPlaying((playing) => !playing);
    }
  }, [currentTrack, play, displayedPlaylist]);

  const playNext = useCallback(() => {
    if (!currentTrack) {
      play(displayedPlaylist[0].id);
    } else {
      const nextTrack = displayedPlaylist[currentTrack.index + 1];
      if (nextTrack) {
        play(nextTrack.id);
      }
    }
  }, [currentTrack, play, displayedPlaylist]);

  const playPrev = useCallback(() => {
    if (currentTrack) {
      const prevTrack = displayedPlaylist[currentTrack.index - 1];
      if (prevTrack) {
        play(prevTrack.id);
      }
    } else {
      play(displayedPlaylist[0].id);
    }
  }, [currentTrack, displayedPlaylist, play]);

  const toggleShuffle = useCallback(() => {
    setIsShuffled(shuffled => !shuffled);

    if (isShuffled) {
      _setDisplayedPlaylist(sourcePlaylist);
      if (currentTrack) {
        setCurrentTrack(currentTrack.track.id, sourcePlaylist)
      }
    } else {
      if (currentTrack) {
        // keep current track first after shuffling
        const toShuffle = [...displayedPlaylist]
        toShuffle.splice(currentTrack.index, 1);
        _setDisplayedPlaylist([
          currentTrack.track,
          ...shuffle(toShuffle)
        ]);
        setCurrentTrack(currentTrack.track.id);
      } else {
        const shuffled = shuffle(displayedPlaylist);
        _setDisplayedPlaylist(shuffled);
        setCurrentTrack(shuffled[0]?.id);
      }
    }
  }, [currentTrack, displayedPlaylist, isShuffled, setCurrentTrack, sourcePlaylist]);

  return {
    isPlaying,
    playList: displayedPlaylist,
    currentTrack,
    togglePlay,
    setPlayList,
    setCurrentTrack,
    play,
    pause,
    playNext,
    playPrev,
    toggleShuffle,
    isShuffled
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
