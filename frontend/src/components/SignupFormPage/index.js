import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
import './SignupForm.css'

function SignupFormPage() {
    
    const dispatch = useDispatch();
    const sessionUser = useSelector((state) => state.session.user);
    
    const [ email, setEmail ] = useState("");
    const [ username, setUsername ] = useState("");
    const [ firstName, setFirstName ] = useState("");
    const [ lastName, setLastName ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ confirmPassword, setConfirmPassword ] = useState("");
    const [ errors, setErrors ] = useState({});

    if (sessionUser) return <Redirect to="/" />;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setErrors({});
            return dispatch(
                sessionActions.signup({
                    email,
                    username,
                    firstName,
                    lastName,
                    password,
                })
            ).catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
        }
        return setErrors({
            confirmPassword: "Password fields must match"
        });
    };

    return (
        <>
            <div className="signup-form-container">
                <div className="signup-form-title">Sign Up</div>
                <form onSubmit={handleSubmit}>

                {errors.email && 
                    <div className="error-msg">
                        {errors.email}
                    </div>}
                    <label>
                        <input
                            placeholder='Email'
                            className='input-field'
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                    </label>
                    
                {errors.username && 
                    <div className="error-msg">
                        {errors.username}
                    </div>}
                    <label>
                        <input 
                            placeholder='Username'
                            className='input-field'
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>
                    
                    {errors.firstName && 
                        <div className="error-msg">
                            {errors.firstName}
                        </div>}
                    <label>
                    <input
                        placeholder='First Name'
                        className='input-field'
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        />
                    </label>
                    
                    {errors.lastName && 
                        <div className="error-msg">
                            {errors.lastName}
                        </div>}
                    <label>
                    <input
                        placeholder='Last Name'
                        type="text"
                        className='input-field'
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    </label>

                    {errors.password && 
                        <div className="error-msg">
                            {errors.password}
                        </div>}
                    <label>
                    <input
                        type="password"
                        placeholder='Password'
                        className='input-field'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    </label>
                    
                    {errors.confirmPassword && 
                        <div className='error-msg'>
                            {errors.confirmPassword}
                        </div>}
                    <label>
                    <input
                        placeholder='Confirm Password'
                        type="password"
                        className='input-field'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    </label>

                    
                    <div className='login-button-div'>
                        <button 
                            type="submit"
                            className='login-button'
                            disabled={ !email.length || username.length < 4 || !firstName.length || !lastName.length || password.length < 6 || confirmPassword.length < 6}>
                                Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default SignupFormPage;