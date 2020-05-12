export const actionTypes = {};
export const actions = {};

const CreateAction = type => (args) => ({...args, type});

const DefineAction = (type) => {
    actionTypes[type] = type;
    actions[type] = CreateAction(type);
};

[
    "ClearToken",
    "Load",
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
    "SetKey",
    "SetConfiguration",
    "SetPage",
    "SetProfileImageUrl",
    "SetToken",
    "SetUserId",
    "SetUserInfo",
    "ValidateToken",
].forEach(actionType => DefineAction(actionType));
