import * as Types from './../../constants/ActionType';
let initialState = [];

const filter = (state = initialState, action) => {
    switch (action.type) {
        case Types.UPDATE_FILTER:
            state = action.filter;
            return { ...state };
        default: return { ...state };
    }
};

export default filter;