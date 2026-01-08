import React from "react";
import { useNavigate } from "react-router-dom";

const InfoModal = ({ open, onClose }) => {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>Registration Restricted</h3>

        <p style={styles.message}>
          Please contact the Institute Admin to register to the LMS.
        </p>

        <div style={styles.actions}>
          <button
            style={styles.secondaryBtn}
            onClick={() => navigate("/")}
          >
            Go to Home
          </button>

          <button
            style={styles.primaryBtn}
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>

        <button style={styles.closeBtn} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999
  },
  modal: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "24px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
  },
  title: {
    fontSize: "18px",
    fontWeight: 600,
    marginBottom: "10px"
  },
  message: {
    fontSize: "14px",
    color: "#374151",
    marginBottom: "20px"
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginBottom: "16px"
  },
  primaryBtn: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 500
  },
  secondaryBtn: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    cursor: "pointer",
    fontWeight: 500
  },
  closeBtn: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#f3f4f6",
    cursor: "pointer",
    fontWeight: 500
  }
};

export default InfoModal;
