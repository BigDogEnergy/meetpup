import React from "react";
import { Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";

function App() {
  return (
    <Switch>
      <Route path="/login">
        <LoginFormPage />
      </Route>
      <Route path="/"> 
        <h1>This is the root, specify a URL</h1>
      </Route>
    </Switch>
  );
}

export default App;