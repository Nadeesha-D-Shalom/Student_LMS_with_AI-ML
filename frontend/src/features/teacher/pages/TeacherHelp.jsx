import React, { useState } from "react";
import { APP_VERSION } from "../../../config/appConfig";
import "./teacherHelp.css";

export default function TeacherHelp() {
    const [openIndex, setOpenIndex] = useState(null);

    const sections = [
        {
            title: "Creating Classes",
            content: (
                <>
                    <p>
                        Use the <strong>My Classes</strong> section to create and manage the
                        classes you conduct.
                    </p>
                    <ul>
                        <li>Select the correct <strong>subject</strong> and <strong>grade</strong></li>
                        <li>Enter the <strong>academic start year</strong> and start month</li>
                        <li>Define <strong>location</strong> (Online / Physical hall)</li>
                        <li>Set accurate <strong>start and end times</strong></li>
                    </ul>
                    <p>
                        Each class you create is isolated. Only students enrolled in that
                        specific class and grade will see its content.
                    </p>
                </>
            )
        },
        {
            title: "Materials & Notices",
            content: (
                <>
                    <p>
                        The <strong>Materials & Notices</strong> section allows you to publish
                        learning content efficiently.
                    </p>
                    <ul>
                        <li>Create <strong>weekly sections</strong> (e.g. “Week 1” or “10 Feb – 16 Feb”)</li>
                        <li>Upload PDFs, documents, slides, or add reference links</li>
                        <li>Select one or multiple classes when publishing</li>
                    </ul>
                    <p>
                        Notices always appear at the <strong>top of the student page</strong>
                        and are visible only to the selected classes and grades.
                    </p>
                </>
            )
        },
        {
            title: "Assignments",
            content: (
                <>
                    <p>
                        Assignments are created once and can be shared across multiple classes.
                    </p>
                    <ul>
                        <li>Provide a clear <strong>title</strong> and instructions</li>
                        <li>Set a <strong>due date</strong> carefully</li>
                        <li>Select all relevant classes before publishing</li>
                    </ul>
                    <p>
                        Students will submit their answers through their workspace, and
                        submissions are tracked per class.
                    </p>
                </>
            )
        },
        {
            title: "Tests",
            content: (
                <>
                    <p>
                        The <strong>Tests</strong> section is used to evaluate student progress.
                    </p>
                    <ul>
                        <li>Create <strong>MCQ-based</strong> tests or upload question papers</li>
                        <li>Generate test links if required</li>
                        <li>Marks are stored separately for each test and class</li>
                    </ul>
                    <p>
                        Always verify the selected grade before publishing a test.
                    </p>
                </>
            )
        },
        {
            title: "Students",
            content: (
                <>
                    <p>
                        The <strong>Students</strong> section provides an overview of enrolled
                        learners.
                    </p>
                    <ul>
                        <li>View students per class and grade</li>
                        <li>Monitor assignment submissions</li>
                        <li>Track test results and performance trends</li>
                    </ul>
                    <p>
                        This helps you identify students who need additional support.
                    </p>
                </>
            )
        },
        {
            title: "Best Practices",
            content: (
                <>
                    <ul>
                        <li>Always double-check the selected grade before publishing content</li>
                        <li>Use weekly titles to keep materials organized</li>
                        <li>Keep notices short and relevant</li>
                        <li>Avoid duplicating materials across weeks</li>
                        <li>Regularly review student progress</li>
                    </ul>
                </>
            )
        }
    ];

    return (
        <div className="teacher-help-page">
            <h2>Teacher Help & Guidelines</h2>

            <div className="help-accordion">
                {sections.map((s, i) => (
                    <div key={i} className={`help-item ${openIndex === i ? "open" : ""}`}>
                        <button
                            className="help-header"
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        >
                            <span>
                                {i + 1}. {s.title}
                            </span>
                            <span className="chevron">
                                {openIndex === i ? "−" : "+"}
                            </span>
                        </button>

                        <div className="help-content">
                            {s.content}
                        </div>
                    </div>
                ))}
            </div>

            <div className="help-footer">
                Version {APP_VERSION} · Made with ❤️ · Developed by <strong>Nadeesha D Shalom</strong>
            </div>
        </div>
    );
}
