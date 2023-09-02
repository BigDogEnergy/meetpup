import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { updateGroup, getGroupDetails, deleteGroup, addGroupImage } from "../../store/groups";
import './EditGroupForm.css'

function EditGroupForm({ groups }) {
    
    const dispatch = useDispatch();
    const history = useHistory();
    const { groupId } = useParams();


    //useEffect #1
    useEffect(() => {
        dispatch(getGroupDetails(groupId))
    }, [])

    //state variables
    const group = useSelector(state => state.group.oneGroup);
    console.log("edit group", group)
    const User = useSelector(state => state.session.user);
    if (!User) {
        history.push('/')
    };

    //field selector states
    const [ name, setName ] = useState(group?.name);
    const [ about, setAbout ] = useState(group?.about);
    const [ type, setType ] = useState('');
    const [ privacy, setPrivacy ] = useState('');
    const [ city, setCity ] = useState(group?.city);
    const [ state, setState ] = useState(group?.state);
    const [ url, setUrl ] = useState(group?.GroupImages[0]?.url);
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
    

    //use-effect #2
    useEffect (() => {

        //name
        if (!name?.length) {
            setNameErr('Name is required')
        } else {
            setNameErr('')
        };

        //about
        if (!about?.length || about.length < 50 ) {
            setAboutErr('Description must be at least 50 characters long')
        } else {
            setAboutErr('')
        };

        //location
        if (!city?.length) {
            setCityErr('City is required')
        } else {
            setCityErr('')
        };
        
        if (!state?.length) {
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

        // //url
        //     const urlValidation = str => {
        //         return /(https?:\/\/.*\.(?:png|jpg|jpeg))/.test(str);
        //     }

        // if (!url.length) {
        //     setUrlErr('Image url must end in .png, .jpg, or .jpeg')
        // } else if (url.length && !urlValidation(url)) {
        //     setUrlErr('Invalid image URL provided')
        // } else {
        //     setUrlErr('')
        // }


    }, [name, about, city, state, privacy, type, dispatch]);

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
                // organizerId: User.id,
                name,
                about,
                type,
                private: privacy, 
                city, 
                state, 
            }

            console.log("payload",payload);

            try{
                const updatedGroup = await dispatch(updateGroup(payload, groupId))
                // const newImg = {
                //     id: updatedGroup.id,
                //     url: url,
                //     preview: true
                // };

                // if (url.length > 0) {
                //     const response = dispatch(addGroupImage(updatedGroup.id, newImg))
                // };

                history.push(`/groups/${updatedGroup.id}`)

            } catch(error) {
                console.error('Error in handleSubmit:', error);
            }   
        }   
    }      
        
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="create-group-container">

                    <div className='create-group-header-container'>
                        <div className='create-group-header-title'>
                            Update your group's information
                        </div>
                        <div className='create-group-header-text'> 
                            We'll walk you through a few steps to help you edit your group's information
                        </div>
                    </div>

                    <div className='create-group-location-container'>
                        <div className='create-group-location-title'>
                            First set your group's location
                        </div>
                        <div className='create-group-location-text'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        </div>
                        <input 
                            className='create-group-location-city-input'
                            type='text'
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder='Enter City'/>
                        <div className='create-group-location-state-error'>
                            {!!renderErr && cityErr.length > 0 && cityErr}
                        </div>
                        <input 
                            className='create-group-location-state-input'
                            type='text'
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder='Enter State'/>
                        <div className='create-group-location-state-error'>
                            {!!renderErr && stateErr.length > 0 && stateErr}
                        </div>
                    </div>

                    <div className='create-group-name-container'>
                        <div className='create-group-name-title'>
                            What will your group's name be?
                        </div>
                        <div className='create-group-name-text'>
                            Choose a name that will give a clear idea of what the group is about. Feel free to get creative!
                        </div>
                        <input 
                            className='create-group-name-input'
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='What is your group name?'/>
                        <div className='create-group-name-error'>
                            {!!renderErr && nameErr.length > 0 && nameErr}
                        </div>
                    </div>

                    <div className='create-group-about-container'>
                        <div className='create-group-about-title'>
                            Now describe what your group will be about
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
                        <div className='create-group-name-error'>
                            {!!renderErr && aboutErr.length > 0 && aboutErr}
                        </div>
                    </div>

                    <div className='create-group-steps-container'>
                        <div className='create-group-steps-title'>
                            Final Steps...
                        </div>
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
                        <div className='create-group-type-error'>
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
                        <div className='create-group-type-error'>
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
                        <div className='create-group-add-image-error'>
                            {!!renderErr && urlErr.length > 0 && urlErr}
                        </div>
                    </div>
    

                    <div className='create-group-submit-button-container'>
                        <button 
                            className='create-group-submit-button'
                            type='submit'
                            disabled={renderErr.length}
                            >
                            Update Group
                        </button>
                    </div>
                </div>
            </form>
        </div>  
    )
};




export default EditGroupForm;