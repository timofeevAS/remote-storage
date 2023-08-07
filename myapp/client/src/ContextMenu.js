import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

function ContextMenu({ handleMenuItemClick,position}) {
  return (
    <div
      className="menu"
      style={{
        position:'absolute',
        top: position.y+"px",
        left: position.x+"px",
        background: "white",
        border: "1px solid #ccc",
        padding: "5px",
        borderRadius: "5px",
        height: "auto",
        width: "100px",
        zIndex: "1",
      }}
    >
      <div onClick={() => handleMenuItemClick("download")}>
        <FontAwesomeIcon icon={faDownload} className="DownloadIcon" size="sm" />
        Download
      </div>
      <div onClick={() => handleMenuItemClick("info")}>
        <FontAwesomeIcon icon={faDownload} className="DownloadIcon" size="sm" />
        Info
      </div>
      {/* Another functions */}
    </div>
  );
}

export default ContextMenu;