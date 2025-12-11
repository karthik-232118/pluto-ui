import { useEffect, useState, useRef } from "react";
import {
  Box,
  Card,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
} from "@mui/material";
import "./ActionablesAndLeaderboard.css";
import blackBadge from "../../../assets/svg/dashboardSVG/blackBadge.svg";

import { useDispatch, useSelector } from "react-redux";
import {
  GetLeaderboard,
  GetLeaderboardData,
} from "../../../store/dashboard/action";
import MyActionable from "./MyActionable";
import { useTheme } from "@emotion/react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import PendingAcknowledgments from "./PendingAcknowledgments";

const ActionablesAndLeaderboard = ({ dashboardData }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const leaderboardData = useSelector((state) => state.dashboard.leaderboard);
  const leaderboardDetailedData = useSelector(
    (state) => state.dashboard.leaderboardData
  );

  const [isMCQ, setIsMCQ] = useState(false);
  const [tesOptions, setTesOptions] = useState([]);
  const [mcqOptions, setMcqOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const hasFetchedLeaderboard = useRef(false);

  useEffect(() => {
    if (hasFetchedLeaderboard.current || leaderboardData?.data) return;
    setIsLoading(true);
    dispatch(GetLeaderboard())
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false));
    hasFetchedLeaderboard.current = true;
  }, [dispatch, leaderboardData]);

  useEffect(() => {
    if (leaderboardData && leaderboardData.data) {
      setTesOptions(leaderboardData.data.tes.values);
      setMcqOptions(leaderboardData.data.mcq.values);
    }
  }, [leaderboardData]);

  const handleGetLeaderboardData = (testMCQID, testSimulationID) => {
    const requestBody = {
      TestMCQIDs: testMCQID ? [testMCQID] : [],
      TestSimulationIDs: testSimulationID ? [testSimulationID] : [],
      Limit: 10,
      Page: 1,
    };
    dispatch(GetLeaderboardData(requestBody));
  };

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);

    const selectedOption = options.find(
      (option) =>
        option.TestSimulationName === selectedValue ||
        option.TestMCQName === selectedValue
    );

    if (selectedOption) {
      handleGetLeaderboardData(
        isMCQ ? selectedOption.TestMCQID : null,
        !isMCQ ? selectedOption.TestSimulationID : null
      );
    }
  };

  const options = isMCQ ? mcqOptions : tesOptions;

  return (
    <Grid
      container
      sx={{
        // mb: 2,
        // px: 2,
        // width: "100%",
        // maxWidth: "100%",
        // marginLeft: "1rem",
        // marginRight: "1rem",
      }}
    >
      {/* <Grid item xs={12} md={4} sm={4}>
        <PendingAcknowledgments
          dashboardData={dashboardData}
          // actionableData={actionableData}
        />
      </Grid> */}
      <Grid item xs={12} md={12} sm={12}>
        <Card
          className="equal-height"
          sx={{
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              position: "sticky",
              top: 0,
              backgroundColor: theme.palette.background.default,
              zIndex: 1,
              paddingBottom: "1rem",
              borderBottom: "1px solid #e0e0e0",
              padding: "1rem",
            }}
          >
            <Box>
              <Typography variant="h6" className="top_variant">
                {t("Leaderboard")}
              </Typography>
              <Typography variant="body2" className="sub_variant">
                {t("OverviewLatestMonth")}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography
                variant="body2"
                sx={{
                  color: !isMCQ ? "blue" : "black",
                  marginRight: "8px",
                }}
              >
                {t("tes")}
              </Typography>
              <FormControlLabel
                control={
                  <Switch checked={isMCQ} onChange={() => setIsMCQ(!isMCQ)} />
                }
                label={
                  <Typography
                    variant="body2"
                    sx={{
                      color: isMCQ ? "blue" : "black",
                    }}
                  >
                    {t("mcq")}
                  </Typography>
                }
                className="swith_para"
              />

              <div
                style={{
                  width: "230px",
                  border: "1px solid #D0D5DD",
                  borderRadius: "8px",
                  backgroundColor: "#00000014",
                  fontFamily: "Inter",
                }}
              >
                <select
                  id="titleSelect"
                  value={selectedOption}
                  onChange={handleSelectChange}
                  style={{
                    height: "36px",
                    width: "230px",
                    padding: "8px",
                    border: "none",
                    outline: "none",
                    backgroundColor: "#00000014",
                    fontFamily: "Inter",
                    borderRadius: "8px",
                    paddingRight: "8px",
                  }}
                  disabled={isLoading}
                >
                  <option value="" disabled>
                    {isLoading ? t("Loading...") : t("Select")}
                  </option>
                  {options?.map((option) => (
                    <option
                      key={option.TestSimulationID || option.TestMCQID}
                      value={option.TestSimulationName || option.TestMCQName}
                    >
                      {option.TestSimulationName || option.TestMCQName}
                    </option>
                  ))}
                </select>
              </div>
            </Box>
          </Box>

          <Box
            mt={-2.5}
            sx={{
              overflowY: "scroll",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
              padding: 1,
            }}
          >
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 400,
                }}
              >
                <Typography variant="body2">{t("Loading...")}</Typography>
              </Box>
            ) : (
              <table
                className="leaderboard_table"
                style={{ width: "100%", borderCollapse: "collapse" }}
              >
                <thead
                  style={{
                    backgroundColor: theme.palette.background.default,
                  }}
                >
                  <tr>
                    <th
                      style={{
                        padding: "8px",
                        textAlign: "left",
                        color: "#00000099",
                        fontSize: 12,
                        fontWeight: 700,
                        width: "10%",
                      }}
                    >
                      {t("TableHeaderRank")}
                    </th>
                    <th
                      style={{
                        padding: "8px",
                        textAlign: "left",
                        color: "#00000099",
                        fontSize: 12,
                        fontWeight: 700,
                        width: "55%",
                      }}
                    >
                      {t("TableHeaderName")}
                    </th>
                    <th
                      style={{
                        padding: "8px",
                        textAlign: "left",
                        color: "#00000099",
                        fontSize: 12,
                        fontWeight: 700,
                        width: "10%",
                      }}
                    >
                      {t("TableHeaderBadge")}
                    </th>
                    <th
                      style={{
                        padding: "8px",
                        textAlign: "left",
                        color: "#00000099",
                        fontSize: 12,
                        fontWeight: 700,
                        width: "10%",
                      }}
                    >
                      {t("TableHeaderScore")}
                    </th>
                    <th
                      style={{
                        padding: "8px",
                        textAlign: "left",
                        color: "#00000099",
                        fontSize: 12,
                        fontWeight: 700,
                        width: "10%",
                      }}
                    >
                      {t("TableHeaderAttempts")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isMCQ ? (
                    leaderboardDetailedData?.mcq?.length > 0 ? (
                      leaderboardDetailedData.mcq.map((user, index) => (
                        <tr
                          key={user.UserID}
                          style={{
                            backgroundColor: theme.palette.background.default,
                          }}
                        >
                          <td style={{ padding: "8px" }}>{`#${index + 1}`}</td>
                          <td style={{ padding: "8px", color: "#000000DE" }}>
                            {user.UserName.trim()}
                          </td>
                          <td style={{ padding: "8px" }}>
                            <img src={blackBadge} alt="User Badge" />
                          </td>
                          <td style={{ padding: "8px" }}>
                            {Math.floor(user.Score)}
                          </td>
                          <td
                            style={{ padding: "8px" }}
                          >{`${user.Attempt}/${user.TotalAttempts}`}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          style={{ textAlign: "center", padding: "16px" }}
                        >
                          <Typography variant="body2">
                            {t("NoLeaderBoardDataFound")}
                          </Typography>
                        </td>
                      </tr>
                    )
                  ) : leaderboardDetailedData?.tes?.length > 0 ? (
                    leaderboardDetailedData.tes.map((user, index) => (
                      <tr
                        key={user.UserID}
                        style={{
                          backgroundColor: theme.palette.background.default,
                        }}
                      >
                        <td style={{ padding: "8px", fontWeight: "400" }}>{`#${
                          index + 1
                        }`}</td>
                        <td
                          style={{
                            padding: "8px",
                            fontWeight: "500",
                            fontSize: "14px",
                          }}
                        >
                          {user.UserName.trim()}
                        </td>
                        <td style={{ padding: "8px" }}>
                          <img src={blackBadge} alt="User Badge" />
                        </td>
                        <td
                          style={{
                            padding: "8px",
                            fontWeight: "500",
                            fontSize: "14px",
                          }}
                        >
                          {Math.floor(user.Score)}
                        </td>
                        <td
                          style={{
                            padding: "8px",
                            fontWeight: "500",
                            fontSize: "14px",
                          }}
                        >{`${user.Attempt}/${user.TotalAttempts}`}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        style={{
                          textAlign: "center",
                          padding: "16px",
                          minHeight: 400,
                        }}
                      >
                        <Typography variant="body2">
                          {t("NoLeaderBoardDataFound")}
                        </Typography>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ActionablesAndLeaderboard;

ActionablesAndLeaderboard.propTypes = {
  dashboardData: PropTypes.object.isRequired,
  actionableData: PropTypes.object.isRequired,
};
