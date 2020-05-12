import React from "react";
import { connect } from "react-redux";

import { actions } from "../actions";

import Glitch_White_RGB from "./Glitch_White_RGB.svg";

import "./LogInButton.css";

const LogInButton = ({
    onRequestToken,
    token,
}) => {
    if (token != null) {
        return null;
    }
    return (
        <button
            className="LogInButton"
            type="button"
            onClick={() => onRequestToken()}
        >
            <img src={Glitch_White_RGB} height="20px" alt=""/>
            <span>Log In With Twitch</span>
        </button>
    );
}

const mapStateToProps = (state, ownProps) => ({
    token: state.app.token,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onRequestToken: () => dispatch(actions.RequestToken()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogInButton);

