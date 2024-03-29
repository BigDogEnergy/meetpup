import { csrfFetch } from "./csrf";

//      Action Types
const LOAD_EVENTS = 'events/LOAD'
const ADD_EVENT = 'events/ADD'
const REMOVE_EVENT = 'events/REMOVE'
const EDIT_EVENT = 'events/EDIT'
const LOAD_ONE_EVENT = 'events/LOAD_ONE'
const ADD_IMAGE = 'events/ADD_IMAGE'
// const LOAD_GROUP_EVENTS = 'events/LOAD_GROUP_EVENTS'

//      Action Creators

// const loadGroupEvents = groupId => {
//     console.log('eventCount Action Creator', groupId);
//     return {
//         type: LOAD_GROUP_EVENTS,
//         groupId
//     }
// }

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
    console.log('loadOneEvent Action Creator', event);
    return {
        type: LOAD_ONE_EVENT,
        event
    };
};

const addImage = (eventId, image) => {
    console.log('addImage Action Creator', image, eventId);
    return {
        type: ADD_IMAGE,
        image, eventId
    };
}

//      Thunks

// GET ALL EVENTS IN GENERAL
export const getAllEvents = () => async dispatch => {
    const response = await csrfFetch('/api/events');

    if (response.ok) {
        const events = await response.json();
        console.log(events);
        dispatch(loadEvents(events.Events));
        return events.Events
    }
};

// POST EVENT
export const createEvent = (groupId, newEvent) => async dispatch => {
    try {

        // console.log("This is the passed in created event",newEvent)
        // console.log("this is the passed in groupId", groupId)

        const response = await csrfFetch(`/api/groups/${groupId}/events`, {
            method: 'POST',
            body: JSON.stringify(newEvent)
        });


        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Error creating event.");
        }

        const eventData = await response.json();
        dispatch(addEvent(eventData));
        return eventData;

    } catch (error) {
        console.error("Error in createEvent thunk:", error.message);
        throw error;
    }
};

// //GET COUNT OF EVENTS BY GROUP
// export const getEventCount = (groupId) => async dispatch => {
//     const response = await csrfFetch(`/api/groups/${groupId}/events`)

//     if (response.ok) {
//         const eventCount = await response.json();
//         console.log(eventCount);
//         dispatch(loadGroupEvents(eventCount.length));
//         return eventCount.length
//     };
// };

// POST IMAGE for EVENT
export const newEventImage = (eventId, imageUrl) => async dispatch => {
    const response = await csrfFetch(`/api/events/${eventId}/images`, {
        method: 'POST',
        body: JSON.stringify({
            url:imageUrl,
            preview: true
        })
    });

    if (response.ok) {
        const newEventImage = await response.json();
        console.log('newEventImage in thunk', newEventImage)
        dispatch(addImage(eventId, newEventImage))
        return newEventImage
    };
};


// DELETE EVENT
export const deleteEvent = eventId => async dispatch => {
    const response = await csrfFetch(`/api/events/${eventId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        const targetEvent = await response.json()
        dispatch(removeEvent(eventId));
        return targetEvent
    };
};

// EDIT EVENT (PUT)
export const updateEvent = event => async dispatch => {
    const response = await csrfFetch(`/api/events/${event.id}`, {
        method: 'PUT',
        body: JSON.stringify(event)
    });

    if (response.ok) {
        const editedEvent = await response.json();
        dispatch(editEvent(editedEvent));
        return editedEvent
    };

};

// SINGLE EVENT DATA (GET)
export const singleEventData = eventId => async dispatch => {
    const response = await csrfFetch(`/api/events/${eventId}`);

    if (response.ok) {
        const event = await response.json();
        dispatch(loadOneEvent(event));
        return event;
    };
};

// GET EVENTS BASED ON GROUP
export const groupOwnedEvents = groupId => async dispatch => {
    const response = await csrfFetch(`/api/groups/${groupId}/events`);

    if (response.ok) {
        const events = await response.json();
        dispatch(loadEvents(events.Events));
        return events;
    };
};


//      Reducer

const initialState = {
    events: {},
    oneEvent: {
        Group: {}
    }
};

export const eventReducer = (state = initialState, action) => {

    let newState = {};
    let events;
    let oneEvent;
    let eventCount;
    switch (action.type) {

        case LOAD_EVENTS:
            // return { events: { ...action.events }, oneEvent: { ...state.oneEvent } };
            return { ...state, events: action.events };

        case REMOVE_EVENT:
            newState = { ...state };
            delete newState.events[action.eventId];
            if (newState.oneEvent.id === action.eventId) {
                newState.oneEvent = { Group: {} }; // Resetting oneEvent if it's the deleted event
            }
            return newState;

        case ADD_IMAGE:
            newState = {...state};
            if (newState.oneEvent.id === action.eventId) {
                newState.oneEvent.eventImages[0] = {...action.image}
            }
            return newState;

        case EDIT_EVENT:
            newState = { ...state, [action.event.id]: action.event}
            return newState;

        case LOAD_ONE_EVENT:
            oneEvent = {};
            newState.events = {...state.events, [action.event.id]: action.event };
            newState.oneEvent = { ...action.event }
            return newState;

        // case LOAD_GROUP_EVENTS:
        //     eventCount = {}
        //     newState.eventCount = { action }


        default:
                return state;

    };

}