import React, { useEffect } from "react";
import { connect } from "react-redux";

import { actions } from "../actions";

const UserWelcome = ({
    onRequestUserInfo,
    userId,
    userName,
}) => {
    useEffect(
        () => {
            if (
                (userName == null)
                && (userId != null)
                && (onRequestUserInfo != null)
            ) {
                onRequestUserInfo();
            }
        },
        [
            onRequestUserInfo,
            userId,
            userName
        ]
    );
    if (userName == null) {
        return null;
    }
    return (
        <p className="UserWelcome">
            Welcome, {userName}!
        </p>
    );
}

const mapStateToProps = (state, ownProps) => ({
    userId: state.app.userId,
    userName: state.app.userName,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onRequestUserInfo: () => dispatch(actions.RequestUserInfo()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserWelcome);

