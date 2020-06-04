import { actionTypes } from "../actions";

const initialState = {
    data: null,
    path: [],
};

const DecomposeData = (data) => {
    if (data == null) {
        return ["value", JSON.stringify(data)];
    } else if (Array.isArray(data)) {
        return ["array", data.map(element => DecomposeData(element))];
    } else if (typeof(data) === "object") {
        return ["object", Object.entries(data).reduce(
            (obj, [key, value]) => {
                obj[key] = DecomposeData(value);
                return obj;
            }, {}
        )];
    } else {
        return ["value", JSON.stringify(data)];
    }
};

export default function (state = initialState, action) {
    switch (action.type) {
        case actionTypes.DisconnectedFromAlfred:
            return {
                ...state,
                data: null,
            };
        case actionTypes.ReceiveAlfredData: {
            return {
                ...state,
                data: DecomposeData(action.data),
            };
        }
        case actionTypes.SelectDataEditorPath:
            return {
                ...state,
                path: action.path,
            };
        default:
            return state;
    }
}
