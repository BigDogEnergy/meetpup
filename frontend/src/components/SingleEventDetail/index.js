import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteEvent, getAllEvents, createEvent, newEventImage, singleEventData } from "../../store/events";
import { getGroupDetails  } from "../../store/groups";
import { useParams, useHistory, Link } from "react-router-dom";
import './SingleEventDetail.css'
import { Modal } from "../../context/Modal";

function SingleEventDetail () {
    const { eventId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();

    //state-related
    const User = useSelector ( state => state.session?.user)
    const event = useSelector( state => state.events?.oneEvent);
    const group = useSelector ( state => state.group?.oneGroup);
    const groupId = event?.Group?.id
    const groupImages = group?.GroupImages?.[0];

    const [ showModal, setShowModal ] = useState(false)
    const [ modalContent, setModalContent ] = useState('');


    //useEffect-related
    useEffect(() => {
        dispatch(singleEventData(eventId))
    }, [dispatch])
    
    useEffect(() => {
        if (groupId) {
            // console.log('event.Group', groupId)
            dispatch(getGroupDetails(groupId))
        }
    }, [event])

    //date and time helper functions
    function splitDateTime(dateTimeString) {
        const [date, fullTime] = dateTimeString.split('T');
        const time = fullTime ? fullTime.split('.')[0] : '';
        return { date, time } ;
    }
    
    function splitEndTime(dateTimeString) {
        const [endDate, fullTime] = dateTimeString.split('T');
        const endTime = fullTime ? fullTime.split('.')[0] : '';
        return { endDate, endTime } ;
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
        // console.log("Original event.startDate:", event.startDate);
        // console.log("Original event.endDate:", event.endDate);
        
        ({ date, time } = splitDateTime(event?.startDate));
        // console.log("About to call splitDateTime with event.endDate:", event.endDate);
        ({ endDate, endTime } = splitEndTime(event?.endDate));
        
        // console.log("Extracted date:", date);
        // console.log("Extracted endDate:", endDate);
        // console.log('extracted endTime:', endTime)
        
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
        setModalContent('deleteConfirmation');
        setShowModal(true);
    };

    const handleConfirmDelete = async (e) => {
        e.preventDefault();
        // console.log('eventId being deleted', eventId)
        await dispatch(deleteEvent(eventId)).then(history.push(`/groups/${groupId}`));
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        setModalContent('update-event')
        setShowModal(true)
    };

    //buttons
    let buttons;
    if (User && User.id === group.organizerId) {
        buttons = (
            <div className='single-card-event-crud-buttons'>
                <button className='single-card-crud-delete-event' onClick={handleDelete}>
                    Delete
                </button>
                <button className="single-card-crud-update-event" onClick={handleEdit}> 
                    Update
                </button>

            </div>
        )
    } else {
        buttons = (null)
    }
    

    return (event && event.eventImages && group && groupImages &&
        <>


        {showModal && (
            <Modal onClose={() => setShowModal(false)}>
                {modalContent === 'update-event' && (
                    <div className='feature-coming-soon'>
                        <div>Feature coming soon...</div>
                    </div>
                )}

                {modalContent === 'deleteConfirmation' && (
                    <div className="confirm-modal-content">
                        <div className="confirm-modal-title">
                            <div>Are you sure you want to delete this group?</div>
                        </div>
                        <div className="confirm-modal-options">
                            <button onClick={handleConfirmDelete}>Confirm (Delete Event)</button>
                            <button onClick={() => setShowModal(false)}>Cancel (Keep Event)</button>
                        </div>
                    </div>
                )}
            </Modal>
        )}
            
            <div className="single-eventDetail-container">
                <div className="single-event-header-container">
                    <div className='redirect-to-allCards'>
                        <div className='single-link-arrow'>&lt;</div>
                        <Link className='single-event-link' to='/events'> Events </Link>
                    </div>
                    <div className="single-event-header-title">
                        {event.name}
                    </div>
                    <div className="single-event-header-host">
                        Hosted by {group.Organizer?.firstName} {group.Organizer?.lastName}
                    </div>
                </div>
            
                <div className='single-event-body-container'>
                    <div className="single-event-mid-container">
                        <div className='single-card-image-container'>
                            <img className="single-event-mid-image" src={event?.eventImages[0]?.url} alt={"an event image"}/>
                        </div>

                        <div className="single-event-mid-details-container">
                            <div className='group-info-mid-right-upper-container'>
                                <div className='group-image-container'>
                                    <img className="single-event-mid-group-image" src={groupImages?.url} alt={"a group image"}/>
                                </div>
                                <div className='group-name-privacy'>
                                
                                    <div className='group-name-eventDetails'>{group.name}</div>
                                    <div className='group-privacy-eventDetails'>{group.private ? ' Private' : ' Public'}</div>
                                </div>
                            </div>

                            <div className="single-event-date-price-type-container">
                                <div className="single-event-date-container">
                                    <div className="single-event-date-icon">
                                        <i className="fas fa-clock"></i>
                                    </div>
                                    <div className="single-event-date-data">
                                        <div className="single-event-mid-start-date">
                                            START: {date} &middot; {formattedTime}
                                        </div>
                                        <div className="single-event-mid-end-date">
                                            END: {endDate} &middot; {formattedEndTime}
                                        </div>
                                    </div>
                                </div>
                               
                               <div className="single-event-mid-price-container">
                                    <div className="single-event-price-icon">
                                       <i className="fas fa-dollar-sign"></i>
                                    </div>
                                    <div className="single-event-mid-price">
                                        {event.price === 0 || event.price === "0" ? "FREE" : event.price}
                                    </div>
                               </div>
                                
                                <div className='single-event-mid-type-container'>
                                    <div className="single-event-map-icon">
                                        <i className="fas fa-map-marker-alt"></i>
                                    </div>
                                    <div className="single-event-mid-type">
                                        {event.type}
                                    </div>
                                    <div className='single-event-buttons'>
                                        {buttons}
                                    </div>
                                </div>
                            </div>
                              
                        </div>
                    </div>
                    <div className='single-event-details-container'>
                        <div className="details-title">
                            Description
                        </div>
                        <div className="single-event-details-content">
                            {event.description}
                        </div>
                    </div>    
                </div>
            </div> 

        </>
    )

};

export default SingleEventDetail;