import * as Types from '../../constants/ActionType';

export const actUpdateFilter = (filter) => {
    return {
        type: Types.UPDATE_FILTER,
        filter
    }
}