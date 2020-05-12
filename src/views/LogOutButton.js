import React from "react";
import { connect } from "react-redux";

import { actions } from "../actions";

import "./LogOutButton.css";

const LogOutButton = ({
    onRevokeToken,
    token,
}) => {
    if (token == null) {
        return null;
    }
    return (
        <button
            className="LogOutButton"
            type="button"
            onClick={() => onRevokeToken()}
        >
            Log Out
        </button>
    );
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
)(LogOutButton);

