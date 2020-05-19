import React from "react";

import AlfredConnectControls from "./AlfredConnectControls";
import AlfredDisconnectControls from "./AlfredDisconnectControls";

import "./AlfredControls.css";

const AlfredControls = () => {
    return <div className="AlfredControls">
        <h3>Alfred:</h3>
        <AlfredConnectControls />
        <AlfredDisconnectControls />
    </div>;
}

export default AlfredControls;

