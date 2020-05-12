import React, { useState } from "react";
import { connect } from "react-redux";

import { actions } from "../actions";

import "./ObsConnectControls.css";

const ObsConnectControls = ({
    authenticatedWithObs,
    connectedToObs,
    connectingToObs,
    obsError,
    obsPassword,
    onConnectToObs,
}) => {
    const [ newObsPassword, setNewObsPassword ] = useState(obsPassword);
    if (authenticatedWithObs) {
        return <div>
            Authenticated!
        </div>;
    }
    if (connectedToObs) {
        if (obsError == null) {
            return <div>
                Connected
            </div>;
        } else {
            return <div>
                Connected -- <span className="error-message">{obsError}</span>
            </div>;
        }
    }
    if (connectingToObs) {
        return <div>
            Connecting to OBS...
        </div>;
    }
    return <div className="ObsConnectControls">
        <button
            className="ObsConnectControls-button"
            type="button"
            onClick={() => onConnectToObs(newObsPassword)}
        >
            Connect
        </button>
        <input
            type="password"
            placeholder="password"
            value={newObsPassword}
            onChange={(event) => setNewObsPassword(event.target.value)}
        />
        {(
            (obsError == null)
            ? null
            : <span className="error-message">{obsError}</span>
        )}
    </div>;
}

const mapStateToProps = (state, ownProps) => ({
    authenticatedWithObs: state.app.authenticatedWithObs,
    connectedToObs: state.app.connectedToObs,
    connectingToObs: state.app.connectingToObs,
    obsError: state.app.obsError,
    obsPassword: state.app.obsPassword,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onConnectToObs: (password) => dispatch(actions.ConnectToObs({password})),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ObsConnectControls);

