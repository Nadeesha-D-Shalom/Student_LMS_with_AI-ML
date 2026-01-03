import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import "./askAICard.css";

const AskAICard = () => {
  const navigate = useNavigate();

  return (
    <div className="ask-ai-card">
      <div className="ask-ai-header">
        <FontAwesomeIcon icon={faRobot} className="ask-ai-icon" />
        <h4>Need help?</h4>
      </div>

      <p>
        Ask NexDS AI about this lesson, assignment, or any concept you don’t
        understand.
      </p>

      <button
        className="ask-ai-btn"
        onClick={() => navigate("/ai")}
      >
        Ask NexDS AI
        <FontAwesomeIcon icon={faArrowRight} />
      </button>
    </div>
  );
};

export default AskAICard;
