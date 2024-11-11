import React, { useState, useEffect } from "react";
import QuranPage from "./QuranPage";
import Mistakes from "./Mistakes";
import axios from "axios";

const Tasmi3i = () => {
  const [authToken, setAuthToken] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = async (username, password) => {
    try {
      const payload = {
        api_password: "windows",
        UserName: username,
        password: password,
      };

      const response = await axios.post(
        "https://alkhalil-mosque.com/api/login",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = response.data.user.Token;
      setAuthToken(token);
      setLoggedIn(true);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  useEffect(() => {
    if (loggedIn) {
    }
  }, [loggedIn]);

  return (
    <div>
      <QuranPage />
      {loggedIn && <Mistakes authToken={authToken} />}
    </div>
  );
};

export default Tasmi3i;
