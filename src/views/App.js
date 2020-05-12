import React, { useEffect } from "react";
import { connect } from "react-redux";

import { actions } from "../actions";

import ControlPanel from "./ControlPanel";
import Overlay from "./Overlay";

const useOnceEffect = fn => useEffect(fn, []);

const App = ({
    control,
    onLoad,
}) => {
    useOnceEffect(() => {
        onLoad();
    });
    return (
        control
        ? <ControlPanel />
        : <Overlay />
    );
}

const mapStateToProps = (state, ownProps) => ({
    control: state.app.control,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onLoad: () => dispatch(actions.Load()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

