import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser
      ? JSON.parse(savedUser)
      : { token: null, userDetails: null };
  });

  const setAuth = (authData) => {
    setUser(authData);
    localStorage.setItem("user", JSON.stringify(authData));
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setAuth }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
