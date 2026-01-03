import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFilePdf,
    faVideo,
    faClipboardList,
    faBell
} from "@fortawesome/free-solid-svg-icons";
import AskAICard from "../assistant/AskAICard";
import "./classWorkspace.css";

const ClassWorkspace = () => {
    const { classId, gradeId } = useParams();
    const navigate = useNavigate();

    /* ================= UI STATES ================= */
    const [loading, setLoading] = useState(true);
    const [notices] = useState([]);
    const [materials] = useState([]);
    const [assignments] = useState([]);


    useEffect(() => {
        /*
          BACKEND INTEGRATION (LATER)
    
          Example:
          GET /api/student/classes/{classId}/grades/{gradeId}/workspace
    
          Response:
          {
            notices: [],
            materials: [],
            assignments: []
          }
        */

        // Temporary: simulate initial load without mock data
        setLoading(false);
    }, [classId, gradeId]);

    return (
        <div className="workspace-layout">
            {/* LEFT */}
            <div className="workspace-main">
                <div className="workspace-header">
                    <h1>Subject</h1>
                    <p className="workspace-grade">
                        {gradeId.replace("-", " ").toUpperCase()}
                    </p>
                </div>

                {/* ===== LOADING STATE ===== */}
                {loading && (
                    <div className="workspace-loading">
                        Loading class content...
                    </div>
                )}

                {/* ===== NOTICES ===== */}
                {!loading && (
                    <div className="notice-section">
                        <h3>
                            <FontAwesomeIcon icon={faBell} /> Notices
                        </h3>

                        {notices.length === 0 ? (
                            <p className="empty-text">No notices available.</p>
                        ) : (
                            notices.map((notice) => (
                                <div key={notice.id} className="notice-item">
                                    <FontAwesomeIcon icon={faBell} />
                                    <span>{notice.message}</span>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* ===== MATERIALS ===== */}
                {!loading && (
                    <div className="content-list">
                        {materials.length === 0 ? (
                            <p className="empty-text">No study materials uploaded yet.</p>
                        ) : (
                            materials.map((item) => (
                                <div key={item.id} className="content-item">
                                    <FontAwesomeIcon
                                        icon={item.type === "pdf" ? faFilePdf : faVideo}
                                    />
                                    <span>{item.title}</span>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* ===== ASSIGNMENTS ===== */}
                {!loading && (
                    <div className="assignment-section">
                        <h3>
                            <FontAwesomeIcon icon={faClipboardList} /> Assignments
                        </h3>

                        {assignments.length === 0 ? (
                            <p className="empty-text">No assignments assigned yet.</p>
                        ) : (
                            assignments.map((assignment) => (
                                <div
                                    key={assignment.id}
                                    className="assignment-banner"
                                    onClick={() =>
                                        navigate(
                                            `/student/classes/${classId}/grade/${gradeId}/assignments/${assignment.id}`
                                        )
                                    }
                                >
                                    <div>
                                        <strong>{assignment.title}</strong>
                                        <p>Due date: {assignment.dueDate}</p>
                                    </div>

                                    <span className={`status ${assignment.status}`}>
                                        {assignment.statusLabel}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* RIGHT */}
            <div className="workspace-side">
                <AskAICard />
            </div>
        </div>
    );
};

export default ClassWorkspace;
