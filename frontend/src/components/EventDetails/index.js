import React from "react";
import { Link } from 'react-router-dom';
import './EventDetails.css'

function EventDetails({ event }) {

    console.log('this is the threaded event', event)

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
        <Link className="group-card-container" to={`/events/${event.id}`}>
            <div className="group-card-img-container">
                <img className='group-card-img' src={event.previewImage} alt='Event preview' />
            </div>
            <div className='group-card-details'>

                <div className='group-card-top'>
                    <div className='group-card-details-date'>   
                        {date} @ {formattedTime}
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
        </Link>
    )

}

export default EventDetails;