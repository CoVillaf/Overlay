import { actionTypes } from "../actions";

import {
    APP_PAGE_LOADING,
    LOCAL_STORAGE_TOKEN,
} from "../constants";

const initialState = {
    configuration: null,
    key: null,
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
        case actionTypes.ClearToken:
            localStorage.removeItem(LOCAL_STORAGE_TOKEN);
            return {
                ...state,
                token: null,
                userId: null,
                userName: null,
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
