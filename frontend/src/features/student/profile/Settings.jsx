import React from "react";
import "./settings.css";

const Settings = () => {
  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account preferences.</p>
      </div>

      <div className="empty-state">
        <p>Settings will be available once backend integration is completed.</p>
      </div>
    </div>
  );
};

export default Settings;
