// import { actionTypes, actions } from "../actions";

// const OnSomething = ({
//     dispatch,
//     getState,
// }) => {
//     dispatch(actions.SomethingElse({data}));
// };

const handlers = {
//     [actionTypes.Something]: OnSomething,
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
