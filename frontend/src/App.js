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
import SingleEventCard from "./components/SingleEventCard";
import CreateEventForm from "./components/CreateEventForm";

function App() {
  const dispatch = useDispatch();
  const groups = useSelector(state => state.groups)
  // console.log("App groups variable", groups);

  const [isLoaded, setIsLoaded] = useState(false);


  useEffect(() => {
    dispatch(sessionActions.restoreUser())
    .then(dispatch(getAllGroups()))
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

          <Route path='/events/:eventId'>
            <SingleEventCard />
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