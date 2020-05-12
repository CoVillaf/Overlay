export const actionTypes = {};
export const actions = {};

const CreateAction = type => (args) => ({...args, type});

const DefineAction = (type) => {
    actionTypes[type] = type;
    actions[type] = CreateAction(type);
};

[
    "Load",
    "RequestConfiguration",
    "RequestConfigurationBegin",
    "RequestConfigurationEnd",
    "RequestProfile",
    "RequestProfileBegin",
    "RequestProfileEnd",
    "SetKey",
    "SetConfiguration",
    "SetControl",
    "SetProfileImageUrl",
].forEach(actionType => DefineAction(actionType));
