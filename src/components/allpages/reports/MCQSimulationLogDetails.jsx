import  { useEffect, useState } from "react";
import notify from "../../../assets/svg/utils/toast/Toast";
import {

  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,

} from "@mui/material";

const MCQSimulationLogDetails = () => {
  const [attemptDetails] = useState(null);
 

  const fetchAttemptDetails = async (attemptID) => {
    try {
      console.log("Fetching attempt details for ID:", attemptID);
    } catch (error) {
      notify("error", "Failed to fetch attempt details");
    }
  };

  useEffect(() => {
    const attemptID = localStorage.getItem("attemptID");
    if (attemptID) {
      const parsedAttemptID = JSON.parse(attemptID);
      fetchAttemptDetails(parsedAttemptID);
    } else {
      notify("error", "Attempt ID not found");
    }
  }, []);

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Test Name</TableCell>
              <TableCell>Attempts</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Maximum Score</TableCell>
              <TableCell>Attempt Score</TableCell>
              <TableCell>Pass/Fail</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attemptDetails &&
              attemptDetails?.map((log, index) => (
                <TableRow key={index}>
                  <TableCell>{log.department}</TableCell>
                  <TableCell>{log.role}</TableCell>
                  <TableCell>{log.login}</TableCell>
                  <TableCell>{log.logout}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default MCQSimulationLogDetails;
