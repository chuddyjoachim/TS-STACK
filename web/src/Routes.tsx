import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

interface RoutesProps {}

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render={() => <div>yo</div>} />
      </Switch>
    </BrowserRouter>
  );
};
export default Routes;
