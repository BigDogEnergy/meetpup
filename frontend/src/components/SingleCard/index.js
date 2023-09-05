import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory, Link } from 'react-router-dom';
import { deleteGroup, getGroupDetails } from '../../store/groups'
import './SingleCard.css'
import { Modal } from '../../context/Modal';
import { getAllEvents } from '../../store/events';
import SingleEventCard from '../SingleEventCard';

function SingleCard() {
    const { groupId } = useParams();
    let dispatch = useDispatch();
    let history = useHistory();

    //state variables
    const [ showModal, setShowModal ] = useState(false)
    const [ cardError, setCardError ] = useState('')
    const [loading, setLoading] = useState(true);

    const group = useSelector(state=> state.group.oneGroup)
    const User = useSelector(state=> state.session.user)
    const organizer = group?.Organizer
    const preview = group?.GroupImages?.[0]?.url || '';
    const currentDate = new Date();
    
    // console.log('!!!!!!!!!!group organizer', organizer)

    
    const upcomingEvents = useSelector(state => state.events.events);
    const filteredEventsArr = Object.values(upcomingEvents)
    // const filteredEvents = (filteredEventsArr || []).filter(event => event?.groupId === +groupId);
    const upcomingFilteredEvents = filteredEventsArr.filter(event => {
        const eventEndDate = new Date(event.endDate);
        return eventEndDate > currentDate && event.groupId === +groupId;
    });
    const uniqueEvents = [...new Set(upcomingFilteredEvents.map(event => event.id))].map(
        id => upcomingFilteredEvents.find(event => event.id === id)
    );

    //use effect
    useEffect(() => {
        dispatch(getGroupDetails(groupId))
    }, [groupId, dispatch]);

    useEffect(() => {
        dispatch(getAllEvents()).then(() => setLoading(false))
    }, [dispatch])

    //onClick related
    const handleEdit = async (e) => {
        e.preventDefault();
        history.push(`/groups/${groupId}/edit`)
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        // await dispatch(deleteGroup(groupId)).then(history.push('/groups'));
        setShowModal(true);
    };

    const handleConfirmDelete = async (e) => {
        e.preventDefault();
        await dispatch(deleteGroup(groupId)).then(history.push('/groups'));
        setShowModal(false);
    };

    const handleCancelDelete = async (e) => {
        e.preventDefault();
        setShowModal(false);
    }

    const handleEvent = async (e) => {
        e.preventDefault();
        history.push(`/groups/${group.id}/events/new`)
    }


    //buttons
    let buttons;
    if (User && User.id === group.organizerId) {
        buttons = (
            <div className='single-card-crud-buttons'>
                <button className='single-card-crud-create-event' onClick={handleEvent}>Create event</button>
                <button className='single-card-crud-edit-group' onClick={handleEdit}>Update</button>
                <button className='single-card-crud-delete-group' onClick={handleDelete}>Delete</button>
            </div>
        )
    } else if (User && User.id !== group.organizerId) {
        buttons = (
            <div className='single-card-create-membership'>
                <button className='create-group-membership-button'>Join this group</button>
            </div>
        )
    } else {
        buttons = (null)
    }

    return (
        <>
        {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <div className="confirm-modal-content">
                        <div className="confirm-modal-title">
                            <div>Are you sure you want to delete this group?</div>
                        </div>
                        <div className="confirm-modal-options">
                            <button onClick={handleConfirmDelete}>Confirm (Delete Group)</button>
                            <button onClick={() => setShowModal(false)}>Cancel (Keep Group)</button>
                        </div>
                    </div>
                </Modal>
            )}
            <Link className='back-to-groups-button' to='/groups'> &lt; Groups </Link> 
            <div className='single-card-container'>
                <div className='single-card-top'>
                    <img className='single-card-image' src={preview} alt="No Image"/>
                    <div className='single-card-top-info'>
                        <div className='single-card-top-name'>
                            {group.name}
                        </div>
                        <div className='single-card-top-location'>
                            {group.city}, {group.state}
                        </div>
                        <div className='single-card-top-privacy-status'>
                           {uniqueEvents.length} events &middot;  {group.private ? 'Private' : 'Public'}
                        </div>
                        <div className='single-card-top-organizer-fullname'>
                            Organized by: {group.Organizer?.firstName} {group.Organizer?.lastName}
                        </div>
                        <div className='single-card-top-buttons'>
                            {buttons}
                        </div>
                    </div>
                </div>

                <div className='single-card-bottom'>
                    <div className='single-card-bottom-top-container'>
                        <h2>Organizer</h2>
                        <div> {group.Organizer?.firstName} </div>
                    </div>
                    <div className='single-card-bottom-mid-container'>
                        <h2>What we're about</h2>
                        <div>{group.about}</div>
                    </div>

                    <div className='single-card-events-container'> 
                        {loading ? (
                            <div className='loading-notification'>Loading events...</div>
                        ): uniqueEvents.length === 0 ? (
                            <div className='no-upcoming-events-text'>No upcoming events</div>
                        ) : (
                            uniqueEvents.map(event => (
                                <SingleEventCard key={event.id} event={event} />
                            ))
                        )}
                    </div>

                </div>
            </div>
        </>
    )

};

export default SingleCard;