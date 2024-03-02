import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import './EventDetails.css'
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents } from "../../store/events";

function EventDetails({ event }) {

    const dispatch = useDispatch();

    //date and time
    function splitDateTime(dateTimeString) {
        const [date, fullTime] = dateTimeString.split('T');
        const time = fullTime.split('.')[0]
        return { date, time };
    }

    function convertToAMPM(timeString) {
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

    const { date, time } = splitDateTime(event.startDate)
    const formattedTime = convertToAMPM(time)

    // console.log("date and time", date, time)

    return (

    <Link className="group-card-link-container" to={`/events/${event.id}`}>
        <div className='group-card-container'>
            <div className="group-card-img-container">
                <img className='group-card-img' src={event.previewImage} alt='Event preview' />
            </div>
            <div className='group-card-details'>

                <div className='group-card-top'>
                    <div className='group-card-details-date'>   
                        {date} &middot; {formattedTime}
                    </div>
                    <div className='group-card-details-name'>
                        {event.Group.name}
                    </div>
                    <div className='group-card-details-location'>
                        {event.Venue.city}, {event.Venue.state}
                    </div>
                </div>
                
                <div className='group-card-details-about'>
                    {event.description}
                </div>
            </div>
        </div>    
     </Link>
    )

}

export default EventDetails;