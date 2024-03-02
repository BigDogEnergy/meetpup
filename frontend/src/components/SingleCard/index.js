import React, { useEffect, useState } from 'react';
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
    const [ loading, setLoading ] = useState(true);
    const [ modalContent, setModalContent ] = useState('');
    const [ groupLoading, setGroupLoading ] = useState(true);


    const group = useSelector(state=> state.group.oneGroup)
    const User = useSelector(state=> state.session.user)
    const organizer = group?.Organizer
    const preview = group?.GroupImages?.[0]?.url || '';
    const currentDate = new Date();
    
    const upcomingEvents = useSelector(state => state.events.events);
    const filteredEventsArr = Object.values(upcomingEvents)
    // const filteredEvents = (filteredEventsArr || []).filter(event => event?.groupId === +groupId);
    const upcomingFilteredEvents = filteredEventsArr.filter(event => {
        const eventEndDate = new Date(event.endDate);
        return eventEndDate > currentDate && event.groupId === +groupId;
    });

    //unique events -- workaround for duplicate issue.
    const uniqueEvents = [...new Set(upcomingFilteredEvents.map(event => event.id))].map(
        id => upcomingFilteredEvents.find(event => event.id === id)
    );

    //future events
    const futureEventsCount = uniqueEvents.filter(event => {
        const eventStartDate = new Date(event.startDate);
        return eventStartDate > currentDate;
    }).length;
    
    //past events
    const getUniquePastEvents = (events) => {
        const pastFilteredEvents = events.filter(event => {
            const eventEndDate = new Date(event.endDate);
            return eventEndDate <= currentDate && event.groupId === +groupId;
        });
        return [...new Set(pastFilteredEvents.map(event => event.id))].map(
            id => pastFilteredEvents.find(event => event.id === id)
        );
    }
    
    const uniquePastEvents = getUniquePastEvents(filteredEventsArr);
    const uniquePastEventsCount = uniquePastEvents.length;
    console.log('unique past events count', uniquePastEventsCount)
    console.log('unique past events', uniquePastEvents)



    //use effect
    useEffect(() => {
        dispatch(getGroupDetails(groupId)).then(() => setGroupLoading(false));
    }, [groupId, dispatch]);

    useEffect(() => {
        dispatch(getAllEvents()).then(() => setLoading(false))
    }, [dispatch])

    //onClick related
    const handleEdit = async (e) => {
        e.preventDefault();
        history.push(`/groups/${groupId}/edit`)
    };

    const handleDelete = (e) => {
        e.preventDefault();
        setModalContent('deleteConfirmation');
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

    const handleJoinRequest = (e) => {
        e.preventDefault();
        setModalContent('joinGroup');
        setShowModal(true);
    };
    


    //buttons
    let buttons;
    if (User && User.id === group.organizerId) {
        buttons = (
            <div className='single-card-crud-buttons'>
                <button className='single-card-crud-event' onClick={handleEvent}>Create event</button>
                <button className='single-card-crud-event' onClick={handleEdit}>Update</button>
                <button className='single-card-crud-event' onClick={handleDelete}>Delete</button>
            </div>
        )
    } else if (User && User.id !== group.organizerId) {
        buttons = (
            <div className='single-card-create-membership'>
                <button className='create-group-membership-button' onClick={handleJoinRequest}>Join this group</button>
            </div>
        )
    } else {
        buttons = (null)
    }

    return (
        <>
        {showModal && (
            <Modal onClose={() => setShowModal(false)}>
                {modalContent === 'joinGroup' && (
                    <div className='feature-coming-soon'>
                        <div>Feature coming soon...</div>
                    </div>
                )}

                {modalContent === 'deleteConfirmation' && (
                    <div className="confirm-modal-content">
                        <div className="confirm-modal-title">
                            Confirm Delete
                        </div>
                        <div className="confirm-modal-text">
                            Are you sure you want to delete this group?
                        </div>
                        <div className="confirm-modal-option-1">
                            <button className='single-card-crud-event-red' onClick={handleConfirmDelete}>Confirm (Delete Group)</button>
                        </div>
                        <div className="confirm-modal-option-2">
                            <button className='single-card-crud-event' onClick={() => setShowModal(false)}>Cancel (Keep Group)</button>
                        </div>

                    </div>
                )}
            </Modal>
        )}

        {( loading || groupLoading) ? (
            <div className="loading-container">
                Loading...
            </div>
        ) : (
            <div className="single-eventDetail-container">
                <div className="event-header-container">
                    <div className='redirect-to-allCards'> 
                        <div className='single-link-arrow'>&lt;</div>
                        <Link className='single-event-link' to='/groups'>Groups </Link> 
                    </div>
                </div>
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
                    <div className='single-event-body-container'>
                        <div className='single-group-body-container'>
                            <div className='single-card-bottom-top-container'>
                                <div className='single-card-top-name'>Organizer</div>
                                <div className='single-card-top-location'> {group.Organizer?.firstName} </div>
                            </div>
                            <div className='single-card-bottom-mid-container'>
                                <div className='single-card-top-name'>What we're about</div>
                                <div className='single-card-about'>{group.about}</div>
                            </div>

                            <div className='single-card-events-container'> 
                                <div className='single-card-top-name'> 
                                    Upcoming Events({futureEventsCount})
                                </div>
                                
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

                            <div className='single-card-events-container'>
                                <div className='single-card-top-name'>
                                    Past Events({uniquePastEventsCount})
                                </div>
                                <div>
                                {loading ? (
                                    <div className='loading-notification'>Loading events...</div>
                                ): uniquePastEvents.length === 0 ? (
                                    <div className='no-upcoming-events-text'>No upcoming events</div>
                                ) : (
                                    uniquePastEvents.map(event => (
                                        <SingleEventCard key={event.id} event={event} />
                                    ))
                                )}
                                </div>
                                
                            </div>

                        </div>
                    </div>
                </div>
            
            </div>)}
            
                
        </>
    )

};

export default SingleCard;