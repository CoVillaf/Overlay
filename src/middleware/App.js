import { actionTypes, actions } from "../actions";

import {
    APP_PAGE_CONTROL_PANEL,
    APP_PAGE_OVERLAY,
    LOCAL_STORAGE_OAUTH_STATE,
    OAUTH_TOKEN_MIN_EXPIRES_IN,
} from "../constants";

const OnLoad = ({
    dispatch,
    getState,
}) => {
    const search = new URLSearchParams(window.location.search);
    if (search.has("key")) {
        const key = search.get("key");
        dispatch(actions.SetKey({key}));
        dispatch(actions.SetPage({page: APP_PAGE_OVERLAY}));
    } else {
        if (search.has("OAuth")) {
            const hash = new URLSearchParams(window.location.hash.substring(1));
            window.history.replaceState({}, "", window.location.origin);
            const state = hash.get("state");
            const expectedState = localStorage.getItem(LOCAL_STORAGE_OAUTH_STATE);
            localStorage.removeItem(LOCAL_STORAGE_OAUTH_STATE);
            if (state !== expectedState) {
                console.error("State mismatch in OAuth code redirect!", {
                    expectedState,
                    state
                });
                return;
            }
            const token = hash.get("access_token");
            dispatch(actions.SetToken({token}));
            dispatch(actions.ValidateToken());
        } else {
            const token = getState().app.token;
            if (token != null) {
                dispatch(actions.ValidateToken());
            }
        }
        dispatch(actions.SetPage({page: APP_PAGE_CONTROL_PANEL}));
    }
};

const OnRequestChannelInfo = ({
    dispatch,
    enhancements,
    getState,
}) => {
    const { onConfigurationReceived } = enhancements;
    if (getState().app.requestingProfile) {
        return;
    }
    const configuration = getState().app.configuration;
    if (!configuration) {
        onConfigurationReceived.push(actions.RequestChannelInfo());
        dispatch(actions.RequestConfiguration());
        return;
    }
    dispatch(actions.RequestChannelInfoBegin());
    fetch(
        new Request(
            `https://api.twitch.tv/kraken/users?login=${configuration.channel}`,
            {
                headers: {
                    "Client-ID": configuration.clientId,
                    Accept: "application/vnd.twitchtv.v5+json",
                },
            }
        )
    )
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(response => {
            dispatch(actions.SetProfileImageUrl({
                profileImageUrl: response.users[0].logo,
            }));
        })
        .catch(error => {
            console.error("Error requesting channel profile", error);
        })
        .finally(() => {
            dispatch(actions.RequestChannelInfoEnd());
        });
};

const OnRequestConfiguration = ({
    dispatch,
    enhancements,
    getState,
}) => {
    const { onConfigurationReceived } = enhancements;
    if (getState().app.requestingConfiguration) {
        return;
    }
    dispatch(actions.RequestConfigurationBegin());
    const configUrl = process.env.REACT_APP_CONFIG_URL;
    fetch(new Request(configUrl))
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(configuration => {
            dispatch(actions.SetConfiguration({
                configuration,
            }));
            dispatch(actions.RequestConfigurationEnd());
            enhancements.onConfigurationReceived = null;
            while (onConfigurationReceived.length > 0) {
                const action = onConfigurationReceived.shift();
                dispatch(action);
            }
        })
        .catch(error => {
            console.error("Error requesting configuration", error);
        })
        .finally(() => {
            dispatch(actions.RequestConfigurationEnd());
        });
};

const OnRequestToken = ({
    enhancements,
    dispatch,
    getState,
}) => {
    const { onConfigurationReceived } = enhancements;
    const configuration = getState().app.configuration;
    if (!configuration) {
        onConfigurationReceived.push(actions.RequestToken());
        dispatch(actions.RequestConfiguration());
        return;
    }
    var array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    const oauthRequestState = array[0];
    localStorage.setItem(
        LOCAL_STORAGE_OAUTH_STATE,
        JSON.stringify(oauthRequestState)
    );
    const clientId = configuration.clientId;
    const redirectUrl = process.env.REACT_APP_OAUTH_REDIRECT_URL;
    window.location.href = (
        "https://id.twitch.tv/oauth2/authorize"
        + `?client_id=${clientId}`
        + `&redirect_uri=${redirectUrl}`
        + "&response_type=token"
        + "&scope="
        + `&state=${oauthRequestState}`
    );
};

