import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Splash from "./components/Splash";
import Groups from './components/Groups'
// import { getAllGroups } from './store/groups'
import SingleCard from "./components/SingleCard";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>

          <Route path="/login">
            <LoginFormPage />
          </Route>
          
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          
          <Route exact path="/">
            <Splash />
          </Route>

          <Route path='/groups/:groupId'>
            <SingleCard />
          </Route>

          <Route exact path='/groups'>
            <Groups />
          </Route>
        
        </Switch>
      )}
    </>
  );
}

export default App;