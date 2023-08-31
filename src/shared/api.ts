import data from "./../mocks/data.json";
import { Track } from './types';

// Normally, this would be an API call to a backend service

export const playLists = data.playlists.items;

export const discoverWeeklyTracks: Track[] = data.discover_weekly.tracks.items
  .filter((item) => item.track.album.id !== null)
  .map(({ track }) => {
    return ({
      id: track.id || Math.random().toString(36).substring(2),
      name: track.name || 'Untitled',
      artists: track.artists,
      album: track.album,
    });
  });

export const discoverWeeklyData = data.discover_weekly;