const OnRequestUserInfo = ({
    dispatch,
    enhancements,
    getState,
}) => {
    const { onConfigurationReceived } = enhancements;
    if (getState().app.requestingUserInfo) {
        return;
    }
    const userId = getState().app.userId;
    const configuration = getState().app.configuration;
    if (!configuration) {
        onConfigurationReceived.push(actions.RequestUserInfo());
        dispatch(actions.RequestConfiguration());
        return;
    }
    dispatch(actions.RequestUserInfoBegin());
    fetch(
        new Request(
            `https://api.twitch.tv/kraken/users/${userId}`,
            {
                headers: {
                    "Client-ID": configuration.clientId,
                    Accept: "application/vnd.twitchtv.v5+json",
                },
            }
        )
    )
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(response => {
            dispatch(actions.SetUserInfo({
                userName: response.name,
            }));
        })
        .catch(error => {
            console.error("Error requesting user information", error);
        })
        .finally(() => {
            dispatch(actions.RequestUserInfoEnd());
        });
};

const OnRevokeToken = ({
    dispatch,
    enhancements,
    getState,
}) => {
    const { onConfigurationReceived } = enhancements;
    const configuration = getState().app.configuration;
    if (!configuration) {
        onConfigurationReceived.push(actions.RequestToken());
        dispatch(actions.RequestConfiguration());
        return;
    }
    const token = getState().app.token;
    if (token == null) {
        return;
    }
    fetch(
        new Request(
            `https://id.twitch.tv/oauth2/revoke?client_id=${configuration.clientId}&token=${token}`,
            {
                method: "POST",
            }
        )
    )
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
        })
        .catch(error => {
            console.error("Error revoking OAuth token", error);
        })
        .finally(() => {
            dispatch(actions.ClearToken());
        });
};

const OnValidateToken = ({
    dispatch,
    enhancements,
    getState,
}) => {
    const { onConfigurationReceived } = enhancements;
    const configuration = getState().app.configuration;
    if (!configuration) {
        onConfigurationReceived.push(actions.ValidateToken());
        dispatch(actions.RequestConfiguration());
        return;
    }
    const token = getState().app.token;
    if (token == null) {
        return;
    }
    fetch(
        new Request(
            "https://id.twitch.tv/oauth2/validate",
            {
                headers: {
                    Authorization: `OAuth ${token}`
                },
            }
        )
    )
        .then(response => {
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(response => {
            if (response.client_id === configuration.clientId) {
                if (response.expires_in < OAUTH_TOKEN_MIN_EXPIRES_IN) {
                    console.warn("OAuth token is expiring soon... revoking it");
                    dispatch(actions.RevokeToken());
                    return;
                }
                dispatch(actions.SetUserId({userId: response.user_id}));
            } else {
                console.error("OAuth token is for the wrong client", {
                    expected: configuration.clientId,
                    actual: response.client_id,
                });
                dispatch(actions.RevokeToken());
            }
        })
        .catch(error => {
            console.error("Error validating OAuth token", error);
            dispatch(actions.ClearToken());
        })
};

const handlers = {
    [actionTypes.Load]: OnLoad,
    [actionTypes.RequestChannelInfo]: OnRequestChannelInfo,
    [actionTypes.RequestConfiguration]: OnRequestConfiguration,
    [actionTypes.RequestToken]: OnRequestToken,
    [actionTypes.RequestUserInfo]: OnRequestUserInfo,
    [actionTypes.RevokeToken]: OnRevokeToken,
    [actionTypes.ValidateToken]: OnValidateToken,
};

export default function({ getState, dispatch }) {
    const enhancements = {
        onConfigurationReceived: [],
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
