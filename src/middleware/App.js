import { actionTypes, actions } from "../actions";

import {
    APP_PAGE_CONTROL_PANEL,
    APP_PAGE_OVERLAY,
    CONFIGURATION_URL,
    LOCAL_STORAGE_TWITCH_OAUTH_STATE,
    OAUTH_TOKEN_MIN_EXPIRES_IN,
} from "../constants";

const CallHelix = ({
    getState,
    request,
}) => {
    const configuration = getState().app.configuration;
    const token = getState().app.twitchOAuthToken;
    return fetch(
        new Request(
            `https://api.twitch.tv/helix/${request}`,
            {
                headers: {
                    "Client-ID": configuration.clientId,
                    Authorization: `Bearer ${token}`,
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
};

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
        if (search.has("Twitch")) {
            const hash = new URLSearchParams(window.location.hash.substring(1));
            window.history.replaceState({}, "", window.location.origin);
            const state = hash.get("state");
            const expectedState = localStorage.getItem(LOCAL_STORAGE_TWITCH_OAUTH_STATE);
            localStorage.removeItem(LOCAL_STORAGE_TWITCH_OAUTH_STATE);
            if (state !== expectedState) {
                console.error("State mismatch in OAuth code redirect!", {
                    expectedState,
                    state
                });
                return;
            }
            const token = hash.get("access_token");
            dispatch(actions.SetTwitchOAuthToken({token}));
            dispatch(actions.ValidateTwitchOAuthToken());
        } else {
            const token = getState().app.twitchOAuthToken;
            if (token != null) {
                dispatch(actions.ValidateTwitchOAuthToken());
            }
        }
        dispatch(actions.SetPage({page: APP_PAGE_CONTROL_PANEL}));
    }
};

const OnRequestChannelInfo = ({
    action,
    dispatch,
    getState,
}) => {
    if (getState().app.requestingProfile) {
        return;
    }
    const configuration = getState().app.configuration;
    if (!configuration) {
        dispatch(actions.RequestConfiguration({then: action}));
        return;
    }
    dispatch(actions.RequestChannelInfoBegin());
    CallHelix({
        getState,
        request: `users?login=${configuration.channel}`
    })
        .then(response => {
            dispatch(actions.SetProfileImageUrl({
                profileImageUrl: response.data[0].profile_image_url,
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
    action: { then },
    dispatch,
    enhancements,
    getState,
}) => {
    const { onConfigurationReceived } = enhancements;
    if (then) {
        onConfigurationReceived.push(then);
    }
    if (getState().app.requestingConfiguration) {
        return;
    }
    dispatch(actions.RequestConfigurationBegin());
    fetch(new Request(CONFIGURATION_URL))
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
            enhancements.onConfigurationReceived = [];
            while (onConfigurationReceived.length > 0) {
                const action = onConfigurationReceived.shift();
                dispatch(action);
            }
        })
        .catch(error => {
            console.error("Error requesting configuration", error);
            dispatch(actions.RequestConfigurationEnd());
        });
};

const OnRequestToken = ({
    action,
    dispatch,
    getState,
}) => {
    const configuration = getState().app.configuration;
    if (!configuration) {
        dispatch(actions.RequestConfiguration({then: action}));
        return;
    }
    var array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    const oauthRequestState = array[0];
    localStorage.setItem(
        LOCAL_STORAGE_TWITCH_OAUTH_STATE,
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
    action,
    dispatch,
    getState,
}) => {
    if (getState().app.requestingUserInfo) {
        return;
    }
    const userId = getState().app.userId;
    const configuration = getState().app.configuration;
    if (!configuration) {
        dispatch(actions.RequestConfiguration({then: action}));
        return;
    }
    dispatch(actions.RequestUserInfoBegin());
    CallHelix({
        getState,
        request: `users?id=${userId}`
    })
        .then(response => {
            dispatch(actions.SetUserInfo({
                userName: response.data[0].display_name,
            }));
        })
        .catch(error => {
            console.error("Error requesting user information", error);
        })
        .finally(() => {
            dispatch(actions.RequestUserInfoEnd());
        });
};

const OnRevokeTwitchOAuthToken = ({
    action,
    dispatch,
    getState,
}) => {
    const configuration = getState().app.configuration;
    if (!configuration) {
        dispatch(actions.RequestConfiguration({then: action}));
        return;
    }
    const token = getState().app.twitchOAuthToken;
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

const OnValidateTwitchOAuthToken = ({
    action,
    dispatch,
    getState,
}) => {
    const configuration = getState().app.configuration;
    if (!configuration) {
        dispatch(actions.RequestConfiguration({then: action}));
        return;
    }
    const token = getState().app.twitchOAuthToken;
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
                    dispatch(actions.RevokeTwitchOAuthToken());
                    return;
                }
                dispatch(actions.SetUserId({userId: response.user_id}));
            } else {
                console.error("OAuth token is for the wrong client", {
                    expected: configuration.clientId,
                    actual: response.client_id,
                });
                dispatch(actions.RevokeTwitchOAuthToken());
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
    [actionTypes.RevokeTwitchOAuthToken]: OnRevokeTwitchOAuthToken,
    [actionTypes.ValidateTwitchOAuthToken]: OnValidateTwitchOAuthToken,
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
