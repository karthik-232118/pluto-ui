import React from "react";
import { Avatar, Typography, Box } from "@mui/material";
import ReadMoreLess from "../readMoreOrLess/ReadMoreLess";
import styles from "./ActivityAvatars.module.css";
import moment from "moment";

const ActivityAvatars = ({ activityData = [], count = 3 }) => {
  const profiles = activityData || [];
  const maxDisplay = count;

  const displayedProfiles = profiles.slice(0, maxDisplay) || [];
  const remainingCount = profiles.length - maxDisplay;

  return (
    <Box className={styles.infoWrapper}>
      <Box className={styles.avatarsContainer}>
        {displayedProfiles.map((profile, index) => (
          <Avatar
            key={profile?.user}
            src={
              profile?.userAvatar ||
              "https://s3-alpha-sig.figma.com/img/67da/9fdd/d372b1b5b44ffef41eed6ceb810ddf8a"
            }
            alt={profile.userType}
            className={`${styles.avatarStyle} ${styles.overlapEffect}`}
          />
        ))}

        {remainingCount > 0 && (
          <Box className={`${styles.extraCount} ${styles.overlapEffect}`}>
            +{remainingCount}
          </Box>
        )}
      </Box>

      {displayedProfiles?.length > 0 && (
        <Box className={styles.commentsContainer}>
          {profiles.map((profile, index) => (
            <React.Fragment key={index}>
              <Box>
                <Box className={styles.profileRow}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {!profile?.isReviewSkipped ? (
                      <Typography
                        sx={{ fontSize: "14px" }}
                        className={`${styles.approvalStatus} ${
                          profile?.approvalStatus === "Approved"
                            ? styles.approved
                            : profile?.approvalStatus === "Rejected"
                            ? styles.rejected
                            : styles.pending
                        }`}
                      >
                        {profile?.approvalStatus || "Pending"}
                      </Typography>
                    ) : (
                      <Typography
                        className={`${styles.approvalStatus} ${styles.skipped}`}
                      >
                        Skipped Review
                      </Typography>
                    )}
                    <Typography
                      variant="body1"
                      className={styles.userName}
                      sx={{
                        fontWeight: 500,
                        fontSize: "14px",
                        textAlign: "left",
                      }}
                    >
                      {profile?.user}
                    </Typography>

                    <Typography
                      variant="body2"
                      style={{
                        marginLeft: "10px",
                        backgroundColor: "green",
                        color: "#fff",
                        fontWeight: "300",
                        fontSize: "10px",
                        padding: "5px 8px",
                        borderRadius: "20px",
                      }}
                    >
                      {profile?.userType}
                    </Typography>
                    {profile?.modifiedDate && (
                      <Typography
                        variant="body2"
                        className={styles.userActivityDate}
                      >
                        <p>at</p>
                        <p>
                          {moment
                            .utc(profile?.modifiedDate)
                            .local()
                            .format("D MMM YY , h:mm A")}
                        </p>
                      </Typography>
                    )}
                  </Box>
                </Box>
                {profile?.comment ? (
                  <Box className={styles.commentText}>
                    <ReadMoreLess
                      text={profile?.comment}
                      label="Comment"
                      clip={100}
                    />
                  </Box>
                ) : (
                  <Typography className={styles.noCommentText}>
                    No comment
                  </Typography>
                )}
              </Box>
              {index < profiles.length - 1 && (
                <Box className={styles.divider} />
              )}
            </React.Fragment>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ActivityAvatars;

// activated avataras dummy data
