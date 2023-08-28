import { csrfFetch } from "./csrf";

//---> Action Types

const LOAD_GROUPS = 'groups/LOAD'
const LOAD_ONE_GROUP = 'groups/LOAD_ONE'
const ADD_GROUP = 'groups/ADD'
const REMOVE_GROUP = 'groups/REMOVE'
const EDIT_GROUP = 'groups/EDIT'
const ADD_IMAGE = 'groups/ADD_IMAGE'

//---> Action Creators

const loadGroups = groups => {
    console.log('loadGroups action creator', groups);
    return {
        type: LOAD_GROUPS,
        groups
    };
};

const loadOneGroup = group => {
    console.log('loadOneGroup action creator', group);
    return {
        type: LOAD_ONE_GROUP,
        group
    };
};

const addImage = group => {
    console.log('addImage action creator', group)
    return {
        type: ADD_IMAGE,
        group
    };
};

const addGroup = group => {
    console.log('addGroup action creator', group)
    return {
        type: ADD_GROUP,
        group
    };
};

const removeGroup = group => {
    console.log('removeGroup action creator', group)
    return {
        type: REMOVE_GROUP,
        group
    };
};

const editGroup = group => {
    console.log('editGroup action creator', group)
    return {
        type: EDIT_GROUP,
        group
    };
};

//--->Thunks

//GET /api/groups (READ)
export const getAllGroups = () => async dispatch => {
    try {
        const response = await csrfFetch('/api/groups');

        if (response.ok) {
            const groups = await response.json();
            dispatch(loadGroups(groups));
            console.log("getAllGroups thunk success", groups)
            return groups;
        }
    } catch(error) {
        console.error('getAllGroups thunk error', error);
    }
};

//POST /api/groups (CREATE)
export const createGroup = (payload) => async dispatch => {
    try {
        const response = await csrfFetch('/api/groups', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const newGroup = await response.json();
            dispatch(addGroup(newGroup));
            console.log('createGroup thunk success', newGroup)
            return newGroup;
        }
    } catch (error) {
        console.error('createGroup thunk error', error);
        console.log('payload', payload)
        // console.log('response', response)
    }
};

//POST /api/groups (CREATE) -- IMAGE
export const addGroupImage = (groupId, image) => async dispatch => {
    try { 
        const response = await csrfFetch(`/api/groups/${groupId}/images`, {
            method: 'POST',
            body: JSON.stringify(image)
        });

        if (response.ok) {
            const newImage = await response.json();
            dispatch(getGroupDetails(groupId))
            console.log('addGroupImage thunk success', newImage)
            return newImage
        }
    } catch(error) {
            console.error('addGroupImage thunk error', error);
        }
};

//GET /api/groups/:groupId (READ)
export const getGroupDetails = groupId => async dispatch => {
    try {
        const response = await csrfFetch(`/api/groups/${groupId}`);

        if (response.ok) {
            const group = await response.json();
            dispatch(loadOneGroup(group));
            console.log('loadOneGroup THUNK success', group);
            return group;
        }
    } catch(error) {
        console.error('getGroupDetails thunk error', error);
    }
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
            console.log('LOAD_GROUPS reducer', newState);
            return newState;
    
        case LOAD_ONE_GROUP:
            oneGroup = {};
            newState.oneGroup = {...action.group};    
            console.log('LOAD_ONE_GROUP reducer', newState)        
            return newState;

        case ADD_GROUP:
            newState.groups[action.group.id] = action.group;
            newState.oneGroup = action.group
            console.log('ADD_GROUP reducer', newState)
            return newState;

        case REMOVE_GROUP:
            delete newState[action.groupId];
            console.log('REMOVE_GROUP reducer', newState)
            return newState;

        case EDIT_GROUP:
            newState = { ...state, [action.group.id]: action.group };
            console.log('EDIT_GROUP reducer', newState)
            return newState;
        
        default:
            return state
    
    };
};