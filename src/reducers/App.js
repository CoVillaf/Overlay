import { actionTypes } from "../actions";

import {
    APP_PAGE_LOADING,
    LOCAL_STORAGE_OBS_PASSWORD,
    LOCAL_STORAGE_TOKEN,
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
    alfredError: null,
    authenticatedWithObs: false,
    configuration: null,
    connectedToAlfred: false,
    connectedToObs: false,
    connectingToAlfred: false,
    connectingToObs: false,
    key: null,
    obsError: null,
    obsPassword: GetInitialSetting(LOCAL_STORAGE_OBS_PASSWORD, ""),
    page: APP_PAGE_LOADING,
    profileImageUrl: null,
    requestingConfiguration: false,
    requestingProfile: false,
    requestingUserInfo: false,
    token: localStorage.getItem(LOCAL_STORAGE_TOKEN),
    userId: null,
    userName: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
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
            localStorage.removeItem(LOCAL_STORAGE_TOKEN);
            return {
                ...state,
                token: null,
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
        case actionTypes.SetToken:
            localStorage.setItem(LOCAL_STORAGE_TOKEN, action.token);
            return {
                ...state,
                token: action.token,
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
