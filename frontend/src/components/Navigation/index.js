import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import LoginFormModal from '../LoginFormModal';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  // console.log(sessionUser, "From index.js in Navigation")

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
        <ProfileButton user={sessionUser} />
    );
  } else {
    sessionLinks = (
        <div className="nav-links-container">
            <div className="login">
                <LoginFormModal />
            </div>
            <div className="signup">
                <NavLink to="/signup">Sign Up</NavLink>
            </div>
        </div>
    );
  }

  return (
    <div className='nav-bar'>
        <div className='nav-bar-left'>
            <NavLink exact to="/">MeetPup Logo</NavLink>
        </div>
        <div className='nav-bar-right'>
          <div>
            {isLoaded && sessionLinks}
          </div>
        </div>
    </div>        
  );
}

export default Navigation;