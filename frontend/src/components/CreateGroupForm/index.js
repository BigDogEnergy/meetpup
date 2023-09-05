import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createGroup, addGroupImage } from '../../store/groups'
import './CreateGroupForm.css'

function CreateGroupForm() {

    const dispatch = useDispatch();
    const history = useHistory();

    //state-related

    const User = useSelector(state => state.session.user);
    if (!User) {
        history.push('/')
    };

    //field selector states
    const [ name, setName ] = useState('');
    const [ about, setAbout ] = useState('');
    const [ type, setType ] = useState('');
    const [ privacy, setPrivacy ] = useState('');
    const [ city, setCity ] = useState('');
    const [ state, setState ] = useState('');
    const [ url, setUrl ] = useState('');
    const [ isLoaded, setIsLoaded ] = useState(false)

    //field error states
    const [ nameErr, setNameErr ] = useState('');
    const [ aboutErr, setAboutErr ] = useState('');
    const [ typeErr, setTypeErr ] = useState('');
    const [ privacyErr, setPrivacyErr ] = useState('');
    const [ cityErr, setCityErr ] = useState(''); 
    const [ stateErr, setStateErr ] = useState('');
    const [ urlErr, setUrlErr ] = useState('')
    const [ renderErr, setRenderErr ] = useState('');
    const [ fieldErrors, setFieldErrors ] = useState('');



    //use-effect
    useEffect (() => {

        //name
        if (!name.length) {
            setNameErr('Name is required')
        } else {
            setNameErr('')
        };

        //about
        if (!about.length || about.length < 50 ) {
            setAboutErr('Description must be at least 50 characters long')
        } else {
            setAboutErr('')
        };

        //location
        if (!city.length) {
            setCityErr('City is required')
        } else {
            setCityErr('')
        };
        
        if (!state.length) {
            setStateErr('State is required')
        } else {
            setStateErr('')
        };

        //type
        if (!type.length) {
            setTypeErr('Group Type is required')
        } else {
            setTypeErr('')
        };

        //private
        if (!privacy.length) {
            setPrivacyErr('Visibility Type is required')
        } else {
            setPrivacyErr('')
        };

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
        }


    }, [name, about, city, state, privacy, type, url, dispatch]);

    //On Submits

    const handleSubmit = async (e) => {
        e.preventDefault();
        setRenderErr(true);

        console.log(nameErr, aboutErr, typeErr, privacyErr, cityErr, stateErr, urlErr);

        if (         
            !nameErr &&
            !aboutErr &&
            !typeErr &&
            !privacyErr &&
            !cityErr &&
            !stateErr &&
            !urlErr
        ) {
            const payload = {
                organizerId: User.id,
                name,
                about,
                type,
                private: privacy, 
                city, 
                state, 
            }

            console.log("payload",payload);

            try {
                const newGroup = await dispatch(createGroup(payload))
                const newImg = {
                    id: newGroup.id,
                    url: url,
                    preview: true
                };

                if (url.length > 0) {
                    const response = dispatch(addGroupImage(newGroup.id, newImg))
                };

                history.push(`/groups/${newGroup.id}`)

            } catch(error) {
                console.error('Error in handleSubmit:', error);
            };   
        };         
        
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="create-group-container">

                    <div className='create-group-header-container'>
                        <div className='create-group-header-title'>
                            Start a New Group
                        </div>
                        <div className='create-group-header-text'> 
                            We'll walk you through a few steps to build your local community 
                        </div>
                    </div>

                    <div className='create-group-location-container'>
                        <div className='create-group-location-title'>
                           Set your group's location
                        </div>
                        <div className='create-group-location-text'>
                            Meetup groups meet locally, in person, and online. We'll connect you with people in your area.
                        </div>
                        <input 
                            className='create-group-location-city-input'
                            type='text'
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder='Enter City'/>
                        <div className='error-msg'>
                            {!!renderErr && cityErr.length > 0 && cityErr}
                        </div>
                        <input 
                            className='create-group-location-state-input'
                            type='text'
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder='Enter State'/>
                        <div className='error-msg'>
                            {!!renderErr && stateErr.length > 0 && stateErr}
                        </div>
                    </div>

                    <div className='create-group-name-container'>
                        <div className='create-group-name-title'>
                            What will your group's name be?
                        </div>
                        <div className='create-group-name-text'>
                            Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.
                        </div>
                        <input 
                            className='create-group-name-input'
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='What is your group name?'/>
                        <div className='error-msg'>
                            {!!renderErr && nameErr.length > 0 && nameErr}
                        </div>
                    </div>

                    <div className='create-group-about-container'>
                        <div className='create-group-about-title'>
                            Describe the purpose of your group
                        </div>
                        <div className='create-group-about-text'>
                            People will see this when you promote your group.
                            <ol>
                                <li>What's the purpose of the group?</li>
                                <li>Who should join?</li>
                                <li>What will you do at your events?</li>
                            </ol>
                        </div>
                        <input
                            className='create-group-about-input'
                            type='text'
                            maxLength={1000}
                            minLength={50}
                            value={about}
                            onChange={(e) => setAbout(e.target.value)} 
                            placeholder='Please write at least 50 characters'/>
                        <div className='error-msg'>
                            {!!renderErr && aboutErr.length > 0 && aboutErr}
                        </div>
                    </div>

                    <div className='create-group-steps-container'>
                        <div className='create-group-steps-type-text'>
                            Is this an in person or online group?
                        </div>
                        <select
                            className='create-group-type-input'
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
                        <div className='error-msg'>
                            {!!renderErr && typeErr.length > 0 && typeErr}
                        </div>

                        <div className='create-group-steps-privacy-text'>
                            Is this group private or public?
                        </div>
                        <select
                            className='create-group-privacy-input'
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
                        <div className='error-msg'>
                            {!!renderErr && privacyErr.length > 0 && privacyErr}
                        </div>

                        <div className='create-group-add-image-text'>
                            Please add an image url for your group below:
                        </div>
                        <input 
                            className='create-group-add-image-input'
                            type='text'
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder='Please add image URL'/>
                        <div className='error-msg'>
                            {!!renderErr && urlErr.length > 0 && urlErr}
                        </div>
                    </div>
    

                    <div className='create-group-submit-button-container'>
                        <button 
                            className='create-group-submit-button'
                            type='submit'
                            disabled={renderErr.length}
                            >
                            Create Group
                        </button>
                    </div>
                </div>
            </form>
        </div>
        
    )

};

export default CreateGroupForm