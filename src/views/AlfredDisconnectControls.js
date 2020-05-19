import React from "react";
import { connect } from "react-redux";

import { actions } from "../actions";

import "./AlfredDisconnectControls.css";

const AlfredDisconnectControls = ({
    connectedToAlfred,
    onDisconnectFromAlfred,
}) => {
    if (!connectedToAlfred) {
        return null;
    }
    return <button
        className="AlfredDisconnectControls"
        type="button"
        onClick={() => onDisconnectFromAlfred()}
    >
        Disconnect
    </button>;
}

const mapStateToProps = (state, ownProps) => ({
    connectedToAlfred: state.app.connectedToAlfred,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onDisconnectFromAlfred: () => {
        dispatch(actions.ClearAlfredError());
        dispatch(actions.DisconnectFromAlfred());
    },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlfredDisconnectControls);

