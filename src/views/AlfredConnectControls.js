import React, { useState } from "react";
import { connect } from "react-redux";

import { actions } from "../actions";

import "./AlfredConnectControls.css";

const AlfredConnectControls = ({
    alfredError,
    alfredKey,
    authenticated,
    connectedToAlfred,
    connectingToAlfred,
    onConnectToAlfred,
    onSetAlfredKey,
    twitchOAuthToken,
}) => {
    const [ newAlfredKey, setNewAlfredKey ] = useState(alfredKey);
    if (authenticated) {
        return <div>
            Authenticated!
        </div>;
    }
    if (connectedToAlfred) {
        if (alfredError == null) {
            return <div>
                Connected
            </div>;
        } else {
            return <div>
                Connected -- <span className="error-message">{alfredError}</span>
            </div>;
        }
    }
    if (connectingToAlfred) {
        return <div>
            Connecting to Alfred...
        </div>;
    }
    return <div className="AlfredConnectControls">
        <button
            className="AlfredConnectControls-button"
            type="button"
            onClick={() => {
                if (newAlfredKey !== alfredKey) {
                    onSetAlfredKey(newAlfredKey);
                }
                onConnectToAlfred();
            }}
        >
            Connect
        </button>
        {(
            twitchOAuthToken
            ? null
            : <input
                type="password"
                placeholder="key"
                value={newAlfredKey}
                onChange={(event) => setNewAlfredKey(event.target.value)}
            />
        )}
        {(
            (alfredError == null)
            ? null
            : <span className="error-message">{alfredError}</span>
        )}
    </div>;
}

const mapStateToProps = (state, ownProps) => ({
    alfredError: state.app.alfredError,
    alfredKey: state.app.key,
    authenticated: state.app.authenticatedWithAlfred,
    connectedToAlfred: state.app.connectedToAlfred,
    connectingToAlfred: state.app.connectingToAlfred,
    twitchOAuthToken: state.app.twitchOAuthToken,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onConnectToAlfred: () => dispatch(actions.ConnectToAlfred()),
    onSetAlfredKey: (key) => dispatch(actions.SetKey({key})),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AlfredConnectControls);

