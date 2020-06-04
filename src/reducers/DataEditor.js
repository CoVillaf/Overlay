import { actionTypes } from "../actions";

const initialState = {
    path: [],
};

export default function (state = initialState, action) {
    switch (action.type) {
        case actionTypes.SelectDataEditorPath:
            return {
                ...state,
                path: action.path,
            };
        default:
            return state;
    }
}
