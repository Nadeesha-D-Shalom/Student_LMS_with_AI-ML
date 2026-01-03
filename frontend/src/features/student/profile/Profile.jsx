import React from "react";
import "./profile.css";

const Profile = () => {
  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>Profile</h1>
        <p>View your personal and academic information.</p>
      </div>

      <div className="empty-state">
        <p>Profile details will appear once your account is fully set up.</p>
      </div>
    </div>
  );
};

export default Profile;
