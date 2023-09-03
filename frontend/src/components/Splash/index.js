import React from "react";
import { useSelector } from 'react-redux';
import './Splash.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";

function Splash() {

    const history = useHistory()
    const User = useSelector(state => state.session.user);

    const handleSignupRedirector = () => {
        history.push('/signup');
    }

    return (

        <div className="main-splash-div">
            <div className="main-splash-top-container">
                <div className="main-splash-topleft">
                    <h1 className="main-splash-topleft-title">The pet platform -- Where we find local pet assistance from our neighbors</h1>
                    <div className="main-splash-topleft-text"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
                </div>
                <div className="main-splash-topright">
                    <img className='svg' src='https://secure.meetupstatic.com/next/images/shared/online_events.svg?w=640'/>
                </div>
            </div>
            

            <div className="main-splash-center-explanation">
                <h2 className="main-splash-center-explanation-title">How MeetPup works</h2>
                <div className="main-splash-center-explanation-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
            </div>


            <div className="main-splash-nav-container">

                <div className="main-splash-nav-1">
                    <img src='https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=256' className="svg" />
                    <Link to='/groups' className="main-splash-nav-1-title">
                        See all groups
                    </Link>
                    <div className="main-splash-nav-1-text"> 
                        Lorem ipsum dolor sit amet. 
                    </div>
                </div>

                <div className="main-splash-nav-2">
                    <img src='https://secure.meetupstatic.com/next/images/shared/ticket.svg?w=256' className="svg" />
                    <Link to='/events' className="main-splash-nav-2-title"> 
                        Find an event
                    </Link>
                    <div className="main-splash-nav-2-text"> 
                        Lorem ipsum dolor sit amet. 
                    </div>
                </div>

                {/* Conditionally loaded Link for Group*/}
                <div className="main-splash-nav-3">
                    <img src='https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=256' className="svg" />
                    {User ? (
                                <Link to="/groups/new" className="main-splash-nav-3-title">
                                    Start a new group
                                </Link>
                            ) : (
                                    <div className="main-splash-nav-3-title-no-user">
                                        Start a new group
                                    </div>
                                )}
                    <div className="main-splash-nav-3-text">
                        Lorem ipsum dolor sit amet.
                    </div>
                </div>  
            </div>

            {/* // Join MeetPup Button */}
            {!User && (
                <div className="join-meetpup-container">
                    <button onClick={handleSignupRedirector} className="join-meetpup-button">Join MeetPup</button>
                </div>
            )}
        </div>
    );
};

export default Splash