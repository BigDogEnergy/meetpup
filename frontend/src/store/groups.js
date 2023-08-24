import { csrfFetch } from "./csrf";

//---> Action Types

const LOAD_GROUPS = 'groups/LOAD'
const LOAD_ONE_GROUP = 'groups/LOAD_ONE'
const ADD_GROUP = 'groups/ADD'
const REMOVE_GROUP = 'groups/REMOVE'
const EDIT_GROUP = 'groups/EDIT'

//---> Action Creators

const loadGroups = groups => ({
    type: LOAD_GROUPS,
    groups
});

const loadOneGroup = group => ({
    type: LOAD_ONE_GROUP,
    group
});

const addGroup = group => ({
    type: ADD_GROUP,
    group
});

const removeGroup = group => ({
    type: REMOVE_GROUP,
    group
});

const editGroup = group => ({
    type: EDIT_GROUP,
    group
})

//--->Thunks

//GET /api/groups (READ)

export const getAllGroups = () => async dispatch => {
    const response = await csrfFetch('/api/groups');

    if (response.ok) {
        const groups = await response.json();
        dispatch(loadGroups(groups));
        console.log(groups)
        return groups;
    };
};

//---> Reducer

const initialState = {
    groups: {},
    viewGroup: {},
};

export const groupReducer = (state = initialState, action) => {

    let newState = { ...state };
    let groups;
    let oneGroup;

    switch (action.type) {

        case LOAD_GROUPS:
            return { groups: {...action.groups.Groups}, oneGroup: {...state.oneGroup}}
    
        default:
            return state
    
        };
}