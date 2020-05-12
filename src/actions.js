export const actionTypes = {};
export const actions = {};

const CreateAction = type => (args) => ({...args, type});

const DefineAction = (type) => {
    actionTypes[type] = type;
    actions[type] = CreateAction(type);
};

[
    "ClearObsError",
    "ClearToken",
    "ConnectedToObs",
    "ConnectToObs",
    "ConnectingToObs",
    "DisconnectedFromObs",
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
    "SetObsError",
    "SetPage",
    "SetProfileImageUrl",
    "SetToken",
    "SetUserId",
    "SetUserInfo",
    "ValidateToken",
].forEach(actionType => DefineAction(actionType));
