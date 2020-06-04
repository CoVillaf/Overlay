import { actionTypes } from "../actions";

import {
    APP_PAGE_LOADING,
    LOCAL_STORAGE_OBS_PASSWORD,
    LOCAL_STORAGE_TWITCH_OAUTH_TOKEN,
} from "../constants";

const GetInitialSetting = (settingKey, defaultSetting) => {
    const setting = localStorage.getItem(settingKey);
    return (
        (setting == null)
        ? defaultSetting
        : setting
    );
};

const initialState = {
    alfredData: null,
    alfredError: null,
    authenticatedWithAlfred: false,
    authenticatedWithObs: false,
    configuration: null,
    connectedToAlfred: false,
    connectedToObs: false,
    connectingToAlfred: false,
    connectingToObs: false,
    key: "",
    obsError: null,
    obsPassword: GetInitialSetting(LOCAL_STORAGE_OBS_PASSWORD, ""),
    page: APP_PAGE_LOADING,
    profileImageUrl: null,
    requestingConfiguration: false,
    requestingProfile: false,
    requestingUserInfo: false,
    twitchOAuthToken: localStorage.getItem(LOCAL_STORAGE_TWITCH_OAUTH_TOKEN),
    userId: null,
    userName: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case actionTypes.AuthenticatedWithAlfred:
            return {
                ...state,
                authenticatedWithAlfred: true,
            };
        case actionTypes.ClearAlfredError:
            return {
                ...state,
                alfredError: null,
            };
        case actionTypes.ClearObsError:
            return {
                ...state,
                obsError: null,
            };
        case actionTypes.ClearToken:
            localStorage.removeItem(LOCAL_STORAGE_TWITCH_OAUTH_TOKEN);
            return {
                ...state,
                twitchOAuthToken: null,
                userId: null,
                userName: null,
            };
        case actionTypes.ConnectToObs:
            const { password } = action;
            localStorage.setItem(LOCAL_STORAGE_OBS_PASSWORD, password)
            return {
                ...state,
                obsPassword: password,
            };
        case actionTypes.ConnectedToAlfred:
            return {
                ...state,
                connectedToAlfred: true,
                connectingToAlfred: false,
            };
        case actionTypes.ConnectedToObs:
            return {
                ...state,
                connectedToObs: true,
                connectingToObs: false,
            };
        case actionTypes.ConnectingToAlfred:
            return {
                ...state,
                connectingToAlfred: true,
            };
        case actionTypes.ConnectingToObs:
            return {
                ...state,
                connectingToObs: true,
            };
        case actionTypes.DisconnectedFromAlfred:
            return {
                ...state,
                alfredData: null,
                authenticatedWithAlfred: false,
                connectedToAlfred: false,
                connectingToAlfred: false,
            };
        case actionTypes.DisconnectedFromObs:
            return {
                ...state,
                authenticatedWithObs: false,
                connectedToObs: false,
                connectingToObs: false,
            };
        case actionTypes.AuthenticatedWithObs:
            return {
                ...state,
                authenticatedWithObs: true,
            };
        case actionTypes.ReceiveAlfredData:
            return {
                ...state,
                alfredData: action.data,
            };
        case actionTypes.RequestConfigurationBegin:
            return {
                ...state,
                requestingConfiguration: true,
            };
        case actionTypes.RequestConfigurationEnd:
            return {
                ...state,
                requestingConfiguration: false,
            };
        case actionTypes.RequestChannelInfoBegin:
            return {
                ...state,
                requestingProfile: true,
            };
        case actionTypes.RequestChannelInfoEnd:
            return {
                ...state,
                requestingProfile: false,
            };
        case actionTypes.RequestUserInfoBegin:
            return {
                ...state,
                requestingUserInfo: true,
            };
        case actionTypes.RequestUserInfoEnd:
            return {
                ...state,
                requestingUserInfo: false,
            };
        case actionTypes.SetAlfredError:
            return {
                ...state,
                alfredError: action.error,
            };
        case actionTypes.SetConfiguration:
            return {
                ...state,
                configuration: action.configuration,
            };
        case actionTypes.SetKey:
            return {
                ...state,
                key: action.key,
            };
        case actionTypes.SetObsError:
            return {
                ...state,
                obsError: action.error,
            };
        case actionTypes.SetPage:
            return {
                ...state,
                page: action.page,
            };
        case actionTypes.SetProfileImageUrl:
            return {
                ...state,
                profileImageUrl: action.profileImageUrl,
            };
        case actionTypes.SetTwitchOAuthToken:
            localStorage.setItem(LOCAL_STORAGE_TWITCH_OAUTH_TOKEN, action.token);
            return {
                ...state,
                twitchOAuthToken: action.token,
            };
        case actionTypes.SetUserId:
            return {
                ...state,
                userId: action.userId,
            };
        case actionTypes.SetUserInfo:
            return {
                ...state,
                userName: action.userName,
            };
        default:
            return state;
    }
}
