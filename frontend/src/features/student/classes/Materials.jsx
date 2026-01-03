import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilePdf,
  faFilePowerpoint,
  faFileLines,
  faDownload
} from "@fortawesome/free-solid-svg-icons";
import "./materials.css";

/* =========================
   UI-ONLY DATA
========================= */

const materialsData = [
  {
    id: 1,
    title: "Introduction to Physics",
    type: "pdf",
    uploadedOn: "02 Jan 2026"
  },
  {
    id: 2,
    title: "Motion – Lecture Slides",
    type: "ppt",
    uploadedOn: "05 Jan 2026"
  },
  {
    id: 3,
    title: "Worksheet – Laws of Motion",
    type: "doc",
    uploadedOn: "08 Jan 2026"
  }
];

const getIconByType = (type) => {
  if (type === "pdf") return faFilePdf;
  if (type === "ppt") return faFilePowerpoint;
  return faFileLines;
};

const Materials = () => {
  return (
    <div className="materials-page">
      <h2 className="page-title">Study Materials</h2>
      <p className="page-subtitle">
        Access notes, slides, and worksheets uploaded for this class
      </p>

      <div className="materials-table">
        <div className="materials-header">
          <span>File</span>
          <span>Type</span>
          <span>Uploaded On</span>
          <span>Action</span>
        </div>

        {materialsData.map((item) => (
          <div key={item.id} className="materials-row">
            <span className="material-title">
              <FontAwesomeIcon icon={getIconByType(item.type)} />
              <span>{item.title}</span>
            </span>

            <span className="material-type">
              {item.type.toUpperCase()}
            </span>

            <span>{item.uploadedOn}</span>

            <button className="download-btn">
              <FontAwesomeIcon icon={faDownload} /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Materials;
