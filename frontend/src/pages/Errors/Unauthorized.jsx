import React from "react";
import { Link } from "react-router-dom";
import securityImage from "../../assets/images/security4.jpg";
import "./unauthorized.css";

const Unauthorized = () => {
  return (
    <div className="unauthorized-page">
      <div className="unauthorized-container">
        <div className="unauthorized-content">
          <h1 className="error-code">401</h1>
          <h2 className="error-title">Hold up!</h2>

          <p className="error-description">
            Sorry, but you are not authorized to view this page.
          </p>

          <div className="error-actions">
            <Link to="/home" className="btn primary">
              Back to Home
            </Link>
          </div>
        </div>

        <div className="unauthorized-image">
          <img src={securityImage} alt="Unauthorized access" />
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
