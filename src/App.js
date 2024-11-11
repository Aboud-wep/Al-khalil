import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Tasmi3i from "./Quran/Tasmi3i";
import QuranPage from "./Quran/QuranPage";
import Header from "./Header";

export default function App() {
  return (
    <div>
      <Header />
      <div>
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Tasmi3i" element={<Tasmi3i />} />
          <Route path="/QuranPage" element={<QuranPage />} />
        </Routes>
      </div>
    </div>
  );
}
