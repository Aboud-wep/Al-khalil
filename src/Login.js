import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "./UserContext";

export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setAuth } = useUser();

  async function submit(e) {
    e.preventDefault();
    setError("");

    const payload = {
      api_password: "windows",
      UserName: name,
      password: password,
    };

    try {
      let res = await axios.post(
        "https://alkhalil-mosque.com/api/login",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = res.data.user.Token;
      const userDetails = res.data.user;

      setAuth({ token, userDetails });

      navigate("/Tasmi3i");
    } catch (err) {
      console.error("Error:", err);
      if (err.response && err.response.data.errNum === "S000") {
        setError("Invalid username or password. Please try again.");
      } else {
        setError("الاسم او كلمة السر غير موجود او كليهما");
      }
    }
  }

  const handleErrorClear = () => {
    setError("");
  };

  return (
    <div>
      <div className="formdiv">
        <form onSubmit={submit}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            placeholder="Enter Your Name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              handleErrorClear();
            }}
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              handleErrorClear();
            }}
          />

          {error && <p className="Error">{error}</p>}

          <div style={{ textAlign: "center" }}>
            <button type="submit">LogIn</button>
          </div>
        </form>
      </div>
    </div>
  );
}
