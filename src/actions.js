export const actionTypes = {};
export const actions = {};

const CreateAction = type => (args) => ({...args, type});

const DefineAction = (type) => {
    actionTypes[type] = type;
    actions[type] = CreateAction(type);
};

[
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
    "ObsAuthenticated",
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
    "RevokeToken",
    "SetConfiguration",
    "SetKey",
    "SetAlfredError",
    "SetObsError",
    "SetPage",
    "SetProfileImageUrl",
    "SetToken",
    "SetUserId",
    "SetUserInfo",
    "ValidateToken",
].forEach(actionType => DefineAction(actionType));
