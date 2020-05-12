import { actionTypes, actions } from "../actions";

import {
    ArrayBufferToRawString,
    RawStringToArrayBuffer,
} from "../utilities";

const SendToObs = ({
    enhancements,
    extraFields,
    type,
}) => {
    if (extraFields == null) {
        extraFields = {};
    }
    const { nextMessageId, responsePromises, ws } = enhancements;
    ++enhancements.nextMessageId;
    return new Promise((resolve, reject) => {
        responsePromises.set(nextMessageId, { resolve, reject });
        ws.send(JSON.stringify({
            ...extraFields,
            "request-type": type,
            "message-id": nextMessageId.toString(),
        }));
    });
};

const OnConnectedToObs = ({
    dispatch,
    enhancements,
}) => {
    // @ts-ignore
    SendToObs({
        enhancements,
        type: "GetAuthRequired",
    })
        .then(response => {
            if (response.authRequired) {
                dispatch(actions.ObsAuthenticate({
                    challenge: response.challenge,
                    salt: response.salt,
                }));
            } else {
                console.log("OBS requires no authentication");
                dispatch(actions.ObsAuthenticated());
            }
        })
        .catch(error => {
            console.error("Error checking if authentication is required for OBS", error);
        });
};

const OnConnectToObs = ({
    dispatch,
    enhancements,
    getState,
}) => {
    const { responsePromises } = enhancements;
    dispatch(actions.ClearObsError());
    dispatch(actions.ConnectingToObs());
    const ws = new WebSocket(`ws://localhost:4444/`);
    enhancements.ws = ws;
    enhancements.nextMessageId = 1;
    ws.addEventListener(
        'open',
        (event) => {
            console.log("Connected to OBS");
            dispatch(actions.ConnectedToObs());
        }
    );
    ws.addEventListener(
        'close',
        (event) => {
            console.log("Disconnected from OBS");
            enhancements.ws = null;
            if (getState().app.connectingToObs) {
                dispatch(actions.SetObsError({error: "failed to connect"}));
            }
            dispatch(actions.DisconnectedFromObs());
        }
    );
    ws.addEventListener(
        'message',
        (event) => {
            const decodedMessage = JSON.parse(event.data);
            console.log("PogChamp OBS spoke to us!", decodedMessage);
            const messageId = parseInt(decodedMessage["message-id"], 10);
            if (!isNaN(messageId)) {
                const responsePromise = responsePromises.get(messageId);
                if (responsePromise == null) {
                    console.warn("OBS gave us a response with an unknown message ID!", decodedMessage);
                    return;
                }
                const { resolve, reject } = responsePromise;
                responsePromises.delete(messageId);
                const status = decodedMessage.status;
                if (status === "ok") {
                    resolve(decodedMessage);
                } else {
                    reject(decodedMessage.error);
                }
            }
        }
    );
};

const OnDisconnectFromObs = ({
    dispatch,
    enhancements,
}) => {
    const { ws } = enhancements;
    if (!ws) {
        return;
    }
    console.log("Disconnecting from OBS");
    ws.close();
    enhancements.ws = null;
    dispatch(actions.DisconnectedFromObs());
};

const OnObsAuthenticate = async ({
    action: { challenge, salt },
    dispatch,
    enhancements,
    getState,
}) => {
    console.log("Authenticating with OBS");
    dispatch(actions.ClearObsError());
    const password = getState().app.obsPassword;
    const hash1 = await crypto.subtle.digest("SHA-256", RawStringToArrayBuffer(password + salt));
    const hash1b = btoa(ArrayBufferToRawString(hash1));
    // @ts-ignore
    const hash2 = await crypto.subtle.digest("SHA-256", RawStringToArrayBuffer(hash1b + challenge));
    const hash2b = btoa(ArrayBufferToRawString(hash2));
    const auth = hash2b;
    // @ts-ignore
    SendToObs({
        enhancements,
        type: "Authenticate",
        extraFields: { auth },
    })
        .then(() => {
            console.log("Successfully authenticated with OBS");
            dispatch(actions.ObsAuthenticated());
        })
        .catch(error => {
            console.error("Error authenticating with OBS:", error);
            dispatch(actions.SetObsError({error}));
            dispatch(actions.DisconnectFromObs());
        });
};

const handlers = {
    [actionTypes.ConnectedToObs]: OnConnectedToObs,
    [actionTypes.ConnectToObs]: OnConnectToObs,
    [actionTypes.DisconnectFromObs]: OnDisconnectFromObs,
    [actionTypes.ObsAuthenticate]: OnObsAuthenticate,
};

export default function({ getState, dispatch }) {
    const enhancements = {
        nextMessageId: 1,
        responsePromises: new Map(),
        ws: null,
    };
    return next => action => {
        next(action);
        const handler = handlers[action.type];
        if (handler) {
            // @ts-ignore
            handler({action, dispatch, enhancements, getState});
        }
    };
};
