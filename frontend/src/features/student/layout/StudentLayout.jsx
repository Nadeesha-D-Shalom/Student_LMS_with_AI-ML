import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import AdvertisementPanel from "../ads/AdvertisementPanel";
import "./studentLayout.css";

const StudentLayout = () => {
  return (
    <div className="student-layout">
      <Sidebar />

      <div className="student-main">
        <Topbar />

        {/* CONTENT + ADS WRAPPER */}
        <div className="student-body">
          {/* MAIN PAGE CONTENT */}
          <main className="student-content">
            <Outlet />
          </main>

          {/* RIGHT SIDE ADS */}
          <aside className="student-ads">
            <AdvertisementPanel />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;
