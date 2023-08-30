import React from "react";

import Sidebar from "../Sidebar";
import Body from "../Body";
import Footer from "../Footer";

import "./player.styles.css";

function Player() {
  return (
    <div className="player">
      <div className="player_body">
        {/* Sidebar */}
        <Sidebar />
        {/* Body */}
        <Body />
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Player;
