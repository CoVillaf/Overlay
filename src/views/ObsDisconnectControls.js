import React from "react";
import { connect } from "react-redux";

import { actions } from "../actions";

import "./ObsDisconnectControls.css";

const ObsDisconnectControls = ({
    connectedToObs,
    onDisconnectFromObs,
}) => {
    if (!connectedToObs) {
        return null;
    }
    return <button
        className="ObsDisconnectControls"
        type="button"
        onClick={() => onDisconnectFromObs()}
    >
        Disconnect
    </button>;
}

const mapStateToProps = (state, ownProps) => ({
    connectedToObs: state.app.connectedToObs,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onDisconnectFromObs: () => {
        dispatch(actions.ClearObsError());
        dispatch(actions.DisconnectFromObs());
    },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ObsDisconnectControls);

