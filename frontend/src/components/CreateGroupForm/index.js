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
    }

    //field selector states
    const [ name, setName ] = useState('');
    const [ about, setAbout ] = useState('');
    const [ type, setType ] = useState('');
    const [ privacy, setPrivacy ] = useState('');
    const [ city, setCity ] = useState('');
    const [ state, setState ] = useState('');
    const [ preview, setPreview ] = useState('');
    const [ fieldErrors, setFieldErrors ] = useState('');

    //field error states
    const [ nameErr, setNameErr ] = useState('');
    const [ aboutErr, setAboutErr ] = useState('');
    const [ typeErr, setTypeErr ] = useState('');
    const [ privacyErr, setPrivacyErr ] = useState('');
    const [ cityErr, setCityErr ] = useState(''); 
    const [ stateErr, setStateErr ] = useState('');
    const [ previewErr, setPreviewErr ] = useState('');
    const [ renderErr, setRenderErr ] = useState('');

    //use-effect
    useEffect (() => {

        //name
        if (!name.length) {
            setNameErr('Name is required')
        } else {
            setNameErr('')
        };

        //about
        if (!about.length || about.length < 30 ) {
            setAboutErr('Description must be at least 30 characters long')
        } else {
            setAboutErr('')
        };

        //location
        if (!city.length) {
            setCityErr('Location is required')
        } else {
            setCityErr('')
        };
        
        if (!state.length) {
            setStateErr('Location is required')
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

        //preview

            const urlValidation = str => {
                return /(https?:\/\/.*\.(?:png|jpg|jpeg))/.test(str);
            }

        if (!preview.length) {
            setPreviewErr('Image url must end in .png, .jpg, or .jpeg')
        } else if (preview.length && !urlValidation(preview)) {
            setPreviewErr('Invalid image URL provided')
        } else {
            setPreviewErr('')
        }


    }, [name, about, city, state, preview, privacy, type]);

    //On Submits

    const handleSubmit = async (e) => {
        e.preventDefault();
        setRenderErr(true)
    }

    return (
        <form>
            <div className="create-group-container">

                <div className='create-group-header-container'>
                    <div>Become an Organizer</div>
                    <div> We'll walk you through a few steps to build your local community </div>
                </div>

                <div className='create-group-location-container'>
                    <div>First set your group's location</div>
                    <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </div>
                </div>
            </div>
        </form>
    )

};

export default CreateGroupForm