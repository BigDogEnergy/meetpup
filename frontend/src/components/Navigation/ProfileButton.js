import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';

function ProfileButton({ user }) {
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

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <div className={"nav-bar-right-content"}>
        <div className={"start-a-new-group"}> Start a new group </div>
        <button onClick={openMenu}>
          <i className="fas fa-user-circle" />
        </button>
      </div>
      

      <div className={ulClassName} ref={ulRef}>
        <div className={"user-data-container"}>
          <div className={"user-greeting"}>Hello, {user.username}</div>
          <div className={"user-email"}>{user.email}</div>
        </div>
          <button onClick={logout}>Log Out</button>
      </div>
    </>
  );
}

export default ProfileButton;