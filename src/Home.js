import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import logo from "./logo.png";
import "./App.css";

export default function Home() {
  return (
    <div>
      <div className="container">
        <div className="section">
          <div>
            <img src={logo} className="img" alt="logo" />
          </div>
          <p className="first">جامع إبراهيم الخليل</p>
          <div className="second">
            <p> قم بتحميل التطبيق </p>
            <p>
              {" "}
              <span>6.1.2</span> الإصدار
            </p>
            <p>
              {" "}
              <span>14</span> رقم النسخة
            </p>
          </div>
          <div>
            <button>
              <FontAwesomeIcon icon={faDownload} /> تنزيل التطبيق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
