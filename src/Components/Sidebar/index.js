import React from "react";
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";

import SidebarOption from "../SidebarOption";

import "./sidebar.styles.css";

function Sidebar() {
  const playlists = [];

  return (
    <div className="sidebar">
      <img
        className="sidebar_logo"
        src="https://getheavy.com/wp-content/uploads/2019/12/spotify2019-830x350.jpg"
        alt="Spotify Logo"
      />
      <SidebarOption key={"Home"} Icon={HomeIcon} title="Home" />
      <SidebarOption key={"Search"} Icon={SearchIcon} title="Search" />
      <SidebarOption
        key={"Your Library"}
        Icon={LibraryMusicIcon}
        title="Your Library"
      />
      <br />
      <strong className="sidebar_title">PLAYLISTS</strong>
      <hr />
      {playlists?.map((playlist) => (
        <SidebarOption key={playlist.name} title={playlist.name} />
      ))}
    </div>
  );
}

export default Sidebar;
