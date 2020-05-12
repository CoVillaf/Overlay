import React from "react";

import ObsConnectControls from "./ObsConnectControls";
import ObsDisconnectControls from "./ObsDisconnectControls";

import "./ObsControls.css";

const ObsControls = () => {
    return <div className="ObsControls">
        <h3>OBS:</h3>
        <ObsConnectControls />
        <ObsDisconnectControls />
    </div>;
}

export default ObsControls;

