import { actionTypes, actions } from "../actions";

const OnLoad = ({
    dispatch,
    getState,
}) => {
    const search = new URLSearchParams(window.location.search);
    if (search.has("key")) {
        const key = search.get("key");
        dispatch(actions.SetControl({control: false}));
        dispatch(actions.SetKey({key}));
    } else {
        dispatch(actions.SetControl({control: true}));
    }
};

const handlers = {
    [actionTypes.Load]: OnLoad,
};

export default function({ getState, dispatch }) {
    return next => action => {
        next(action);
        const handler = handlers[action.type];
        if (handler) {
            // @ts-ignore
            handler({dispatch, action, getState});
        }
    };
};
