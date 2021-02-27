import { gql } from "@apollo/client";
import client, { isLoggedInVar } from "./apollo";
import PropTypes from "proptypes";

const query = gql`
  query isLoggedIn {
    isLoggedIn @client
  }
`;

export const userLogIn = (token) => {
  client.cache.writeQuery({
    query,
    data: {
      isLoggedIn: true,
    },
  });
  localStorage.setItem("Bearer", token);
  isLoggedInVar(true);
};

export const userLogOut = () => {
  client.cache.writeQuery({
    query,
    data: {
      isLoggedIn: false,
    },
  });
  localStorage.removeItem("Bearer");
  isLoggedInVar(false);
};

userLogIn.propTypes = {
  token: PropTypes.string,
};
