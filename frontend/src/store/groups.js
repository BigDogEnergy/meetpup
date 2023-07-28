import { csrfFetch } from "./csrf";

//---> Action Types

const LOAD_GROUPS = 'groups/LOAD';

//---> Action Creators

const loadGroups = groups => ({
    type: LOAD_GROUPS,
    groups
});

//--->Thunks

//GET /api/groups (READ)

//---> Reducer

const initialState = {
    groups: {},
    viewGroup: {},
};

export const groupReducer = (state = initialState, action) => {

    let newState = { ...state };

    switch (action.type) {
        case LOAD_GROUPS:
            return null
    };

}