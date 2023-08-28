import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory, Link } from 'react-router-dom';
import { getGroupDetails } from '../../store/groups'
import './SingleCard.css'

function SingleCard() {
    const { groupId } = useParams();
    let dispatch = useDispatch();
    let history = useHistory();

    //state variables

    const [ cardError, setCardError ] = useState('')

    const group = useSelector(state=> state.group.oneGroup)
    // console.log("SingleCard index group", group)
    const User = useSelector(state=> state.session.user)
    const organizer = group.Organizer
    // const preview = group?.GroupImages[0]?.url
    //uSeSelector grabbing each time might need to be a useEffect or additional async login
    

    //use effect

    useEffect(() => {
        dispatch(getGroupDetails(groupId))
    }, [groupId, dispatch]);


    //onClick related

    //xxxxxxadd stuff here when we see everything loads

    //buttons
    let buttons;
    if (User && User.id === group.organizerId) {
        buttons = (
            <div>add buttons later</div>
        )
    } else {
        buttons = (null)
    }

    

    return (
        <>
            <div className='back-to-groups-button'> Groups </div> 
            <div className='single-card-container'>
                <div className='single-card-top'>
                    <div className='single-card-image'>
                        placeholder div for img, there were conditional loading errors for the below code. Fix later
                        {/* {preview} */}
                    </div>
                    <div className='single-card-top-info'>
                        <h2 className='single-card-top-name'>
                            {group.name}
                        </h2>
                        <div className='single-card-top-location'>
                            {group.city}, {group.state}
                        </div>
                        <div className='single-card-top-privacy-status'>
                            {group.private ? 'Private' : 'Public'}
                        </div>
                        <div className='single-card-top-organizer-fullname'>
                            Organized by:
                        </div>
                        <div className='single-card-top-buttons'>
                            {buttons}
                        </div>
                    </div>
                </div>

                <div className='single-card-bottom'>
                    <div className='single-card-bottom-top-container'>
                        <h2>Organizer</h2>
                        {/* <div>{group.Organizer.username}</div> */}
                    </div>
                    <div className='single-card-bottom-mid-container'>
                        <h2>What we're about</h2>
                        <div>{group.about}</div>
                    </div>
                    <div className='single-card-events-container'>Events here</div>
                </div>
            </div>
        </>
    )

};

export default SingleCard;