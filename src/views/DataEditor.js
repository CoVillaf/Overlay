import React from "react";
import { connect } from "react-redux";

import { actions } from "../actions";

import PathBar from "./PathBar";

import "./DataEditor.css";

const DataEditor = ({
    connectedToAlfred,
    onSetDataEditorPath,
    path,
}) => {
    if (!connectedToAlfred) {
        return null;
    }
    const onSelectPathElement = (index) => {
        onSetDataEditorPath(path.slice(0, index));
    };
    return (
        <div className="DataEditor">
            <PathBar
                onSelectElement={onSelectPathElement}
                path={path}
            />
        </div>
    );
}

const mapStateToProps = (state, ownProps) => ({
    connectedToAlfred: state.app.connectedToAlfred,
    path: state.dataEditor.path,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSetDataEditorPath: (path) => dispatch(actions.SelectDataEditorPath({path})),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataEditor);

