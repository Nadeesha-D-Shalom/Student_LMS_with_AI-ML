import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendar,
  faUpload,
  faTrash,
  faDownload,
  faFloppyDisk
} from "@fortawesome/free-solid-svg-icons";
import { apiFetch } from "../../../api/api";
import "./assignmentSubmission.css";

const MAX_FILE_SIZE_MB = 5;

const AssignmentSubmission = () => {
  const { classId, gradeId, assignmentId } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [draftSaved, setDraftSaved] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError("File size exceeds 5 MB. Please upload a smaller file.");
      setFile(null);
      return;
    }

    setError("");
    setFile(selected);
    setDraftSaved(false);
  };

  const removeFile = () => {
    setFile(null);
    setDraftSaved(false);
  };

  const downloadFile = () => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveDraft = () => {
    if (!file) return;
    setDraftSaved(true);
  };

  const submitAssignment = async () => {
    if (!file) {
      setError("Please select a file before submitting.");
      return;
    }

    if (!assignmentId) {
      setError("Missing assignment id in route.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      await apiFetch(`/api/student/assignments/${assignmentId}/submit`, {
        method: "POST",
        body: formData
      });

      navigate(-1);
    } catch (err) {
      setError(err.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="submission-page">
      {/* BREADCRUMB */}
      <div className="breadcrumb">
        <span onClick={() => navigate("/student/dashboard")}>Dashboard</span>
        <span>›</span>
        <span onClick={() => navigate("/student/classes")}>Classes</span>
        <span>›</span>
        <span onClick={() => navigate(`/student/classes/${classId}/grade/${gradeId}`)}>
          Physics
        </span>
        <span>›</span>
        <span className="active">Assignment</span>
      </div>

      {/* HEADER */}
      <div className="submission-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>

        <h1>Assignment 01 – Laws of Motion</h1>

        <div className="assignment-meta">
          <span>
            <FontAwesomeIcon icon={faCalendar} /> Due: 20 Jan 2026 · 11:59 PM
          </span>
          <span className="status pending">Not Submitted</span>
        </div>
      </div>

      {/* STATUS TABLE */}
      <div className="status-table">
        <div className="status-row">
          <span>Submission status</span>
          <span>Not submitted</span>
        </div>
        <div className="status-row">
          <span>Grading status</span>
          <span>Not graded</span>
        </div>
        <div className="status-row">
          <span>Due date</span>
          <span>20 January 2026 · 11:59 PM</span>
        </div>
        <div className="status-row highlight">
          <span>Time remaining</span>
          <span>2 days 6 hours remaining</span>
        </div>
      </div>

      {/* SUBMIT BOX */}
      <div className="submit-box">
        <h3>
          <FontAwesomeIcon icon={faUpload} /> Submit Your Work
        </h3>

        {!file && (
          <div className="upload-dropzone">
            <p>Drag & drop your file here or click to browse</p>
            <input type="file" accept=".pdf" onChange={handleFileChange} />
            <small>Recommended format: PDF · Max size: 5 MB</small>
          </div>
        )}

        {error && <div className="error-text">{error}</div>}

        {file && (
          <div className="file-preview">
            <div>
              <strong>{file.name}</strong>
              <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              {draftSaved && <span className="draft-label">Draft saved</span>}
            </div>

            <div className="file-actions">
              <button onClick={downloadFile}>
                <FontAwesomeIcon icon={faDownload} /> Download
              </button>
              <button onClick={removeFile} className="danger">
                <FontAwesomeIcon icon={faTrash} /> Remove
              </button>
            </div>
          </div>
        )}

        <textarea
          className="submission-note"
          placeholder="Add a note for your teacher (optional)"
        />

        <div className="submit-actions">
          <button className="draft-btn" disabled={!file} onClick={saveDraft}>
            <FontAwesomeIcon icon={faFloppyDisk} /> Save Draft
          </button>

          <button
            className="submit-btn"
            disabled={!file || submitting}
            onClick={submitAssignment}
          >
            {submitting ? "Submitting..." : "Submit Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmission;
