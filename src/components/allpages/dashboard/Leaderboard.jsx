import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import "./ActionablesAndLeaderboard.css";
import blackBadge from "../../../assets/svg/dashboardSVG/blackBadge.svg";
import nextbutton from "../../../assets/svg/dashboardSVG/next-button.svg";
import previousbutton from "../../../assets/svg/dashboardSVG/previous-button.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  GetLeaderboard,
  GetLeaderboardData,
} from "../../../store/dashboard/action";
import { useTheme } from "@emotion/react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const Leaderboard = ({ dashboardData }) => {
  const { t } = useTranslation();
 
  const dispatch = useDispatch();
  const leaderboardData = useSelector((state) => state.dashboard.leaderboard);
  const leaderboardDetailedData = useSelector(
    (state) => state.dashboard.leaderboardData
  );
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Display 5 rows per page
  const [isMCQ, setIsMCQ] = useState(false); // Track switch status
  const [tesOptions, setTesOptions] = useState([]);
  const [mcqOptions, setMcqOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("")
  const theme = useTheme();
  useEffect(() => {
    dispatch(GetLeaderboard());
  }, [dispatch]);

  useEffect(() => {
    if (leaderboardData && leaderboardData.data) {
      setTesOptions(leaderboardData.data.tes.values);
      setMcqOptions(leaderboardData.data.mcq.values);
    }
  }, [leaderboardData]);

  useEffect(() => {
    // Remove the code that automatically selects and fetches data for the first option
    // Now, API will only be called when user selects from dropdown
  }, [tesOptions, mcqOptions, isMCQ]);

  const handleGetLeaderboardData = (testMCQID, testSimulationID) => {
    const requestBody = {
      TestMCQIDs: testMCQID ? [testMCQID] : [],
      TestSimulationIDs: testSimulationID ? [testSimulationID] : [],
      Limit: 10,
      Page: 1,
    };

    dispatch(GetLeaderboardData(requestBody));
  };

  const totalPages = Math.ceil(
    (dashboardData?.leaderBoard?.length || 0) / rowsPerPage
  );



  useEffect(() => {
    console.log(dashboardData, "ActionablesAndLeaderboard");
  }, [dashboardData]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
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
    <Card
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
        <Box
          sx={{
            Padding: "1rem",
          }}
        >
          <Typography variant="h6" className="top_variant">
            Leaderboard
          </Typography>
          <Typography variant="body2" className="sub_variant">
            Overview of latest month
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
            TES
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
                MCQ
              </Typography>
            }
            className="swith_para"
          />
          <div style={{ width: "250px" }}>
            <select
              id="titleSelect"
              value={selectedOption}
              onChange={handleSelectChange}
              style={{
                height: "36px",
                width: "250px",
                padding: "0 8px",
                border: "none",
                outline: "none",
                backgroundColor: theme.palette.background.default,
                borderRadius: "8px",
              }}
            >
              <option value="" disabled>
                Select
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

      {/* Scrollable Table */}
      <Box
        mt={-2.5}
        sx={{
          maxHeight: "400px", // Adjust the height as needed
          overflowY: "auto",
        }}
      >
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
              <th style={{ padding: "8px", textAlign: "left" }}>
                {t("TableHeaderRank")}{ "RANK"}
              </th>
              <th style={{ padding: "8px", textAlign: "left" }}>
                {" "}
                {t("TableHeaderName")} {/* "NAME" */}
              </th>
              <th style={{ padding: "8px", textAlign: "left" }}>
                {t("TableHeaderBadge")} {/* "BADGE" */}
              </th>
              <th style={{ padding: "8px", textAlign: "left" }}>
                {" "}
                {t("TableHeaderScore")} {/* "SCORE" */}
              </th>
              <th style={{ padding: "8px", textAlign: "left" }}>
                {t("TableHeaderAttempts")} {/* "ATTEMPTS" */}
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
                    <td style={{ padding: "8px" }}>{user.UserName.trim()}</td>
                    <td style={{ padding: "8px" }}>
                      <img src={blackBadge} alt="User Badge" />
                    </td>
                    <td style={{ padding: "8px" }}>{Math.floor(user.Score)}</td>
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
                    {/* <Nodata image={true} height={400} /> */}
                    <Typography variant="body2">
                      {" "}
                      {t("NoLeaderBoardDataFound")}{" "}
                      {/* Dynamically translates the text */}
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
                  <td style={{ padding: "8px" }}>{`#${index + 1}`}</td>
                  <td style={{ padding: "8px" }}>{user.UserName.trim()}</td>
                  <td style={{ padding: "8px" }}>
                    <img src={blackBadge} alt="User Badge" />
                  </td>
                  <td style={{ padding: "8px" }}>{Math.floor(user.Score)}</td>
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
                  {/* <Nodata image={true} height={400} /> */}
                  <Typography variant="body2">
                    {" "}
                    {t("NoLeaderBoardDataFound")}{" "}
                    {/* Dynamically translates the text */}{" "}
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Box>

      {/* Pagination (optional) */}
      {totalPages > 1 && (
        <Box
          mt={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            variant="outlined"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            style={{
              borderColor: "#D0D5DD",
              borderRadius: "8px",
              color: "#344054",
              textTransform: "none",
            }}
          >
            <img src={previousbutton} alt="" /> Previous
          </Button>

          <Box display="flex">
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                className="pagination_btn"
                onClick={() => setCurrentPage(i + 1)}
                style={{
                  backgroundColor: currentPage === i + 1 ? "#3D54CD" : "",
                  color: currentPage === i + 1 ? "white" : "",
                }}
              >
                {i + 1}
              </Button>
            ))}
          </Box>

          <Button
            variant="outlined"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            style={{
              borderColor: "#D0D5DD",
              borderRadius: "8px",
              color: "#344054",
              textTransform: "none",
            }}
          >
            Next <img src={nextbutton} alt="" />
          </Button>
        </Box>
      )}
    </Card>
  );
};

export default Leaderboard;



Leaderboard.propTypes = {
  dashboardData: PropTypes.shape({
    leaderBoard: PropTypes.arrayOf(
      PropTypes.shape({
        UserID: PropTypes.string,
        UserName: PropTypes.string,
        Score: PropTypes.number,
        Attempt: PropTypes.number,
        TotalAttempts: PropTypes.number,
      })
    ),
  }),
};
