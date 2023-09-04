import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { getAllGroups } from "../../store/groups"
import './Groups.css';
import GroupDetails from '../GroupCards'

function Groups() {
    const location = useLocation()
    const dispatch = useDispatch() 
    const groupsObj = useSelector(state => state.group.groups)

    const isAtGroups = location.pathname === "/groups";
    const isAtEvents = location.pathname === "/events";

    let groups = [];
    if (groupsObj) {
        groups = Object.values(groupsObj)
    }

    //On each render we will trigger the dispatch to fetch all groups
    useEffect(() => {
        dispatch(getAllGroups())
    }, [dispatch]);


    console.log("groups in Groups index.js component", groupsObj)

    //Holder variable for future data
    let groupsList;

    if (groups.length > 0) {
        groupsList = (
            groups.map(group => (<GroupDetails key={group.id} group={group}/>))
        )
    } else {
        //if we have no groups we utilize this
        groupsList = (
            <div className="no-groups-container">
                <div className="no-groups-text"> There are currently no groups available to view! </div>
            </div>
        )
    };

    return (groups && 
        <div className="groups-page">
            <div className="groups-page-container">
                <div className="groups-page-header">
                    <Link 
                        className={isAtGroups ? "groups-page-toggle-1" : "groups-page-toggle-2"} 
                        to='/groups'>
                            Groups
                    </Link>
                    <Link 
                        className={isAtGroups ? 'groups-page-toggle-2' : 'groups-page-toggle-1'}
                        to='/events'>
                            Events
                    </Link>
                </div>

                <div className='groups-page-view-text'>
                    Groups in MeetPup
                </div>
                <div className='groups-page-grouplist'>
                    {groupsList}
                </div>
            </div>
        </div>
    )

};

export default Groups;