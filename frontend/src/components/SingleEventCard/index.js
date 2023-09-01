import React, { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteEvent, getAllEvents, createEvent, newEventImage, singleEventData } from "../../store/events";
import { getGroupDetails  } from "../../store/groups";
import { useParams, useHistory, Link } from "react-router-dom";
import './SingleEventCard.css'

function SingleEventCard () {
    const { eventId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();

    //state-related
    const User = useSelector ( state => state.session.user)
    const event = useSelector( state => state.events.oneEvent );
    // console.log('event from SingleEventCard', event)
    const group = useSelector ( state => state.group.oneGroup)

    //useEffect-related
    useEffect(() => {
        dispatch(singleEventData(eventId))
    }, [dispatch])
    
    useEffect(() => {
        if (event.Group) {
            dispatch(getGroupDetails(event.Group.id))
        }
    }, [event])

    //date and time helper functions
    function splitDateTime(dateTimeString) {
        if (!dateTimeString) return { date: '', time: '' };
        const [date, fullTime] = dateTimeString.split('T');
        const time = fullTime ? fullTime.split('.')[0] : '';
        return { date, time };
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
        ({ date, time } = splitDateTime(event.startDate));
        ({ endDate, endTime } = splitDateTime(event.endDate));
    
        if (time) {
            formattedTime = convertToAMPM(time);
        }
    
        if (endTime) {
            formattedEndTime = convertToAMPM(endTime);
        } 
    }

    //onClick
    const handleDelete = async (e) => {
        e.preventDefault();
        console.log('eventId', eventId)
        await dispatch(deleteEvent(eventId)).then(history.push('/events'));
    };

    //buttons
    let buttons;
    if (User && User.id === group.organizerId) {
        buttons = (
            <div className='single-card-event-crud-buttons'>
                <button className='single-card-crud-delete-event' onClick={handleDelete}>Delete</button>
            </div>
        )
    } else {
        buttons = (null)
    }
    

    return (event && event.eventImages && group && group.GroupImages &&
        <>
            
            <div className="single-event-container">
                <div className="single-event-header-container">
                <Link className='single-event-link' to='/events'> Events </Link>
                    <h1 className="single-event-header-title">
                        {event.name}
                    </h1>
                    <div className="single-event-header-host">
                        Hosted by: {group.Organizer?.firstName} {group.Organizer?.lastName}
                    </div>
                </div>
            

                <div className="single-event-mid-container">
                    <img className="single-event-mid-image" src={event.eventImages[0]?.url} alt={"an event image"}/>
                    <div>
                        <Link className="single-event-mid-group-details-container" to={`/groups/${group.id}`}>
                            <img className="single-event-mid-group-image" src={group.GroupImages[0].url} />
                            <div className="single-event-mid-group-name">
                                {group.name}
                            </div>
                            <div className="single-event-mid-group-name">
                                {group.type}
                            </div>
                            <div>
                                {buttons}
                            </div>
                        </Link>
                        <div className="single-event-mid-details-container">
                            <div>
                                {date} {formattedTime}
                            </div>
                            <div>
                                {endDate} {formattedEndTime}
                                {/* FIX END DATE LATER */}
                            </div>
                            <div>
                                price: {event.price}
                            </div>
                            <div>
                                {event.type}
                            </div>
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