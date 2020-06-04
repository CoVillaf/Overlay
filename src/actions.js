export const actionTypes = {};
export const actions = {};

const CreateAction = type => (args) => ({...args, type});

const DefineAction = (type) => {
    actionTypes[type] = type;
    actions[type] = CreateAction(type);
};

[
    "AuthenticatedWithAlfred",
    "AuthenticatedWithObs",
    "ClearAlfredError",
    "ClearObsError",
    "ClearToken",
    "ConnectedToAlfred",
    "ConnectedToObs",
    "ConnectToAlfred",
    "ConnectToObs",
    "ConnectingToAlfred",
    "ConnectingToObs",
    "DisconnectedFromAlfred",
    "DisconnectedFromObs",
    "DisconnectFromAlfred",
    "DisconnectFromObs",
    "Load",
    "ObsAuthenticate",
    "RequestChannelInfo",
    "RequestChannelInfoBegin",
    "RequestChannelInfoEnd",
    "RequestConfiguration",
    "RequestConfigurationBegin",
    "RequestConfigurationEnd",
    "RequestToken",
    "RequestUserInfo",
    "RequestUserInfoBegin",
    "RequestUserInfoEnd",
    "RevokeTwitchOAuthToken",
    "SelectDataEditorPath",
    "SetConfiguration",
    "SetKey",
    "SetAlfredError",
    "SetObsError",
    "SetPage",
    "SetProfileImageUrl",
    "SetTwitchOAuthToken",
    "SetUserId",
    "SetUserInfo",
    "ValidateTwitchOAuthToken",
].forEach(actionType => DefineAction(actionType));
