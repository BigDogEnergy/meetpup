import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom' 


function ProfileButton({ user }) {
  // console.log(user)
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  //Profile is hidden by adding styling CSS
  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  //Determine the arrow icon based on the showMenu state
  const arrowIcon = showMenu ? faChevronDown : faChevronUp;

  return (
    <>
      <div className={"nav-bar-right-content"}>
        <Link to='/groups/new' className={"start-a-new-group"}> 
          Start a new group 
        </Link>
        <button onClick={openMenu}>
          <i className="fas fa-user-circle" />
          <FontAwesomeIcon icon={arrowIcon} className={`arrow-icon ${showMenu ? "arrow-down" : "arrow-up"}`} />
        </button>
      </div>
      

      <div className={ulClassName} ref={ulRef}>
        <div className={"user-data-container"}>
          <div className={"user-greeting"}>Hello, {user.firstName}</div>
          <div className={"user-email"}>{user.email}</div>
        </div>
          <button onClick={logout}>Log Out</button>
      </div>
    </>
  );
}

export default ProfileButton;