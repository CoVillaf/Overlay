import React, { useEffect } from "react";
import { connect } from "react-redux";

import { actions } from "../actions";

import {
    APP_PAGE_CONTROL_PANEL,
    APP_PAGE_LOADING,
    APP_PAGE_OVERLAY,
} from "../constants";

import ControlPanel from "./ControlPanel";
import Loading from "./Loading";
import Overlay from "./Overlay";

const useOnceEffect = fn => useEffect(fn, []);

const pages = {
    [APP_PAGE_CONTROL_PANEL]: ControlPanel,
    [APP_PAGE_LOADING]: Loading,
    [APP_PAGE_OVERLAY]: Overlay,
};

const App = ({
    onLoad,
    page,
}) => {
    useOnceEffect(() => {
        onLoad();
    });
    const Page = pages[page];
    return <Page />;
}

const mapStateToProps = (state, ownProps) => ({
    page: state.app.page,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onLoad: () => dispatch(actions.Load()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

