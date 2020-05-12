import React from "react";
import { connect } from "react-redux";

// import { actions } from "../actions";

import "./ControlPanel.css";

const ControlPanel = () => {
    return (
        <div className="ControlPanel">
            <div className="ControlPanel-content">
                <p>This is the Control Panel!</p>
                <p>
                    Here is some REALLY BIG TEXT that I'm using to make sure
                    overflow works correctly for the control panel.
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

