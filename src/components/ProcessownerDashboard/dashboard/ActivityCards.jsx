import React, { useState } from "react";
import StatusModal from "./StatusModal";

const cardData = [
  { title: "InProgress state", color: "#FFD700", icon: "📝" },
  { title: "Review state", color: "#87CEEB", icon: "👁️" },
  { title: "Pending review", color: "#FFA07A", icon: "⏳" },
  { title: "Pending approve", color: "#9370DB", icon: "🔍" },
  { title: "Approved", color: "#90EE90", icon: "✅" },
];

// Map card titles to keys in the data object
const statusKeyMap = {
  "InProgress state": "DraftState",
  "Review state": "ReviewState",
  "Pending review": "PendingReview",
  "Pending approve": "PendingApproval",
  Approved: "Approved", // If you have this key in your data
};

const ActivityCards = ({ dynamicDashboardData }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  console.log(
    "dynamicDashboardDataActivecard",
    dynamicDashboardData?.data?.ElementStartus
  );

  const handleCardClick = (statusTitle) => {
    setSelectedStatus(statusTitle);
    setOpenModal(true);
  };

  // Get the status counts object
  const statusCounts = dynamicDashboardData?.data?.ElementStartus || {};

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "15px",
          justifyContent: "space-between",
        }}
      >
        {cardData.map((card, idx) => (
          <div
            key={idx}
            onClick={() => handleCardClick(card.title)}
            style={{
              flex: 1,
              minWidth: 0,
              background: hoveredIndex === idx ? "#ffffff" : "#f8f8f8",
              border: `1px solid ${hoveredIndex === idx ? card.color : "#e0e0e0"
                }`,
              borderRadius: "12px",
              padding: "15px",
              boxShadow:
                hoveredIndex === idx
                  ? "0 5px 15px rgba(0,0,0,0.1)"
                  : "0 2px 5px rgba(0,0,0,0.05)",
              transition: "all 0.3s ease",
              cursor: "pointer",
              transform: hoveredIndex === idx ? "translateY(-5px)" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  fontSize: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background:
                    hoveredIndex === idx ? card.color + "30" : "transparent",
                }}
              >
                {card.icon}
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: hoveredIndex === idx ? card.color : "#333",
                }}
              >
                {card.title}
              </h3>
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: hoveredIndex === idx ? card.color : "#666",
                background:
                  hoveredIndex === idx ? card.color + "15" : "transparent",
                borderRadius: "20px",
                padding: "5px 12px",
                minWidth: "30px",
                textAlign: "center",
              }}
            >
              {
                // Show the count from statusCounts, default to 0 if not found
                statusCounts[statusKeyMap[card.title]] !== undefined
                  ? statusCounts[statusKeyMap[card.title]]
                  : 0
              }
            </div>
          </div>
        ))}
      </div>

      {/* 👇 Modal */}
      <StatusModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        statusName={selectedStatus}
      />
    </>
  );
};

export default ActivityCards;
