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
        // console.log("getAllGroups THUNK", groups)
        return groups;
    };
};

//POST /api/groups (CREATE)
export const createGroup = (newGroup) => async dispatch => {
    const response = await csrfFetch('/api/groups', {
        method: 'POST',
        body: JSON.stringify(newGroup)
    });

    if (response.ok) {
        const newGroup = await response.json();
        dispatch()
    }    
}

//GET /api/groups/:groupId (READ)
export const getGroupDetails = groupId => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}`);

    if (response.ok) {
        const group = await response.json();
        dispatch(loadOneGroup(group));
        console.log('loadOneGroup THUNK group', group);
        return group;
    };
};

//---> Reducer

const initialState = {
    groups: {},
    oneGroup: {},
};

export const groupReducer = (state = initialState, action) => {

    let newState = { ...state };
    let groups;
    let oneGroup;

    switch (action.type) {

        case LOAD_GROUPS:
            newState = {...state}
            groups = {};
            action.groups.Groups.forEach(group => groups[group.id] = group);
            newState.groups = groups;
            return newState;
            // return { groups: {...action.groups.Groups}, oneGroup: {...state.oneGroup}}
    
        case LOAD_ONE_GROUP:
            oneGroup = {};
            // newState.groups = {...state.groups, [action.group.id]: action.group};
            newState.oneGroup = {...action.group};            
            return newState;

        case ADD_GROUP:
            newState.groups[action.newGroup.id] = action.newGroup;
            newState.oneGroup = action.newGroup
            return newState;

        case REMOVE_GROUP:
            delete newState[action.groupId];
            return newState;

        case EDIT_GROUP:
            newState = { ...state, [action.group.id]: action.group };
            return newState;
        
        default:
            return state
    
    };
};