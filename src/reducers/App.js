import { actionTypes } from "../actions";

const initialState = {
    configuration: null,
    control: false,
    key: null,
    profileImageUrl: null,
    requestingConfiguration: false,
    requestingProfile: false,
};

export default function (state = initialState, action) {
    switch (action.type) {
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
        case actionTypes.RequestProfileBegin:
            return {
                ...state,
                requestingProfile: true,
            };
        case actionTypes.RequestProfileEnd:
            return {
                ...state,
                requestingProfile: false,
            };
        case actionTypes.SetConfiguration:
            return {
                ...state,
                configuration: action.configuration,
            };
        case actionTypes.SetControl:
            return {
                ...state,
                control: action.control,
            };
        case actionTypes.SetKey:
            return {
                ...state,
                key: action.key,
            };
        case actionTypes.SetProfileImageUrl:
            return {
                ...state,
                profileImageUrl: action.profileImageUrl
            };
        default:
            return state;
    }
}
