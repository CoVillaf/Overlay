import React, { useState } from "react";
import { connect } from "react-redux";

import { actions } from "../actions";

import "./AlfredConnectControls.css";

const AlfredConnectControls = ({
    alfredError,
    connectedToAlfred,
    connectingToAlfred,
    onConnectToAlfred,
}) => {
    if (connectedToAlfred) {
        if (alfredError == null) {
            return <div>
                Connected
            </div>;
        } else {
            return <div>
                Connected -- <span className="error-message">{alfredError}</span>
            </div>;
        }
    }
    if (connectingToAlfred) {
        return <div>
            Connecting to Alfred...
        </div>;
    }
    return <div className="AlfredConnectControls">
        <button
            className="AlfredConnectControls-button"
            type="button"
            onClick={() => onConnectToAlfred()}
        >
            Connect
        </button>
        {(
            (alfredError == null)
            ? null
            : <span className="error-message">{alfredError}</span>
        )}
    </div>;
}

const mapStateToProps = (state, ownProps) => ({
    alfredError: state.app.alfredError,
    connectedToAlfred: state.app.connectedToAlfred,
    connectingToAlfred: state.app.connectingToAlfred,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onConnectToAlfred: (password) => dispatch(actions.ConnectToAlfred({password})),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlfredConnectControls);

