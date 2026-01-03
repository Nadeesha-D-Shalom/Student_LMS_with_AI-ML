import React, { useEffect, useState } from "react";
import "./advertisementPanel.css";

const adsData = [
  {
    id: 1,
    type: "image",
    title: "Advanced Physics Classes",
    description: "Join Mr. A. Perera’s A/L Physics revision batch",
    src: "/ads/physics-ad.jpg"
  },
  {
    id: 2,
    type: "video",
    title: "NexDS Institute",
    description: "Enroll now for 2026 O/L & A/L programs",
    src: "/ads/nexds-promo.mp4"
  }
];

const AdvertisementPanel = () => {
  const [visibleAds, setVisibleAds] = useState(adsData);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCanClose(true);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

  const closeAd = (id) => {
    if (!canClose) return;
    setVisibleAds((prev) => prev.filter((ad) => ad.id !== id));
  };

  if (visibleAds.length === 0) return null;

  return (
    <div className="ads-panel">
      {visibleAds.map((ad) => (
        <div key={ad.id} className="ad-card">
          {ad.type === "image" && (
            <img src={ad.src} alt={ad.title} />
          )}

          {ad.type === "video" && (
            <video src={ad.src} controls />
          )}

          <div className="ad-content">
            <h4>{ad.title}</h4>
            <p>{ad.description}</p>
          </div>

          <button
            className={`close-btn ${canClose ? "active" : ""}`}
            disabled={!canClose}
            onClick={() => closeAd(ad.id)}
          >
            {canClose ? "Close" : "You can close in 10s"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdvertisementPanel;
