import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Splash from "./components/Splash";
import Groups from './components/Groups'
import SingleCard from "./components/SingleCard";
import CreateGroupForm from "./components/CreateGroupForm";
import EditGroupForm from "./components/EditGroupForm";
import { getAllGroups } from "./store/groups";
import Events from "./components/Events";
import CreateEventForm from "./components/CreateEventForm";
import { getAllEvents } from "./store/events";
import EditEventForm from "./components/EditEventForm";
import EventDetails from "./components/EventDetails";
import SingleEventCard from "./components/SingleEventCard";
import SingleEventDetail from "./components/SingleEventDetail";

function App() {
  const dispatch = useDispatch();
  const groups = useSelector(state => state.groups)
  // console.log("App groups variable", groups);
  // const eventsObj = useSelector(state => state.events.events)
  // const events = Object.values(eventsObj)
  const [isLoaded, setIsLoaded] = useState(false);


  useEffect(() => {
    dispatch(sessionActions.restoreUser())
    .then(dispatch(getAllGroups()))
    .then(dispatch(getAllEvents()))
    .then(() => setIsLoaded(true));
  }, [dispatch]);

//isLoaded inside of a useEffect can be solution to loading errors

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>

          <Route exact path='/groups/new'>
            <CreateGroupForm />
          </Route>

          <Route exact path='/groups/:groupId/events/new'>
            <CreateEventForm />
          </Route>

          <Route path="/login">
            <LoginFormPage />
          </Route>
          
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          
          <Route exact path="/">
            <Splash />
          </Route>

          <Route path='/groups/:groupId/edit'>
            <EditGroupForm groups={groups}/>
          </Route>

          <Route exact path='/groups/:groupId'>
            <SingleCard />
          </Route>

          <Route path='/events/:eventId/edit'>
            <EditEventForm />
          </Route>

          <Route exact path='/events/:eventId'>
            <SingleEventDetail />
          </Route>

          <Route exact path='/groups'>
            <Groups />
          </Route>

          <Route path='/events'>
            <Events />
          </Route>
        
        </Switch>
      )}
    </>
  );
}

export default App;