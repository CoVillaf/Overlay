import React, { useState } from "react";
import { connect } from "react-redux";
import classNames from "classnames";

import { actions } from "../actions";

import PathBar from "./PathBar";

import "./DataEditor.css";

const keyInputSize = 10;
const valueInputSize = 80;

const DataEditor = ({
    connectedToAlfred,
    data,
    onAddValue,
    onChangeValue,
    onSetPath,
    path,
}) => {
    const onSelectPathElement = (index) => {
        onSetPath(path.slice(0, index));
    };
    const [ newKey, setNewKey ] = useState("");
    const [ newValue, setNewValue ] = useState("");
    if (!connectedToAlfred) {
        return null;
    }
    const onChangeField = setter => event => setter(event.target.value);
    const isValidJSON = (value) => {
        try {
            JSON.parse(value);
            return true;
        } catch (e) {
            return false;
        }
    };
    const innerObject = path.reduce(
        (d, n) => d && (d[0] !== "value") && d[1][n],
        data
    );
    if (
        (innerObject == null)
        || (innerObject[0] === "value")
    ) {
        return null;
    }
    const keyExists = keyToFind => Object.keys(innerObject[1]).some(
        key => key === keyToFind
    );
    const rows = Object.entries(innerObject[1]).map(
        ([key, [type, value]]) => (
            <tr key={key}>
                <td>{key}</td>
                <td>{(
                    (type === "value")
                    ? <input
                        type="text"
                        className={classNames({
                            "input-validated": true,
                            "input-invalid": !isValidJSON(value),
                        })}
                        size={valueInputSize}
                        value={value}
                        onChange={(event) => onChangeValue(key, event.target.value)}
                    />
                    : <span>{`(${type})`}</span>
                )}</td>
                <td>{(
                    (type === "value")
                    ? null
                    : <button
                        type="button"
                        onClick={() => onSetPath([...path, key])}
                    >
                        Edit
                    </button>
                )}</td>
            </tr>
        )
    );
    return (
        <div className="DataEditor">
            <PathBar
                onSelectElement={onSelectPathElement}
                path={path}
            />
            <table>
                <thead>
                    <tr>
                        <th>Key</th>
                        <th>Value</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                    <tr>
                        <td>
                            <input
                                type="text"
                                size={keyInputSize}
                                className={classNames({
                                    "input-validated": true,
                                    "input-invalid": keyExists(newKey),
                                })}
                                value={newKey}
                                onChange={onChangeField(setNewKey)}
                            />
                        </td>
                        <td>
                            <input
                                type="text"
                                size={valueInputSize}
                                className={classNames({
                                    "input-validated": true,
                                    "input-invalid": !isValidJSON(newValue),
                                })}
                                value={newValue}
                                onChange={onChangeField(setNewValue)}
                            />
                        </td>
                        <td>
                            <button
                                type="button"
                                onClick={() => {
                                    if (newKey.length === 0) {
                                        return;
                                    }
                                    if (keyExists(newKey)) {
                                        return;
                                    }
                                    if (!isValidJSON(newValue)) {
                                        return;
                                    }
                                    onAddValue(newKey, newValue);
                                    setNewKey("");
                                    setNewValue("");
                                }}
                            >
                                Add
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

const mapStateToProps = (state, ownProps) => ({
    connectedToAlfred: state.app.connectedToAlfred,
    data: state.dataEditor.data,
    path: state.dataEditor.path,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onAddValue: (key, value) => {},
    onChangeValue: (key, value) => {},
    onSetPath: (path) => dispatch(actions.SelectDataEditorPath({path})),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataEditor);

