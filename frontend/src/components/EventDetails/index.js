import React from "react";
import { Link } from 'react-router-dom';
import './EventDetails.css'

function EventDetails({ event }) {

    console.log('this is the threaded event', event)

    return (
        <Link className="group-card-container" to={`/events/${event.id}`}>
            <div className="group-card-img-container">
                <img className='group-card-img' src={event.previewImage} />
            </div>
            <div className='group-card-details'>

                <div className='group-card-top'>
                    <div className='group-card-details-name'>
                        {event.name}
                    </div>
                    <div className='group-card-details-location'>
                        {event.city}, {event.state}
                    </div>
                </div>
                
                <div className='group-card-details-about'>
                    {event.description}
                </div>

                <div className='group-card-bottom'>
                    <div className='group-card-details-members'>
                        {event.numMembers}
                    </div>
                    <div className='group-card-details-private'>
                        {event.Group.private ? 'Private' : 'Public'}
                    </div>
                </div>
                
            </div>
        </Link>
    )

}

export default EventDetails;