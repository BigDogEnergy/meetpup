import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import LoginFormModal from '../LoginFormModal';
import logoImage from '../../photos/logo.jpeg'

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
                <LoginFormModal />
                <NavLink className ='meetpup-signup'to="/signup">Sign Up</NavLink>
        </div>
    );
  }

  return (
    <div className='nav-bar'>
        <div className='nav-bar-left'>
            <NavLink to="/">
              <img className='meetpup-logo' src={logoImage} alt='MeetPup' />
            </NavLink>
        </div>
        <div className='nav-bar-right'>
          <div className='nav-bar-right-container'>
            {isLoaded && sessionLinks}
          </div>
        </div>
    </div>        
  );
}

export default Navigation;