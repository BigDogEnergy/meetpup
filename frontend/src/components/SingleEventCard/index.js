import React, { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteEvent, getAllEvents, createEvent, newEventImage, singleEventData } from "../../store/events";
import { getGroupDetails  } from "../../store/groups";
import { useParams, useHistory, Link } from "react-router-dom";
import './SingleEventCard.css'

function SingleEventCard ({ event }) {

    const dispatch = useDispatch();
    const history = useHistory();

    // console.log("this is event",event)

    //state-related
    const User = useSelector ( state => state.session.user)
    const group = useSelector ( state => state.group.oneGroup)

    //useEffect-related
    useEffect(() => {
        dispatch(singleEventData(event?.id))
    }, [dispatch])

    //date and time helper functions
    function splitDateTime(dateTimeString) {
        const [date, fullTime] = dateTimeString.split('T');
        const time = fullTime ? fullTime.split('.')[0] : '';
        return { date, time } ;
    }
    
    function splitEndTime(dateTimeString) {
        const [endDate, fullTime] = dateTimeString.split('T');
        const endTime = fullTime ? fullTime.split('.')[0] : '';
        return { endDate, endTime } ;
    }

    function convertToAMPM(timeString) {
        if (!timeString) return '';
        const [hour, minute] = timeString.split(':');
        let amOrPm = 'AM';
        let adjustedHour = parseInt(hour, 10);
    
        if (adjustedHour >= 12) {
            amOrPm = 'PM';
            if (adjustedHour > 12) {
                adjustedHour -= 12;
            }
        }
        
        return `${adjustedHour}:${minute} ${amOrPm}`;
    }
       

    //onClick
    const handleContainerClick = () => {
        console.log('we clicked a link')
        history.push(`/events/${event.id}`);
    };

    let date = '', time = '', endDate = '', endTime = '', formattedTime = '', formattedEndTime = '';

    if (event?.startDate && event?.endDate) {
        
        ({ date, time } = splitDateTime(event?.startDate));
        ({ endDate, endTime } = splitEndTime(event?.endDate));
        
        if (time) {
            formattedTime = convertToAMPM(time);
        }
    
        if (endTime) {
            formattedEndTime = convertToAMPM(endTime);
        } 
    }

    return (event && event.eventImages &&
        <>
            <div className="single-event-container" onClick={handleContainerClick}>
                <div className="single-event-header-container">
                    
                    <div className='group-event-image'>
                        <img className="single-event-mid-image" src={event.eventImages[0]?.url} alt={"an event image"}/>
                    </div>

                    <div className="single-event-card-mid-container">
                            <div className="single-event-mid-start-date">
                                {date} &middot; {formattedTime}
                            </div>
                            <div className="single-event-header-title">
                                {event.name}
                            </div>
                            {/* <div className="single-event-mid-end-date">
                                {endDate} &middot; {formattedEndTime}
                            </div> */}
                            {/* <div className="single-event-mid-price">
                                ${event.price === 0 || event.price === "0" ? "FREE" : event.price}
                            </div> */}
                            <div className="single-event-mid-type">
                                {event.Venue.city} {event.Venue.state}
                            </div>
                    </div>
                </div>
                    
                <div className='single-event-details-container'>
                            {event.description}
                </div>
            </div> 
        </>
    )

};

export default SingleEventCard;