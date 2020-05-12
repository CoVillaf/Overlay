import React from "react";
import { connect } from "react-redux";

import { actions } from "../actions";

import "./LogOutControls.css";

const LogOutControls = ({
    onRevokeToken,
    token,
}) => {
    if (token == null) {
        return null;
    }
    return <div className="LogOutControls">
        <button
            className="LogOutControls-button"
            type="button"
            onClick={() => onRevokeToken()}
        >
            Log Out
        </button>
    </div>;
}

const mapStateToProps = (state, ownProps) => ({
    token: state.app.token,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onRevokeToken: () => dispatch(actions.RevokeToken()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogOutControls);

