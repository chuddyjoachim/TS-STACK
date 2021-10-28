import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

interface RoutesProps {}

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render={() => <Home/>} />
        <Route exact path="/Home" render={() => <Home/>} />
        <Route exact path="/login" render={() => <Login/>} />
        <Route exact path="/register" render={() => <Register/>} />
      </Switch>
    </BrowserRouter>
  );
};
export default Routes;
