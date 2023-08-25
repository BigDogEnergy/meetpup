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
    // const preview = group.GroupImages[0].url

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
            <div>add buttons</div>
        )
    } else {
        buttons = (null)
    }

    

    return (
        <div className='single-card-container'>
            {/* <link to='/groups'> Groups </link> */}
            <div className='single-card-top'>
                <div className='single-card-image'>placeholder div for img, there were conditional loading errors for the below code. Fix later</div>
            {/* {preview ? (
                <img src={preview} alt="Group Preview" />
                ) : (
                <div>lolbrokeAF</div>
                )} */}
                <div className='single-card-top-name'>
                    {group.name}
                </div>
                <div className='single-card-top-location'>
                    {group.city}, {group.state}
                </div>
                <div className='single-card-top-privacy-status'>
                    {group.private ? 'Private' : 'Public'}
                </div>
                <div>
                    {/* Organized by {organizer.firstName} */}
                </div>
                {/* <div className='single-card-top-empty-space'></div> */}
                <div className='single-card-top-buttons'>
                    {buttons}
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
    )

};

export default SingleCard;