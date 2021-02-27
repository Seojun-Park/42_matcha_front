import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Home, AuthHome } from "../Routes";
import Proptypes from "proptypes";

const LoggedInRoutes = () => (
  <Switch>
    <Route exact path="/" component={Home} />
  </Switch>
);

const LoggedOutRoutes = () => (
  <Switch>
    <Route exact path="/" component={AuthHome} />
  </Switch>
);

const AppRouter = ({ isLoggedIn }) => {
  return (
    <BrowserRouter>
      {isLoggedIn ? <LoggedInRoutes /> : <LoggedOutRoutes />}
    </BrowserRouter>
  );
};

AppRouter.propTypes = {
  isLoggedIn: Proptypes.bool,
};

export default AppRouter;
