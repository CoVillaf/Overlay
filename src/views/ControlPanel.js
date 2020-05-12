import React from "react";

import ControlPanelHeader from "./ControlPanelHeader";
import LogInButton from "./LogInButton";
import LogOutButton from "./LogOutButton";
import UserWelcome from "./UserWelcome";

import "./ControlPanel.css";

const ControlPanel = () => {
    return (
        <div className="ControlPanel">
            <div className="ControlPanel-content">
                <ControlPanelHeader />
                <LogInButton />
                <UserWelcome />
                <LogOutButton />
                <p>
                    Interesting and useful controls will go here soon™!
                </p>
            </div>
        </div>
    );
}

export default ControlPanel;

