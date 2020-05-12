import React, { useEffect } from "react";
import { connect } from "react-redux";

import { actions } from "../actions";

import profileImagePlaceholder from "./profile-image-placeholder.png";

import "./ControlPanelHeader.css";

const ControlPanelHeader = ({
    channelName,
    onRequestChannelInfo,
    onRequestConfiguration,
    profileImageUrl,
    token,
}) => {
    useEffect(
        () => {
            if (channelName == null) {
                onRequestConfiguration();
            }
        },
        [
            channelName,
            onRequestConfiguration,
        ]
    );
    useEffect(
        () => {
            if (
                !profileImageUrl
                && (token != null)
            ) {
                onRequestChannelInfo();
            }
        },
        [
            onRequestChannelInfo,
            profileImageUrl,
            token,
        ]
    );
    if (channelName == null) {
        return null;
    }
    return (
        <h2 className="ControlPanelHeader">
            <img
                src={
                    profileImageUrl
                    ? profileImageUrl
                    : profileImagePlaceholder
                }
                alt={`${channelName} profile`}
                className="ControlPanelHeader-profile-image"
            />
            <div>
                <div className="ControlPanelHeader-stream-name">{channelName}</div>
                <div>Stream Control Panel</div>
            </div>
        </h2>
    );
}

const mapStateToProps = (state, ownProps) => ({
    channelName: (
        state.app.configuration
        ? state.app.configuration.channel
        : null
    ),
    profileImageUrl: state.app.profileImageUrl,
    token: state.app.token,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onRequestChannelInfo: () => dispatch(actions.RequestChannelInfo()),
    onRequestConfiguration: () => dispatch(actions.RequestConfiguration()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlPanelHeader);

