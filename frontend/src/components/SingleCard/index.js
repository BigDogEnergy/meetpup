import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory, Link } from 'react-router-dom';
import { deleteGroup, getGroupDetails } from '../../store/groups'
import './SingleCard.css'
// import ConfirmationModal from '../ConfirmationModal/index'
import { Modal } from '../../context/Modal';

function SingleCard() {
    const { groupId } = useParams();
    let dispatch = useDispatch();
    let history = useHistory();

    //state variables
    const [ showModal, setShowModal ] = useState(false)
    const [ cardError, setCardError ] = useState('')

    const group = useSelector(state=> state.group.oneGroup)
    // console.log("SingleCard index group", group)
    const User = useSelector(state=> state.session.user)
    const organizer = group?.Organizer
    // console.log('singleCard organizer', organizer)
    const preview = group?.GroupImages?.[0]?.url || '';
    // console.log('singleCard preview', preview)

    //useSelector grabbing each time might need to be a useEffect or additional async login
    

    //use effect
    useEffect(() => {
        dispatch(getGroupDetails(groupId))
    }, [groupId, dispatch]);


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
    } else {
        buttons = (null)
    }

    

    return (
        <>
        {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <div className="confirm-modal-content">
                        <div className="confirm-modal-title">
                            <p>Are you sure you want to delete this group?</p>
                        </div>
                        <div className="confirm-modal-options">
                            <button onClick={handleConfirmDelete}>Confirm (Delete Group)</button>
                            <button onClick={() => setShowModal(false)}>Cancel (Keep Group)</button>
                        </div>
                    </div>
                </Modal>
            )}
            <Link className='back-to-groups-button' to='/groups'> Groups </Link> 
            <div className='single-card-container'>
                <div className='single-card-top'>
                    <img className='single-card-image' src={preview} alt="No Image"/>
                    <div className='single-card-top-info'>
                        <h2 className='single-card-top-name'>
                            {group.name}
                        </h2>
                        <div className='single-card-top-location'>
                            {group.city}, {group.state}
                        </div>
                        <div className='single-card-top-privacy-status'>
                            Type: {group.private ? 'Private' : 'Public'}
                        </div>
                        <div className='single-card-top-organizer-fullname'>
                            Organized by: {group.Organizer?.firstName}
                        </div>
                        <div className='single-card-top-buttons'>
                            {buttons}
                        </div>
                    </div>
                </div>

                <div className='single-card-bottom'>
                    <div className='single-card-bottom-top-container'>
                        <h2>Organizer</h2>
                        <div>{group.Organizer?.firstName} {group.Organizer?.lastName}</div>
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