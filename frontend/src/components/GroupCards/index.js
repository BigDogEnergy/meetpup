import React from 'react';
import { Link } from 'react-router-dom';
import './GroupCards.css'

function GroupDetails ({ group }) {
    return (
        <Link className="group-card-container" to={`/groups/${group.id}`}>
            <div className="group-card-img-container">
                <img className='group-card-img' src={group.previewImage} />
            </div>
            <div className='group-card-details'>

                <div className='group-card-top'>
                    <div className='group-card-details-name'>
                        {group.name}
                    </div>
                    <div className='group-card-details-location'>
                        {group.city}, {group.state}
                    </div>
                </div>
                
                <div className='group-card-details-about'>
                    {group.about}
                </div>

                <div className='group-card-bottom'>
                    <div className='group-card-details-members'>
                        {group.numMembers}
                    </div>
                    <div className='group-card-details-private'>
                        {group.private ? 'Private' : 'Public'}
                    </div>
                </div>
                
            </div>
        </Link>
    );
};

export default GroupDetails