import React from "react";
import { Route, Redirect } from "react-router-dom";

export default function AuthRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        localStorage.getItem("token") !== null ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}
