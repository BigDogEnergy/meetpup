import React from "react";
import { useSelector } from 'react-redux';
import './Splash.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDog } from '@fortawesome/free-solid-svg-icons';

function Splash() {
    const User = useSelector(state => state.session.user);

    return (

        <div className="main-splash-div">
            <div className="main-splash-top-container">
                <div className="main-splash-topleft">
                    <h1 className="main-splash-topleft-title">The pet platform -- Where we find local pet assistance from our neighbors</h1>
                    <div className="main-splash-topleft-text"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
                </div>
                <div className="main-splash-topright">
                    <FontAwesomeIcon icon={faDog} size="2x" />
                </div>
            </div>
            

            <div className="main-splash-center-explanation">
                <h2 className="main-splash-center-explanation-title">How MeetPup works</h2>
                <div className="main-splash-center-explanation-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
            </div>


            <div className="main-splash-nav-container">

                <div className="main-splash-nav-1">
                {/* <FontAwesomeIcon icon="fa-solid fa-hands-clapping" size="lg" /> */}
                    <Link to='/groups' className="main-splash-nav-1-title">
                        See all groups
                    </Link>
                    <div className="main-splash-nav-1-text"> 
                        Lorem ipsum dolor sit amet. 
                    </div>
                </div>

                <div className="main-splash-nav-2">
                    <Link to='/events' className="main-splash-nav-2-title"> 
                        Find an event
                    </Link>
                    <div className="main-splash-nav-2-text"> 
                        Lorem ipsum dolor sit amet. 
                    </div>
                </div>

                {/* Conditionally loaded Link for Group*/}
                <div className="main-splash-nav-3">
                    {User ? (
                                <Link to="/groups/new" className="main-splash-nav-3-title">
                                    Start a new group
                                </Link>
                            ) : (
                                    <h3 className="main-splash-nav-3-title">
                                        Start a new group
                                    </h3>
                                )}
                    <div className="main-splash-nav-3-text">
                        Lorem ipsum dolor sit amet.
                    </div>
                </div>  
            </div>

            {/* // Join MeetPup Button */}
            {!User && (
                <div className="join-meetpup-container">
                    <button className="join-meetpup-button">Join MeetPup</button>
                </div>
            )}
        </div>
    );
};

export default Splash