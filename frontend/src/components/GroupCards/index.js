import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './GroupCards.css'

function GroupDetails ({ group }) {


const groupIdToCount = group.id
console.log('groupIdToCount', groupIdToCount)
const eventsArray = useSelector(state => state.events.events);
console.log('eventsArray', eventsArray)
const count = eventsArray.filter(event => event.groupId === groupIdToCount).length;
console.log('filtered events',count)


    return (
        <Link className="group-card-link-container" to={`/groups/${group.id}`}>
            <div className='group-card-container'>
                
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
                            {count} events &middot; 
                            {group.private ? ' Private' : ' Public'}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default GroupDetails