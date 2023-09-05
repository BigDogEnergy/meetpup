import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import { createEvent, newEventImage } from "../../store/events";
import { getAllGroups } from "../../store/groups";

import './CreateEventForm.css'

function CreateEventForm() {

    const { groupId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();

    //helper for dates
    const formatDate = (date) => {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    }

    //helper for time to be added to date
    const formatDateTime = (date, time) => {
        return `${date} ${time}:00`;
    }
    

    //state-related
    // const User = useSelector(state => state.session.user);
    const allGroups = useSelector(state => state.group?.groups)
    // console.log("Create Event Form - allGroups",allGroups)
    const groupName = allGroups[groupId]?.name || "";

    //field states
    const [ venue, setVenue ] = useState('');
    const [ name, setName ] = useState('');
    const [ type, setType ] = useState('');
    const [ privacy, setPrivacy ] = useState('');
    const [ capacity, setCapacity ] = useState('');
    const [ price, setPrice ] = useState('');
    const [ url, setUrl ] = useState('')
    const [ about, setAbout ] = useState('')
    const [ startTime, setStartTime ] = useState('');
    const [ endTime, setEndTime ] = useState('');
    const [ startDate, setStartDate ] = useState('');
    const [ endDate, setEndDate ] = useState('');    

    //field-error related
    const [ venueErr, setVenueErr ] = useState('');
    const [ nameErr, setNameErr ] = useState('');
    const [ typeErr, setTypeErr ] = useState('');
    const [ privacyErr, setPrivacyErr ] = useState('');
    const [ capacityErr, setCapacityErr ] = useState('');
    const [ priceErr, setPriceErr ] = useState('');
    const [ startDateErr, setStartDateErr ] = useState('');
    const [ endDateErr, setEndDateErr ] = useState('');
    const [ urlErr, setUrlErr ] = useState('');
    const [ aboutErr, setAboutErr ] = useState('');
    const [ renderErr, setRenderErr ] = useState('');
    const [ startTimeErr, setStartTimeErr ] = useState('');
    const [ endTimeErr, setEndTimeErr ] = useState('');

    //use-effect
    useEffect (() => {
        
        //start-time error handler
        if (!startTime) {
            setStartTimeErr('A start time is required')
        } else {
            setStartTimeErr('')
        };

        //end-time error handler
        if (!endTime) {
            setEndTimeErr('An end time is required')
        } else {
            setEndTimeErr('')
        }

        //venue error handler -- FEATURE NOT IMPLEMENTED
        // if (!venue.length) {
        //     setVenueErr('')
        // } else {
        //     setVenueErr('Venue is required')
        // };

        //name error handler
        if (!name.length) {
            setNameErr('Name is required')
        } else {
            setNameErr('')
        };

        //type error handler
        if (!type.length) {
            setTypeErr('Event Type is required')
        } else {
            setTypeErr('')
        };

        //privacy error handler
        if (!privacy.length) {
            setPrivacyErr('Visibility is required')
        } else {
            setPrivacyErr('')
        };

        //about error handler
        if (!about.length || about.length < 50) {
            setAboutErr('Description must be at least 50 characters')
        } else {
            setAboutErr('')
        };

        //price error handler
        if (!price.length) {
            setPriceErr('Price is required')
        } else {
            setPriceErr('')
        };

        //startDate error handler
        if (!startDate.length) {
            setStartDateErr('Event start is required')
        } else if (startDate - new Date() < 0) {
            setStartDateErr('Start date must be in the future')
        } else {
            setStartDateErr('')
        };
        // const currentDate = new Date();
        // if (new Date(startDate) <= currentDate) {
        //     setStartDateErr('Start date must be in the future');
        // }

        //endDate error handler
        if (!endDate.length) {
            setEndDateErr('Event end is required')
        } else if (endDate - startDate < 0) {
            setEndDateErr('The Event end date must be after the start date')
        } else {
            setEndDateErr('')
        };
        // if (new Date(endDate) <= new Date(startDate)) {
        //     setEndDateErr('The Event end date must be after the start date');
        // }


       //url
            const urlValidation = str => {
                return /(https?:\/\/.*\.(?:png|jpg|jpeg))/.test(str);
            }
    
        if (!url.length) {
            setUrlErr('Image url must end in .png, .jpg, or .jpeg')
        } else if (url.length && !urlValidation(url)) {
            setUrlErr('Invalid image URL provided')
        } else {
            setUrlErr('')
        };


    }, [url, endDate, startDate, price, privacy, type, name, venue, dispatch])

    //onSubmit

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('handleSubmit was clicked')
        setRenderErr(true)
    
        // console.log('urlErr', urlErr);
        // console.log('endDateErr', endDateErr);
        // console.log('startDateErr', startDateErr);
        // console.log('priceErr', priceErr);
        // console.log('privacyErr', privacyErr);
        // console.log('typeErr', typeErr);
        // console.log('nameErr', nameErr);
        // console.log('venueErr', venueErr);

        if (
            !urlErr && 
            !endDateErr &&
            !startDateErr &&
            !priceErr &&
            !privacyErr &&
            !typeErr &&
            !nameErr
            // !venueErr 
        ) {

            const formattedStartDate = formatDateTime(startDate, startTime);
            const formattedEndDate = formatDateTime(endDate, endTime);    
            // const formattedPrice = (parseFloat(price))

            const payload = {
                venueId: 1,  // FUTURE FEATURE UPDATE
                name: name,
                type: type,
                capacity: 10,  // FUTURE FEATURE UPDATE
                price: price,
                description: about,
                startDate: formattedStartDate,
                endDate: formattedEndDate
            }

            console.log("this is the payload", payload)

            const newEvent = await dispatch(createEvent(groupId, payload))
            
            console.log(newEvent, "This is the new event we are receiving back")

            const newPic = {
                url: url,
                preview: true
            };

            if (newPic.url.length > 0 ) {
                // console.log("!!!!!!!!!!!!!", newPic)
                // console.log("newEvent.id", newEvent.id)
                dispatch(newEventImage(newEvent.id, newPic.url))
            }
            history.push(`/events/${newEvent.id}`)

        }
    }

    return (   
            <form onSubmit={handleSubmit}> 
                <div className='create-event-form-container'>
                    <div className="create-event-form-header">
                        <div className='create-event-form-title'>
                            Create an event for {groupName}
                        </div>
                        <div className="create-event-form-title-text">
                            What is the name of your event?
                        </div>
                        <input
                            className="create-event-name-input"
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Event Name"
                            />
                        <div className="error-msg">
                            {!!renderErr && nameErr.length > 0 && nameErr}
                        </div>
                    </div>

                    <div className="create-event-mid-1">
                        <div>
                             Is this an In Person or Online event?
                        </div>
                        <select
                            className='create-event-type-input'
                            type='text'
                            value={type}
                            onChange={(e) => setType(e.target.value)}>    
                            <option></option>                        
                            <option value={'In person'}>
                                In Person
                            </option>
                            <option value={'Online'}>
                                Online
                            </option>
                        </select>
                        <div className="error-msg">
                            {!!renderErr && typeErr.length > 0 && typeErr}
                        </div>

                        <div className='create-event-steps-privacy-text'>
                            Is this event private or public?
                        </div>
                        <select
                            className='create-event-privacy-input'
                            type='text'
                            value={privacy}
                            onChange={(e) => setPrivacy(e.target.value)}>     
                            <option></option>                       
                            <option value={'true'}>
                                Private
                            </option>
                            <option value={'false'}>
                                Public
                            </option>
                        </select>
                        <div className="error-msg">
                            {!!renderErr && privacyErr.length > 0 && privacyErr}
                        </div>
                        <div className="create-event-price-input-text">
                            What is the price for your event?
                        </div>

                        <input 
                            type='number'
                            min='0'
                            step="1"
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0"
                            />

                        <div className="error-msg">
                            {!!renderErr && priceErr.length > 0 && priceErr}
                        </div>
                    </div>

                    <div className="create-event-mid-2">
                        <div>
                            When does your event start?
                        </div>
                        <input type='date' value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                        <div className="error-msg">
                            {!!renderErr && startDateErr.length > 0 && startDateErr}
                        </div>

                        <input type='time' value={startTime} onChange={(e) => setStartTime(e.target.value)}/>
                        <div className="error-msg">
                            {!!renderErr && startTimeErr}
                        </div>


                        <div>
                            When does your event end?
                        </div>
                        <input type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
                        <div className="error-msg">
                            {!!renderErr && endDateErr.length > 0 && endDateErr}
                        </div>

                        <input type='time' value={endTime} onChange={(e) => setEndTime(e.target.value)}/>
                        <div className="error-msg">
                            {!!renderErr && endTimeErr}
                        </div>
                    </div>

                    <div className="create-event-image-input">
                        <div className='create-event-add-image-text'>
                            Please add an image url for your event below:
                        </div>
                        <input 
                            className='create-event-add-image-input'
                            type='text'
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder='Image URL'/>
                        <div className="error-msg">
                            {!!renderErr && urlErr.length > 0 && urlErr}
                        </div>
                    </div>

                    <div className='create-event-about-container'>
                        <div className='create-event-about-text'>
                            Describe your event:            
                        </div>
                        <input
                            className='create-event-about-input'
                            type='text'
                            maxLength={1000}
                            minLength={50}
                            value={about}
                            onChange={(e) => setAbout(e.target.value)} 
                            placeholder='Please include at least 50 characters'
                            />
                            <div className="error-msg">
                                {!!renderErr && aboutErr.length > 0 && aboutErr}
                            </div>
                    </div>

                    <div className='create-event-submit-button-container'>
                        <button 
                            className='create-event-submit-button'
                            type='submit'
                            // disabled={renderErr}
                        >
                            Create Event
                        </button>
                    </div>
                </div>
            </form>
        
    )
};

export default CreateEventForm;