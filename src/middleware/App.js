import { actionTypes, actions } from "../actions";

const OnLoad = ({
    dispatch,
    getState,
}) => {
    const search = new URLSearchParams(window.location.search);
    if (search.has("key")) {
        const key = search.get("key");
        dispatch(actions.SetControl({control: false}));
        dispatch(actions.SetKey({key}));
    } else {
        dispatch(actions.SetControl({control: true}));
    }
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

const OnRequestProfile = ({
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
        onConfigurationReceived.push(actions.RequestProfile());
        dispatch(actions.RequestConfiguration());
        return;
    }
    dispatch(actions.RequestProfileBegin());
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
            dispatch(actions.RequestProfileEnd());
        });
};

const handlers = {
    [actionTypes.Load]: OnLoad,
    [actionTypes.RequestConfiguration]: OnRequestConfiguration,
    [actionTypes.RequestProfile]: OnRequestProfile,
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
