import { gql, useQuery } from "@apollo/client";
import React, { createContext } from "react";
import { HashRouter as Router } from "react-router-dom";
import Routes from "./Routes";

const IS_LOGGED_IN = gql`
  query IsLoggedIn {
    isLoggedIn @client
  }
`;

const AppContext = createContext(null);

const App = () => {
  const {
    data: { isLoggedIn },
  } = useQuery(IS_LOGGED_IN);
  return (
    <AppContext.Provider value={isLoggedIn}>
      <Router>
        <Routes isLoggedIn={isLoggedIn} />
      </Router>
    </AppContext.Provider>
  );
};

export default App;
