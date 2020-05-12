import React from "react";
import { connect } from "react-redux";

import { actions } from "../actions";

import Glitch_White_RGB from "./Glitch_White_RGB.svg";

import "./LogInControls.css";

const LogInControls = ({
    onRequestToken,
    token,
}) => {
    if (token != null) {
        return null;
    }
    return <div className="LogInControls">
        <button
            className="LogInControls-button"
            type="button"
            onClick={() => onRequestToken()}
        >
            <img src={Glitch_White_RGB} height="20px" alt=""/>
            <span>Log In With Twitch</span>
        </button>
    </div>;
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
)(LogInControls);

