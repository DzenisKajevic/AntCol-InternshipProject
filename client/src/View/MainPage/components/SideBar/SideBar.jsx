import React from "react";
import "./sideBar.css";
import "../../../../variables.css";

const SideBar = () => {
  return (
    <aside>
      <img src="" alt="application logo" />
      <nav>
        <ul>
          <li>home</li>
          <li>search</li>

          <li>create playlist</li>
          {/* some of users playlists render if they exist */}
          <li>favorite</li>
          {/* after this maybe add some footer links or some other links */}
          {/* this side bar will have sticky position  */}
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;
