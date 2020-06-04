import { actionTypes, actions } from "../actions";

const SendToAlfred = ({
    enhancements,
    message,
}) => {
    const { ws } = enhancements;
    ws.send(JSON.stringify(message));
};

const OnConnectedToAlfred = ({
    enhancements,
    getState,
}) => {
    const key = getState().app.key;
    const twitchOAuthToken = getState().app.twitchOAuthToken;
    const message = {
        type: "Authenticate",
    };
    if (twitchOAuthToken) {
        message.twitch = twitchOAuthToken;
    } else if (key) {
        message.key = key;
    } else {
        return;
    }
    SendToAlfred({enhancements, message});
};

const messageActionFactories = {
    Authenticated: () => actions.AuthenticatedWithAlfred(),
    Error: ({message}) => actions.SetAlfredError({error: message}),
};

const OnConnectToAlfred = ({
    action,
    dispatch,
    enhancements,
    getState,
}) => {
    if (
        getState().app.connectedToAlfred
        || getState().app.connectingToAlfred
    ) {
        return;
    }
    const configuration = getState().app.configuration;
    if (!configuration) {
        dispatch(actions.RequestConfiguration({then: action}));
        return;
    }
    dispatch(actions.ClearAlfredError());
    dispatch(actions.ConnectingToAlfred());
    const ws = new WebSocket(configuration.alfredWsEndpoint);
    enhancements.ws = ws;
    ws.addEventListener(
        'open',
        (event) => {
            console.log("Connected to Alfred");
            dispatch(actions.ConnectedToAlfred());
        }
    );
    ws.addEventListener(
        'close',
        (event) => {
            console.log("Disconnected from Alfred");
            if (enhancements.ws) {
                if (getState().app.connectingToAlfred) {
                    dispatch(actions.SetAlfredError({error: "Failed to connect"}));
                } else if (getState().app.alfredError == null) {
                    dispatch(actions.SetAlfredError({error: "Unexpectedly disconnected"}));
                }
            }
            enhancements.ws = null;
            dispatch(actions.DisconnectedFromAlfred());
        }
    );
    ws.addEventListener(
        'message',
        (event) => {
            const decodedMessage = JSON.parse(event.data);
            const messageActionFactory = messageActionFactories[decodedMessage.type];
            if (messageActionFactory) {
                dispatch(messageActionFactory(decodedMessage));
            } else {
                console.warn("Unknown message type received from Alfred:", decodedMessage);
            }
        }
    );
};

const OnDisconnectFromAlfred = ({
    dispatch,
    enhancements,
}) => {
    const { ws } = enhancements;
    if (!ws) {
        return;
    }
    console.log("Disconnecting from Alfred");
    ws.close();
    enhancements.ws = null;
    dispatch(actions.DisconnectedFromAlfred());
};

const OnSetAlfredError = ({
    action: { error }
}) => {
    console.warn("Alfred reported error:", error);
};

const OnSetKey = ({
    dispatch,
}) => {
    dispatch(actions.ConnectToAlfred());
};

const actionHandlers = {
    [actionTypes.ConnectedToAlfred]: OnConnectedToAlfred,
    [actionTypes.ConnectToAlfred]: OnConnectToAlfred,
    [actionTypes.DisconnectFromAlfred]: OnDisconnectFromAlfred,
    [actionTypes.SetAlfredError]: OnSetAlfredError,
    [actionTypes.SetKey]: OnSetKey,
};

export default function({ getState, dispatch }) {
    const enhancements = {
        ws: null,
    };
    return next => action => {
        next(action);
        const handler = actionHandlers[action.type];
        if (handler) {
            // @ts-ignore
            handler({action, dispatch, enhancements, getState});
        }
    };
};
