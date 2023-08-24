import { useState, createContext, useEffect } from "react";
import axios from "../api/axios";

const AuthenticationContext = createContext({});

export function AuthenticationProvider({ children }) {
  let [authentication, setAuthentication] = useState({
    isAuthenticated: undefined,
    user: null,
  });

  useEffect(() => {
    axios
      .get("api/authentication/refresh")
      .then((response) => {
        setAuthentication((previous) => ({
          ...previous,
          isAuthenticated: true,
          user: response.data,
        }));
      })
      .catch((err) => {
        setAuthentication((previous) => ({
          ...previous,
          isAuthenticated: false,
          user: null,
        }));
      });
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{ authentication, setAuthentication }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
export default AuthenticationContext;
