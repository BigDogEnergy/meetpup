import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import "./LoginForm.css";

function LoginFormPage() {

    //Error Handling?


  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector((state) => state.session.user);


  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  //Demo User Button Config
  const demoUserButton = (e) => {

    setErrors('')
    setCredential('eztest@user.io')
    setPassword('password1')
    history.push('/')
  };

  if (sessionUser) return <Redirect to="/" />;


  // useEffect(() => {
  //   if (credential.length < 4 || password.length < 6) {
  //     setErrors('The provided credentials were invalid.')
  //   } else {
  //     setErrors('')
  //   }
  // }, [credential, password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password })).catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      }
    );
  };

  //Content

  return (
    <>
      <div className="login-container">
        <div className="login-modal-title">Log In</div>
        <form onSubmit={handleSubmit}>
          <div className="input-wrapper-user">
            <div className="error-msg"> {errors.credential && <p className="error-msg">{errors.credential}</p>} </div>
              <input
                className='input-field'
                type="text"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                placeholder='Username or Email'
                required
              />
          </div>
          <div className="input-wrapper-pass">
              <input
                className='input-field'
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
                required
              />
          </div>
          
          <div className="login-button-div">
            <button 
              className="login-button" 
              type="submit" 
              disabled={ credential.length < 4 || password.length < 6}>
              Log In
            </button>
          </div>

          <div className="login-button-div">
            <button 
              className="login-button" 
              type="submit" 
              onClick={demoUserButton}>
              Demo User
            </button>
          </div>
        </form>
      </div>
    </>
  );
  
}

export default LoginFormPage;