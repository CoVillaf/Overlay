import React from "react";
import { connect } from "react-redux";

import { actions } from "../actions";

import ObsConnectControls from "./ObsConnectControls";
import ObsDisconnectControls from "./ObsDisconnectControls";

import "./ObsControls.css";

const ObsControls = ({
}) => {
    return <div className="ObsControls">
        <h3>OBS:</h3>
        <ObsConnectControls />
        <ObsDisconnectControls />
    </div>;
}

const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch, ownProps) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ObsControls);

