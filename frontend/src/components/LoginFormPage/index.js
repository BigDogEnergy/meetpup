import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";
import "./LoginForm.css";

function LoginFormPage() {
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

  //Error Handling

  // useEffect(() => {
  //   if (credential.length < 4 || password.length < 6) {
  //     setErrors('The provided credentials were invalid.')
  //   }
  // })

  //Content

  return (
    <>
      <div className="login-container">
        <div className="title-h1">Log In</div>
        <form onSubmit={handleSubmit}>
          <div className="input-wrapper-user">
            <div className="error-msg"> {errors.credential && <p className="error-msg">{errors.credential}</p>} </div>
            <label>
              Username or Email
              <input
                type="text"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="input-wrapper-pass">
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="login-button-div">
            <button type="submit">Log In</button>
          </div>
          <div>
            <button className="demo-user-div" type="submit" onClick={demoUserButton}>
              Demo User
            </button>
          </div>
        </form>
      </div>
    </>
  );
  
}

export default LoginFormPage;