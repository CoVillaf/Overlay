import React, { useEffect } from "react";
import { connect } from "react-redux";

import { actions } from "../actions";

import profileImagePlaceholder from "./profile-image-placeholder.png";

import "./ControlPanelHeader.css";

const ControlPanelHeader = ({
    onRequestProfile,
    profileImageUrl,
}) => {
    useEffect(
        () => {
            if (!profileImageUrl) {
                onRequestProfile();
            }
        },
        [
            onRequestProfile,
            profileImageUrl
        ]
    );
    return (
        <h2 className="ControlPanelHeader">
            <img
                src={
                    profileImageUrl
                    ? profileImageUrl
                    : profileImagePlaceholder
                }
                alt="rhymu8354 profile"
                className="ControlPanelHeader-profile-image"
            />
            <div>
                <div className="ControlPanelHeader-stream-name">rhymu8354</div>
                <div>Stream Control Panel</div>
            </div>
        </h2>
    );
}

const mapStateToProps = (state, ownProps) => ({
    profileImageUrl: state.app.profileImageUrl,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onRequestProfile: () => dispatch(actions.RequestProfile()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlPanelHeader);

