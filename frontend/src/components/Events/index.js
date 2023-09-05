import React, { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllEvents } from "../../store/events";
import './Events.css'
import EventDetails from "../EventDetails";
import SingleEventCard from "../SingleEventCard";

function Events() {
    const dispatch = useDispatch();

    //State-related
    const eventsObj = useSelector(state => state.events.events || []);
    const events = Object.values(eventsObj);
    // console.log('Events index.js first events check', events)

    //useEffect
    useEffect(() => {
        dispatch(getAllEvents())
    }, [dispatch])

    let eventDisplay;
    const futureEvents = events.filter(event => event.startDate >= new Date().toISOString());
    const pastEvents = events.filter(event => event.startDate < new Date().toISOString());

    // console.log('this is future events', futureEvents) 
    if (futureEvents.length > 0) {
        eventDisplay = (
            futureEvents.map(event => (
                // console.log("!!!!!!!!!!!!!!",event),
                <EventDetails key={event.id} event={event} />
            ))
        )
    } else {
        eventDisplay= (
            <>
                <div className="no-groups-container">
                    <div className="no-groups-text"> There are currently no events available to view! </div>
                </div>
            </>
        )

    }

    let pastEventDisplay;
    if (pastEvents.length > 0) {
        pastEventDisplay = (
            pastEvents.map(event => (
                <EventDetails key={event.id} event={event} />
            ))
    );
    } else {
        pastEventDisplay = (
            <div className="no-past-events-container">
                <div className="no-past-events-text"> There are no past events to display! </div>
            </div>
        );
    }



    return (
        (events && 
            <div className="groups-page-container">
                <div className="groups-page-title-container">
                <div className="groups-page-header">
                    <Link className='groups-page-toggle-1' to='/events'>
                        Events
                    </Link>
                    <Link className='groups-page-toggle-2' to='/groups'>
                        Groups
                    </Link>
                    
                </div>
                    <div className='groups-page-view-text'>
                        Upcoming Events in MeetPup
                    </div>
                    <div className='groups-page-grouplist'>
                        {eventDisplay}
                    </div>
                    <div className='groups-page-view-text'>
                        Past Events
                    </div>
                    <div className="groups-page-grouplist">
                        {pastEventDisplay}
                    </div>
                </div>
            </div>
        )
    )

}

export default Events