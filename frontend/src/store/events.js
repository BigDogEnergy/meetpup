import { csrfFetch } from "./csrf";

//      Action Types
const LOAD_EVENTS = 'events/LOAD'
const ADD_EVENT = 'events/ADD'
const REMOVE_EVENT = 'events/REMOVE'
const EDIT_EVENT = 'events/EDIT'
const LOAD_ONE_EVENT = 'events/LOAD_ONE'

//      Action Creators

const loadEvents = events => {
    console.log('loadEvents Action Creator', events);
    return {
        type: LOAD_EVENTS,
        events
    };
};

const addEvent = event => {
    console.log('addEvent Action Creator', event);
    return {
        type: ADD_EVENT,
        event
    };
};

const removeEvent = eventId => {
    console.log('removeEvent Action Creator', eventId);
    return {
        type: REMOVE_EVENT,
        eventId
    };
};

const editEvent = event => {
    console.log('editEvent Action Creator', event);
    return {
        type: EDIT_EVENT,
        event
    };
};

const loadOneEvent = event => {
    console.log('loadOneEvent', event);
    return {
        type: LOAD_ONE_EVENT,
        event
    };
};

//      Thunks

// /api/events (GET)
export const getAllEvents = () => async dispatch => {
    const response = await csrfFetch('/api/events');

    if (response.ok) {
        const events = await response.json();
        console.log(events);
        dispatch(loadEvents(events.Events));
        return events.Events
    }
};

//      Reducer

const initialState = {
    events: [],
    oneEvent: {
        Group: {}
    }
};

export const eventReducer = (state = initialState, action) => {

    let newState = {};
    let events;
    let oneEvent;
    switch (action.type) {

        case LOAD_EVENTS:
            // return { events: { ...action.events }, oneEvent: { ...state.oneEvent } };
            return { ...state, events: action.events };

        case REMOVE_EVENT:
            newState = { ...state};
            delete newState[action.eventId]

        default:
                return state;

    };

}