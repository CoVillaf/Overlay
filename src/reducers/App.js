import { actionTypes } from "../actions";

const initialState = {
    key: null,
    control: false,
};

export default function (state = initialState, action) {
    switch (action.type) {
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
        default:
            return state;
    }
}
