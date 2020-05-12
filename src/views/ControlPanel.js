import React from "react";
import { connect } from "react-redux";

// import { actions } from "../actions";

import ControlPanelHeader from "./ControlPanelHeader";

import "./ControlPanel.css";

const ControlPanel = () => {
    return (
        <div className="ControlPanel">
            <div className="ControlPanel-content">
                <ControlPanelHeader />
                <p>
                    Interesting and useful controls will go here soon™!
                </p>
            </div>
        </div>
    );
}

const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch, ownProps) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlPanel);

