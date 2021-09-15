import React from "react";
import { Redirect, Route } from "react-router";

const ProtectedPaths = ({ component: Component, ...rest }) => {
  // const isLoggedIn = () => {
  //     localStorage.getItem("authToken")
  // }
  return (
    <div>
      <Route
        {...rest}
        render={(props) =>
          localStorage.getItem("authToken") ? (
            <Component {...props} />
          ) : (
            <Redirect to="/login" />
          )
        }
      />
    </div>
  );
};

export default ProtectedPaths;
