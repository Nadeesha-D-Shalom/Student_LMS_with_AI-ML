import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import "./home.css";

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      className="scroll-top-btn"
      onClick={() =>
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
      aria-label="Scroll to top"
    >
      <FontAwesomeIcon icon={faArrowUp} />
    </button>
  );
};

export default ScrollToTop;
