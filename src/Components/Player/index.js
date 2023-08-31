import Sidebar from '../Sidebar';
import Body from '../Body';
import Footer from '../Footer';

import './player.styles.css';
import { PlayerProvider } from './context';

function Player() {
  return (
    <PlayerProvider>
      <div className="player">
        <div className="player_body">
          <Sidebar />
          <Body />
        </div>
        <Footer />
      </div>
    </PlayerProvider>
  );
}

export default Player;
