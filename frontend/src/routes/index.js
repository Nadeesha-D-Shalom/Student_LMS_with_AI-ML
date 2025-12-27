
import React from "react";
import Home from "../pages/Student/Home";
import StudentRouterHome from "./student-router-home";
//import React from "react";
import { Routes, Route } from "react-router-dom";


const IndexRoutes = () => {
  return (
    <Routes>
      <Route path="/StudentHome/*" element={<StudentRouterHome />} />   
    </Routes>
  );
};

export default IndexRoutes;