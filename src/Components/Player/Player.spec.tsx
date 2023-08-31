import { render as TLRender, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Player from './index';

import { discoverWeeklyTracks, playLists } from '../../shared/api'

function render() {
  const getContentRoot = () => screen.getByRole('main')
  const getPlayerRoot = () => screen.getByRole('region', { name: "Player controls"})
  const user = userEvent.setup();

  return {
    ...TLRender(<Player/>),
    user,
    get playerRoot() {
      return getPlayerRoot()
    },
    get contentRoot() {
      return getContentRoot()
    },
    get tracksList() {
      return within(getContentRoot()).getByRole('list');
    },
    get bodyPlayPauseBtn () {
      return within(getContentRoot()).getByRole('button', { name: /(play|pause) current/i })
    },
    get playerPlayPauseBtn () {
      return within(getPlayerRoot()).getByRole('button', { name: /(play|pause) current/i})
    },
    get prevTrackBtn() {
      return within(getPlayerRoot()).getByRole('button', { name: 'Skip to previous'})
    },
    get nextTrackBtn() {
      return within(getPlayerRoot()).getByRole('button', { name: 'Skip to next'})
    },
    get shuffleBtn() {
      return within(getPlayerRoot()).getByRole('button', { name: /shuffle/i})
    },
    get playerSongTitle() {
      return within(within(getPlayerRoot()).getByRole('figure')).getByRole('heading')
    },
    async clickTrack(name: string) {
      await user.click(within(getContentRoot()).getByRole('heading', { name }))
    }
  }
}

describe('Player page', () => {
  it('should show the list of playlists', () => {
    render()
    playLists.forEach((playlist) => {
      expect(screen.getByText(playlist.name)).toBeInTheDocument()
    })
  });

  it('should render the list of songs', () => {
    const { contentRoot } = render();
    const root = within(contentRoot)
    discoverWeeklyTracks.forEach(({ name}) => {
      expect(root.getByRole('heading', { name })).toBeInTheDocument()
    })
  });

  it('should indicate playing state', async () => {
    const { bodyPlayPauseBtn, contentRoot, clickTrack, playerRoot, playerPlayPauseBtn, user } = render();

    await user.click(bodyPlayPauseBtn);
    expect(bodyPlayPauseBtn).toHaveAccessibleName('Pause current');
    expect(playerPlayPauseBtn).toHaveAccessibleName('Pause current');
    const allSongs = within(contentRoot).getAllByRole('listitem');
    expect(allSongs[0]).toHaveAttribute('aria-current', "true")

    await user.click(playerPlayPauseBtn)
    expect(bodyPlayPauseBtn).toHaveAccessibleName('Play current');
    expect(playerPlayPauseBtn).toHaveAccessibleName('Play current');

    const nextTrack = discoverWeeklyTracks[1];
    await clickTrack(nextTrack.name);
    expect(within(playerRoot).getByRole('heading', { name: nextTrack.name})).toBeInTheDocument()
  });

  it('prev/next buttons should switch tracks and become disabled', async () => {
    const { prevTrackBtn, nextTrackBtn, playerSongTitle, user, clickTrack } = render();

    expect(prevTrackBtn).toBeDisabled();
    expect(nextTrackBtn).not.toBeDisabled();

    await user.click(nextTrackBtn);
    expect(prevTrackBtn).not.toBeDisabled();

    const nextTrack = discoverWeeklyTracks[1];
    expect(playerSongTitle).toHaveTextContent(nextTrack.name);

    await clickTrack(discoverWeeklyTracks.at(-1)!.name);
    expect(nextTrackBtn).toBeDisabled();
  });

  describe('shuffle', () => {
    it('should shuffle', async () => {
      const { shuffleBtn, user, tracksList } = render();

      expect(shuffleBtn).toHaveAccessibleName('Shuffle');
      await user.click(shuffleBtn);
      expect(shuffleBtn).toHaveAccessibleName('Unshuffle');

      const tracks = within(tracksList).getAllByRole('listitem')
      expect(tracks).toHaveLength(discoverWeeklyTracks.length);

      const somePositionsChanged = tracks.some((track, i) => {
        const defaultTrackAtIndex = discoverWeeklyTracks[i];
        return !within(track).queryByRole('heading', { name: defaultTrackAtIndex.name });
      })
      expect(somePositionsChanged).toBe(true);
    });

    it('should keep current track first after shuffling', async () => {
      const { shuffleBtn, user, clickTrack, playerSongTitle, tracksList } = render();

      const randomTrack = discoverWeeklyTracks[5];
      await clickTrack(randomTrack.name);
      expect(playerSongTitle.textContent).toBe(randomTrack.name);

      await user.click(shuffleBtn);

      const tracks = within(tracksList).getAllByRole('heading')
      expect(tracks[0]).toHaveTextContent(randomTrack.name)

      // clicking shuffle again should restore default order
      expect(shuffleBtn).toHaveAccessibleName('Unshuffle');
      await user.click(shuffleBtn);

      const unshuffledTracks = within(tracksList).getAllByRole('heading')
      const somePositionsChanged = unshuffledTracks.some((trackHeader, i) => {
        return trackHeader.textContent !== discoverWeeklyTracks[i].name;
      })
      expect(somePositionsChanged).toBe(false);
    });
  });
})
