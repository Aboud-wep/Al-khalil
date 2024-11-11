import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../UserContext";
import { Spin } from "antd";

const Mistakes = ({ currentPage, onMistakesFetched, setMistakesLoading }) => {
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    setMistakesLoading(loading);
  }, [loading, setMistakesLoading]);

  useEffect(() => {
    const fetchMistakes = async () => {
      setLoading(true);
      const authToken = user.token;
      const ID_Person = user.userDetails.ID_Person;

      try {
        const response = await axios.post(
          "https://alkhalil-mosque.com/api/view_memos",
          {
            api_password: "windows",
            ID_Student_Pep: ID_Person,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "auth-token": authToken,
            },
          }
        );

        const data = response.data;
        if (data.status && data.errNum === "S000") {
          const mistakes = data.res.pages
            .filter((page) => page.Page === currentPage)
            .flatMap((page) => page.mistakes);
          onMistakesFetched(mistakes);
        } else {
          console.error("Failed to fetch mistakes:", data.msg);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching mistakes:", error);
        setLoading(false);
      }
    };

    fetchMistakes();
  }, [user.token, user.userDetails.ID_Person, currentPage, onMistakesFetched]);

  if (loading) {
    return <div></div>;
  }

  return null;
};

export default Mistakes;
