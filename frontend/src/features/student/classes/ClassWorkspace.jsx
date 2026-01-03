import React from "react";
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
    const { gradeId } = useParams();
    const navigate = useNavigate();

    return (
        <div className="workspace-layout">
            {/* LEFT */}
            <div className="workspace-main">
                <div className="workspace-header">
                    <h1>Physics</h1>
                    <p className="workspace-grade">
                        {gradeId.replace("-", " ").toUpperCase()}
                    </p>
                </div>

                {/* Notices */}
                <div className="notice-section">
                    <h3>
                        <FontAwesomeIcon icon={faBell} /> Notices
                    </h3>

                    <div className="notice-item">
                        <FontAwesomeIcon icon={faBell} />
                        <span>
                            Final exam preparation session will be held on Friday at 6.00 PM.
                        </span>
                    </div>
                </div>

                {/* Materials */}
                <div className="content-list">
                    <div className="date-label">10 Jan 2026</div>

                    <div className="content-item">
                        <FontAwesomeIcon icon={faFilePdf} />
                        <span>Introduction to Motion – Lecture Slides</span>
                    </div>

                    <div className="content-item">
                        <FontAwesomeIcon icon={faVideo} />
                        <span>Recording – Lecture 01 (Motion)</span>
                    </div>
                </div>

                {/* Assignments (SMALL BANNERS) */}
                <div className="assignment-section">
                    <h3>
                        <FontAwesomeIcon icon={faClipboardList} /> Assignments
                    </h3>

                    <div
                        className="assignment-banner"
                        onClick={() =>
                            navigate(
                                `/student/classes/1/grade/${gradeId}/assignments/1`
                            )
                        }
                    >
                        <div>
                            <strong>Assignment 01 – Laws of Motion</strong>
                            <p>Due date: 15 Jan 2026</p>
                        </div>

                        <span className="status pending">Not Submitted</span>
                    </div>
                </div>
            </div>

            {/* RIGHT */}
            <div className="workspace-side">
                <AskAICard />
            </div>
        </div>
    );
};

export default ClassWorkspace;
