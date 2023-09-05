import React, { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteEvent, getAllEvents, createEvent, newEventImage, singleEventData } from "../../store/events";
import { getGroupDetails  } from "../../store/groups";
import { useParams, useHistory, Link } from "react-router-dom";
import './SingleEventCard.css'

function SingleEventCard ({ event }) {
    // const { eventId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();

    // console.log('threaded events', event)

    //state-related
    const User = useSelector ( state => state.session.user)
    // const event = useSelector( state => state.events.oneEvent);
    console.log('event from SingleEventCard', event)
    const group = useSelector ( state => state.group.oneGroup)

    //useEffect-related
    useEffect(() => {
        dispatch(singleEventData(event?.id))
    }, [dispatch])
    
    // useEffect(() => {
    //     if (event.Group) {
    //         dispatch(getGroupDetails(event.Group.id))
    //     }
    // }, [event])

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
       

    let date = '', time = '', endDate = '', endTime = '', formattedTime = '', formattedEndTime = '';

    if (event?.startDate && event?.endDate) {
        // console.log("Original event.startDate:", event.startDate);
        // console.log("Original event.endDate:", event.endDate);
        
        ({ date, time } = splitDateTime(event?.startDate));
        // console.log("About to call splitDateTime with event.endDate:", event.endDate);
        ({ endDate, endTime } = splitEndTime(event?.endDate));
        
        // console.log("Extracted date:", date);
        // console.log("Extracted endDate:", endDate);
        // console.log('extracted endTime:', endTime)
        
        if (time) {
            formattedTime = convertToAMPM(time);
        }
    
        if (endTime) {
            formattedEndTime = convertToAMPM(endTime);
        } 
    }

    // //onClick
    // const handleDelete = async (e) => {
    //     e.preventDefault();
    //     console.log('eventId', eventId)
    //     await dispatch(deleteEvent(eventId)).then(history.push('/events'));
    // };

    // //buttons
    // let buttons;
    // if (User && User.id === group.organizerId) {
    //     buttons = (
    //         <div className='single-card-event-crud-buttons'>
    //             <button className='single-card-crud-delete-event' onClick={handleDelete}>Delete</button>
    //         </div>
    //     )
    // } else {
    //     buttons = (null)
    // }
    

    return (event && event.eventImages &&
        <>
            
            <div className="single-event-container">
                <div className="single-event-header-container">
                <Link className='single-event-link' to='/events'> Events </Link>
                    <h1 className="single-event-header-title">
                        {event.name}
                    </h1>
                    {/* <div className="single-event-header-host">
                        Hosted by: {group.Organizer?.firstName} {group.Organizer?.lastName}
                    </div> */}
                </div>
            

                <div className="single-event-mid-container">
                    <img className="single-event-mid-image" src={event.eventImages[0]?.url} alt={"an event image"}/>
                        <div className="single-event-mid-details-container">
                            <div className="single-event-mid-start-date">
                                {date} {formattedTime}
                            </div>
                            <div className="single-event-mid-end-date">
                                {endDate} {formattedEndTime}
                            </div>
                            <div className="single-event-mid-price">
                                price: {event.price}
                            </div>
                            <div className="single-event-mid-type">
                                {event.type}
                            </div>
                            </div>
                        </div>
                    <div className='single-event-details-container'>
    
                    <div className="single-event-details-content">
                        {event.description}
                    </div>
                </div>
            </div> 

        </>
    )

};

export default SingleEventCard;