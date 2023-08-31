import React from "react";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import ShuffleIcon from "@material-ui/icons/Shuffle";
import RepeatIcon from "@material-ui/icons/Repeat";
import PlaylistPlayIcon from "@material-ui/icons/PlaylistPlay";
import VolumeDownIcon from "@material-ui/icons/VolumeDown";
import { Grid, Slider } from "@material-ui/core";
import { usePlayer } from '../Player/player';

import "./footer.styles.css";

function Footer() {
  const {
    currentTrack,
    isPlaying,
    playList,
    togglePlay,
    playNext,
    playPrev,
    toggleShuffle,
    isShuffled
  } = usePlayer();

  return (
    <aside className="footer" role="region" aria-label="Player controls">
      <div className="footer_body">
        <figure className="footer_left">
          {currentTrack && (
            <>
              <img
                className="footer_albumLogo"
                src={currentTrack.track.album.images[0].url}
                alt=""
              />
              <figcaption className="footer_songInfo">
                <h4 className="footer_songTitle">{currentTrack.track.name}</h4>
                <p className={"footer_songArtist"}>{currentTrack.track.artists[0].name}</p>
              </figcaption>
            </>
          )}
        </figure>
        <div className="footer_center">
          <button
            className="footer_btn"
            onClick={toggleShuffle}
            aria-label={ isShuffled ? 'Unshuffle' :'Shuffle'}
          >
            <ShuffleIcon className={isShuffled ? 'footer_green' : ''} />
          </button>
          <button
            className="footer_btn"
            disabled={!currentTrack?.index}
            onClick={playPrev}
            aria-label="Skip to previous"
          >
            <SkipPreviousIcon />
          </button>
          <button
            onClick={togglePlay}
            className="footer_btn"
            aria-label={isPlaying ? "Pause current" : "Play current"}
          >
          {
            isPlaying ? (
              <PauseCircleOutlineIcon
                fontSize="large"
                className="footer_icon"
              />
            ) : (
              <PlayCircleOutlineIcon fontSize="large" />
            )
          }
          </button>
          <button
            className="footer_btn"
            disabled={currentTrack?.index === playList.length - 1 || !playList.length}
            onClick={playNext}
            aria-label="Skip to next"
          >
            <SkipNextIcon/>
          </button>
          <button className="footer_btn" aria-label="Repeat">
            <RepeatIcon className="footer_green" />
          </button>
        </div>
        <div className="footer_right">
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <PlaylistPlayIcon />
            </Grid>
            <Grid item>
              <VolumeDownIcon />
            </Grid>
            <Grid item xs>
              <Slider />
            </Grid>
          </Grid>
        </div>
      </div>
    </aside>
  );
}

export default Footer;
