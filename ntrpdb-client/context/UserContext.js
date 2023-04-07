import React, { createContext, useState } from "react";
import { useCurrentUser } from "../hooks/useCurrentUser";

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const onCompleted = (data) => {
    if (data && data.currentUser) {
      setUser(data.currentUser);
      if (typeof window !== "undefined") {
        if (data.currentUser.token) {
          sessionStorage?.setItem("token", data.currentUser.token);
        } else {
          sessionStorage?.removeItem("token");
        }
      }
    }
  };

  useCurrentUser({ onCompleted });

  const values = {
    user,
    setUser,
  };

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export default UserContext;
