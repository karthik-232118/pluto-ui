import {
  Box,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TextField,
  Switch,
  FormControlLabel,
  Card,
  IconButton,
  Backdrop,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteFlow, GetflowList } from "../../store/flow/action";
import { useDispatch, useSelector } from "react-redux";
import NewFlow from "./createnewflow/NewFLow";
import { useTranslation } from "react-i18next";
// import { updateConfig } from "../../store/flow/slice";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaArrowUpRightFromSquare, FaRegCopy } from "react-icons/fa6";
import { Typography } from "@mui/material";
import MyWorkflow from "./myworkflow";
import { dateformatter } from "../../utils";
import DeleteConfirmationPopup from "../../components/allpages/masterpopups/DeleteConfirmationPopup";
import Pageloader from "../../assets/image/cubeloader.gif";
import { lightGreen } from "@mui/material/colors";
import AccessDenied from "../accessDenied/AccessDenied";

const WorkflowList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getworkflowList, loading } = useSelector((state) => state.workflow);

  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page
  const [searchTerm, setSearchTerm] = useState(""); // Search input value
  const [filteredWorkflows, setFilteredWorkflows] = useState([]); // Filtered workflows
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editdata, setEditedData] = useState({});
  const [isMyWorkFlow, setIsMyWorkFlow] = useState(false);
  const { t } = useTranslation();
  
  useEffect(() => {
    dispatch(GetflowList()); // Fetch workflows on mount
  }, [dispatch, isMyWorkFlow]);

  const handleClose = () => {
    setDeleteOpen(false);
  };
  const handleDelete = (id) => {
    setDeleteOpen(true);
    setEditedData({ FlowID: id });
  };

  useEffect(() => {
    if (getworkflowList) {
      // Filter workflows based on search term
      const filtered = getworkflowList.filter((workflow) =>
        workflow?.FlowName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredWorkflows(filtered);
    }
  }, [searchTerm, getworkflowList]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };
  const clickonRow = (id) => {
    navigate(`/workflow-creation/${id}`);
  };
  const handleDeleteConfirmation = async () => {
    const res = await dispatch(
      DeleteFlow({
        FlowID: editdata.FlowID,
        DeletedBy: localStorage.getItem("user_id"),
      })
    );
    setEditedData(null);
    setDeleteOpen(false);
  };

   const userType = localStorage.getItem("user_type");
          if (userType === "EndUser" ) {
            return <AccessDenied />;
          }
  return (
    <Box>
      {loading && (
        <Backdrop
          sx={(theme) => ({
            color: "#fff",
            zIndex: theme.zIndex.drawer + 1,
          })}
          open={loading}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={Pageloader}
              alt="loader"
              style={{ height: "25%", width: "25%" }}
            />
          </div>
        </Backdrop>
      )}
      <Box
        sx={{
          margin: "25px",
          borderRadius: "8px",
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: (theme) => {
            theme.palette.background.default;
          },
        }}
      >
        <Box>
          <Typography
            variant="h6"
            style={{ fontWeight: "500", textWrap: "nowrap" }}
          >
            {isMyWorkFlow ? t("My Work Flow") : t("WorkFlow List")}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {t("Track Workflows")}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            // marginBottom: 2,
            width: "100%",
            justifyContent: "end",
          }}
        >
          <FormControlLabel
            sx={{
              fontWeight: "bold",
              // marginLeft: "auto",
              padding: "0.5rem",
              "& .MuiFormControlLabel-label": {
                marginBottom: "0px", 
              },
            }}
            control={
              <Switch
                defaultChecked={isMyWorkFlow}
                onChange={(e) => {
                  setIsMyWorkFlow(e.target.checked);
                }}
              />
            }
            label={t("Participated Workflow")}
          />
          {!isMyWorkFlow ? (
            <Button
              variant="outlined"
              onClick={() => {
                setOpen(!open);
                setEditedData(null);
              }}
            >
              {t("createNew")}
            </Button>
          ) : (
            <div />
          )}
        </Box>
      </Box>

      {!isMyWorkFlow ? (
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            margin: 2,
            marginTop: 4,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
            overflow: "hidden",
            padding: 2,
          }}
        >
          {/* Top Controls */}

          <Box>
            <TextField
              label={t("searchWorkflows")}
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: "30%" }}
            />
          </Box>
          {/* Table Container with Shadow */}
          <Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t("tableHeadersWorkflow.flowName")}</TableCell>
                  <TableCell>{t("tableHeadersWorkflow.description")}</TableCell>
                  <TableCell>{t("tableHeadersWorkflow.startDate")}</TableCell>
                  <TableCell>{t("tableHeadersWorkflow.endDate")}</TableCell>
                  <TableCell>{t("tableHeadersWorkflow.createdDate")}</TableCell>
                  {/* <TableCell>{t("tableHeadersWorkflow.isActive")}</TableCell> */}
                  <TableCell>{t("tableHeadersWorkflow.noOfSteps")}</TableCell>
                  <TableCell>{t("tableHeadersWorkflow.actions")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredWorkflows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((workflow) => (
                    <TableRow key={workflow.FlowID}>
                      <TableCell>{workflow.FlowName}</TableCell>
                      <TableCell>{workflow.FlowDescription}</TableCell>
                      <TableCell>
                        {dateformatter(workflow.AccessStartDate)}
                      </TableCell>
                      <TableCell>
                        {dateformatter(workflow.AccessEndDateu)}
                      </TableCell>
                      <TableCell>
                        {dateformatter(workflow.CreatedDate)}
                      </TableCell>
                      {/* <TableCell>
                        <FormControlLabel
                          control={<Switch checked={workflow.IsActive} />}
                          labelPlacement="start"
                        />
                      </TableCell> */}
                      <TableCell>{workflow.NosOfSteps}</TableCell>
                      <TableCell>
                        <IconButton
                          color="info"
                          title="Flow"
                          onClick={() => {
                            clickonRow(workflow.FlowID);
                          }}
                        >
                          <FaArrowUpRightFromSquare />
                        </IconButton>
                        <IconButton
                          title="Copy"
                          onClick={() => {
                            setOpen(!open);
                            setEditedData({ ...workflow, Action: 'Copy' });
                          }}

                        >
                          <FaRegCopy color={lightGreen['A700']} />
                        </IconButton>
                        <IconButton
                          title="Edit"
                          onClick={() => {
                            setOpen(!open);
                            setEditedData(workflow);
                          }}
                          disabled={workflow.IsFlowStarted}
                          color="primary"
                        >
                          <FaEdit />
                        </IconButton>
                        <IconButton
                          title="Delete"
                          color="secondary"
                          onClick={() => {
                            handleDelete(workflow.FlowID);
                          }}
                          disabled={workflow.IsFlowStarted}
                        >
                          <FaTrash />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Box>

          <TablePagination
            component="div"
            count={filteredWorkflows.length}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25]}
          />
          <NewFlow
            open={open}
            onClose={() => {
              setOpen(!open);
            }}
            editdata={editdata}
          />

          <DeleteConfirmationPopup
            open={deleteOpen}
            onClose={handleClose}
            onConfirm={handleDeleteConfirmation}
            title={t("Delete Workflow")}
          />
        </Card>
      ) : (
        <>
          <MyWorkflow />
        </>
      )}
    </Box>
  );
};

export default WorkflowList;
