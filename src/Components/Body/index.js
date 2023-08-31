import React, { useEffect } from 'react';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import PauseCircleFilled from '@material-ui/icons/PauseCircleFilled';

import SongRow from '../SongRow';
import Header from '../Header';

import { usePlayer } from '../Player/player';
import { discoverWeeklyData, discoverWeeklyTracks } from '../../shared/api';

import './body.styles.css';

function Body() {
  const {setPlayList, isPlaying, currentTrack, playList, play, togglePlay} = usePlayer();

  useEffect(() => {
    setPlayList(discoverWeeklyTracks);
  }, []);

  useEffect(() => {
    if (currentTrack) {
      const element = document.querySelector(`[data-track-id="${currentTrack.track.id}"]`);
      element?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [currentTrack]);

  return (
    <main className="body">
      <Header />
      <div className="body_info">
        <img src={discoverWeeklyData.images[0]?.url} alt="" />
        <div className="body_infoText">
          <strong>Playlist</strong>
          <h2>Discover weekly</h2>
          <p>{discoverWeeklyData.description}</p>
        </div>
      </div>
      <div className="body_songs">
        <div className="body_icons">
          <button
            className="body_playBtn"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause current" : "Play current"}
          >
            {isPlaying
              ? <PauseCircleFilled  />
              : <PlayCircleFilledIcon />
            }
          </button>
          <FavoriteIcon fontSize="large" />
          <MoreHorizIcon />
        </div>
        {/* List of songs */}
        <ul className="body_list">
          {playList.map((track) => {
            const isCurrent = currentTrack?.track.id === track.id;
            return (
              <li
                key={track.id}
                aria-current={isCurrent}
              >
                <SongRow
                  track={track}
                  data-track-id={track.id}
                  isCurrent={isCurrent}
                  onClick={() => {
                    play(track.id);
                  }}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}

export default Body;
