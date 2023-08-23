import { useContext } from "react";
import AuthenticationContext from "../contexts/AuthenticationContextProvider";

export default function useAuthentication() {
  return useContext(AuthenticationContext);
}
