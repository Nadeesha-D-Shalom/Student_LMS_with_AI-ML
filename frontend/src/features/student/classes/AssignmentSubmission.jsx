import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendar,
  faUpload,
  faTrash,
  faDownload,
  faFloppyDisk,
  faPenToSquare
} from "@fortawesome/free-solid-svg-icons";
import { apiFetch } from "../../../api/api";
import "./assignmentSubmission.css";

const MAX_FILE_SIZE_MB = 5;

function formatBytesToMB(bytes) {
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(2)} MB`;
}

function buildFileUrl(relativePath) {
  if (!relativePath) return "";
  const base = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
  if (relativePath.startsWith("http")) return relativePath;
  return `${base}/${relativePath}`;
}

function formatISODate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString();
}

function extractFileName(path) {
  if (!path) return "";
  return path.split("/").pop();
}

function computeRemaining(dueDate, dueTime) {
  if (!dueDate || !dueTime) return "";

  const baseDate = new Date(dueDate);
  const [h, m, s] = dueTime.split(":").map(Number);
  baseDate.setHours(h, m, s || 0, 0);

  const now = new Date();
  const diffMs = baseDate.getTime() - now.getTime();

  if (Number.isNaN(baseDate.getTime())) return "";
  if (diffMs <= 0) return "Past due";

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes - days * 60 * 24) / 60);
  const minutes = totalMinutes - days * 60 * 24 - hours * 60;

  if (days > 0) return `${days} days ${hours} hours remaining`;
  if (hours > 0) return `${hours} hours ${minutes} mins remaining`;
  return `${minutes} mins remaining`;
}

const AssignmentSubmission = () => {
  const { classId, gradeId, assignmentId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState(null);

  const [file, setFile] = useState(null);
  const [note, setNote] = useState("");
  const [draftSaved, setDraftSaved] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [removing, setRemoving] = useState(false);

  const isSubmitted = assignment?.status === "SUBMITTED";

  const isPastDue = useMemo(() => {
    if (!assignment?.due_date || !assignment?.due_time) return false;
    const baseDate = new Date(assignment.due_date);
    const [h, m, s] = assignment.due_time.split(":").map(Number);
    baseDate.setHours(h, m, s || 0, 0);
    return new Date() > baseDate;
  }, [assignment]);

  const dueText = useMemo(() => {
    if (!assignment?.due_date) return "";
    return `${formatISODate(assignment.due_date)} · ${assignment.due_time || ""}`;
  }, [assignment]);

  const timeRemaining = useMemo(
    () => computeRemaining(assignment?.due_date, assignment?.due_time),
    [assignment]
  );

  const loadAssignment = useCallback(async () => {
    if (!assignmentId) return;

    setLoading(true);
    setError("");

    try {
      const data = await apiFetch(`/api/student/assignments/${assignmentId}`);
      setAssignment(data);
    } catch (err) {
      setError(err.message || "Failed to load assignment.");
    } finally {
      setLoading(false);
    }
  }, [assignmentId]);

  useEffect(() => {
    loadAssignment();
  }, [loadAssignment]);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError("File size exceeds 5 MB.");
      setFile(null);
      return;
    }

    const ext = selected.name.split(".").pop()?.toLowerCase();
    if (ext !== "pdf") {
      setError("Only PDF files are allowed.");
      setFile(null);
      return;
    }

    setError("");
    setFile(selected);
    setDraftSaved(false);
  };

  const removeLocalFile = () => {
    setFile(null);
    setDraftSaved(false);
  };

  const downloadLocalFile = () => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveDraft = () => {
    if (!file && !note.trim()) return;
    setDraftSaved(true);
  };

  const submitAssignment = async () => {
    if (isPastDue) {
      setError("Submission deadline has passed. This assignment is closed.");
      return;
    }

    if (!file) {
      setError("Please select a file before submitting.");
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

      setFile(null);
      setDraftSaved(false);
      await loadAssignment();
    } catch (err) {
      setError(err.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  


  const downloadSubmittedFile = () => {
    const url = buildFileUrl(assignment?.submission_url);
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const removeSubmission = async () => {
    if (!assignmentId) return;

    setRemoving(true);
    setError("");

    try {
      await apiFetch(`/api/student/assignments/${assignmentId}/submission`, {
        method: "DELETE"
      });
      await loadAssignment();
    } catch (err) {
      setError(err.message || "Failed to remove submission.");
    } finally {
      setRemoving(false);
    }
  };

  if (loading) {
    return <div className="submission-page">Loading...</div>;
  }

  if (!assignment) {
    return <div className="submission-page">No assignment data.</div>;
  }

  return (
    <div className="submission-page">
      <div className="breadcrumb">
        <span onClick={() => navigate("/student/dashboard")}>Dashboard</span>
        <span>›</span>
        <span onClick={() => navigate("/student/classes")}>Classes</span>
        <span>›</span>
        <span onClick={() => navigate(`/student/classes/${classId}/grade/${gradeId}`)}>
          Back to Grade
        </span>
        <span>›</span>
        <span className="active">Assignment</span>
      </div>

      <div className="submission-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>

        <div className="title-block">
          <h1 className="assignment-title">{assignment.title || "Assignment"}</h1>

          <div className="assignment-meta">
            <span>
              <FontAwesomeIcon icon={faCalendar} /> Due: {dueText}
            </span>

            <span
              className={`status-pill ${isSubmitted
                  ? isPastDue
                    ? "submitted-late"
                    : "submitted"
                  : isPastDue
                    ? "pending-late"
                    : "pending"
                }`}
            >
              {isSubmitted
                ? isPastDue
                  ? "Submitted (Late)"
                  : "Submitted for grading"
                : isPastDue
                  ? "Not submitted (Overdue)"
                  : "Not submitted"}
            </span>
          </div>
        </div>

        {isSubmitted && (
          <div className="top-actions">
            <button className="secondary-btn" onClick={downloadSubmittedFile}>
              <FontAwesomeIcon icon={faDownload} /> Download submission
            </button>

            <button className="danger-btn" onClick={removeSubmission} disabled={removing}>
              <FontAwesomeIcon icon={faTrash} /> {removing ? "Removing..." : "Remove submission"}
            </button>
          </div>
        )}
      </div>

      <div className="status-table">
        <div className="status-row">
          <span>Submission status</span>
          <strong>{isSubmitted ? "Submitted for grading" : "Not submitted"}</strong>
        </div>

        <div className="status-row">
          <span>Grading status</span>
          <strong>Not graded</strong>
        </div>

        <div className="status-row">
          <span>Due date</span>
          <strong>{dueText}</strong>
        </div>

        <div className={`status-row ${isPastDue ? "danger" : "highlight"}`}>
          <span>Time remaining</span>
          <strong>{timeRemaining || "-"}</strong>
        </div>

        <div className="status-row">
          <span>Last modified</span>
          <strong>{assignment.submitted_at || "-"}</strong>
        </div>

        <div className="status-row">
          <span>File submissions</span>

          {isSubmitted && assignment.submission_url ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">
                {extractFileName(assignment.submission_url)}
              </span>

              <button className="link-btn" onClick={downloadSubmittedFile}>
                <FontAwesomeIcon icon={faDownload} /> View file
              </button>
            </div>
          ) : (
            <strong>-</strong>
          )}
        </div>


      </div>

      {isPastDue && !isSubmitted && (
        <div className="overdue-banner">
          This assignment is overdue. Submissions may be restricted by your instructor.
        </div>
      )}

      {!isSubmitted && (
        <div className="submit-box">
          <h3>
            <FontAwesomeIcon icon={faUpload} /> Submit Your Work
          </h3>

          {!file && (
            <div className="upload-dropzone">
              <p>Drag & drop your PDF here or click to browse</p>
              <input type="file" accept=".pdf" onChange={handleFileChange} />
              <small>PDF only · Max size: 5 MB</small>
            </div>
          )}

          {error && <div className="error-text">{error}</div>}

          {file && (
            <div className="file-preview">
              <div>
                <strong>{file.name}</strong>
                <p>{formatBytesToMB(file.size)}</p>
                {draftSaved && <span className="draft-label">Draft saved</span>}
              </div>

              <div className="file-actions">
                <button onClick={downloadLocalFile}>
                  <FontAwesomeIcon icon={faDownload} /> Download
                </button>
                <button onClick={removeLocalFile} className="danger">
                  <FontAwesomeIcon icon={faTrash} /> Remove
                </button>
              </div>
            </div>
          )}

          <textarea
            className="submission-note"
            placeholder="Add a note for your teacher (optional)"
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setDraftSaved(false);
            }}
          />

          <div className="submit-actions">
            <button className="draft-btn" disabled={!file && !note.trim()} onClick={saveDraft}>
              <FontAwesomeIcon icon={faFloppyDisk} /> Save Draft
            </button>

            <button className="submit-btn" disabled={!file || submitting} onClick={submitAssignment}>
              {submitting ? "Submitting..." : isPastDue ? "Submission Closed" : "Submit Assignment"}
            </button>
          </div>
        </div>
      )}

      {isSubmitted && (
        <div className="submit-box submitted-box">
          <h3>
            <FontAwesomeIcon icon={faPenToSquare} /> Submission received
          </h3>
          <p className="muted">
            Your submission has been recorded successfully.
            {isPastDue && " It was submitted after the deadline."}
          </p>
        </div>
      )}
    </div>
  );
};

export default AssignmentSubmission;
