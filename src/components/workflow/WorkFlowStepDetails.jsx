import React, { useEffect, useState } from "react";
import {
    Box, Tabs, Tab, Typography, Avatar, Paper, Grid, Chip,
    Divider,
    Dialog,
    IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useDispatch, useSelector } from "react-redux";
import { GetStepDetails } from "../../store/flow/action";
import CloseIcon from '@mui/icons-material/Close';

const WorkflowDetails = ({ executionFlowId, open, setOpen }) => {
    const { id } = useSelector((state) => state.workflow.data);
    const dispatch = useDispatch();
    function a11yProps(index) {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`
        };
    }
    const [value, setValue] = React.useState("1");
    const [stepDataList, setStepDataList] = React.useState({});
    const [flowData, setFlowData] = React.useState({});
    const [mapData, setMapData] = React.useState([]);
    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event, newValue) => {

        setValue(newValue);
    };

    const getViewData = async () => {
        const data = await dispatch(GetStepDetails({ ExecutionFlowID: executionFlowId }));
        setStepDataList(data?.payload?.stepWiseData);
        setFlowData(data?.payload?.flowDetailsData);
    }
    useEffect(() => {
        if (executionFlowId)
            getViewData();
    }, [executionFlowId, open, id])
    useEffect(() => {
        if (stepDataList && Object.keys(stepDataList)?.length > 0 && id) {
            for (const [k, v] of Object.entries(stepDataList)) {
                if (v?.[0]?.ShapeID === id) {
                    setValue(k);
                    break;
                }
            }
        }
    }, [stepDataList, id])
    function getDateDifference(startDate, endDate) {
        if (!startDate) {
            return `0 minutes`;
        }

        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : new Date();
        const diffMs = Math.abs(end - start);

        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

        if (days > 0) {
            return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
        } else if (hours > 0) {
            return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
        } else if (minutes > 0) {
            return `${minutes} minutes, ${seconds} seconds`;
        } else {
            return `${seconds} seconds`;
        }
    }

    const generateValuePair = (data) => {
        const list = [];
        if (data) {
            for (const [k, v] of Object.entries(data)) {
                list.push({ k, v });
            }
        }
        return list;
    }
    return (
        <Dialog fullWidth="xl" maxWidth="xl" open={stepDataList && open && id === value} onClose={handleClose}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mx={4} mt={2}>
                <Typography variant="h5">{flowData?.FlowName}</Typography>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={handleClose}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider />
            <Paper sx={{ p: 3, mx: 4, mb: 4, borderRadius: 2 }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="secondary"
                    textColor="inherit"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    {stepDataList ? Object.values(stepDataList)?.map((el, i) => (<Tab label={el[0].Name} value={el[0].ShapeID} {...a11yProps(el[0].ShapeID)} sx={{ backgroundColor: value === el[0].ShapeID ? '#2196F31F' : '#2196F314' }} />)) : ""}
                </Tabs>
                {stepDataList?.[value]?.map((el, i) => (<>
                    <Box mt={3}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box display="flex" alignItems="center">
                                    <Avatar src="https://via.placeholder.com/50" alt="Jessica Smith" sx={{ width: 50, height: 50, mr: 2 }} />
                                    <Box>
                                        <Typography variant="h6">{el?.ExecutedBy}</Typography>
                                        <Typography color="textSecondary">{el?.ExecutionStartDate ? el?.ExecutionStartDate.slice(0, 10) : 'Not Started'}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>
                                    Status: <Chip label={
                                        el?.Status} color={el?.Status === 'Pending' ? 'default' :
                                            ['Success', 'Approved', 'Approve', 'Reviewed',].includes(el?.Status) ? 'success' :
                                                ['Faild', 'Reject', 'Rejected'].includes(el?.Status) ? 'error' : 'info'}
                                        icon={<CheckCircleIcon />} />
                                </Typography>
                                <Typography fontWeight="bold">TAT: {getDateDifference(el?.ExecutionStartDate, el?.ExecutionEndDate)}</Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    <Divider sx={{ mt: 2, mb: 2 }} />
                    <Typography variant="h6" color="primary" mt={3}>{el?.Name}</Typography>
                    <Box mt={3}>
                        <Grid container spacing={2}>
                            {generateValuePair(el.Values)?.map((el) => (
                                <Grid key={el?.k} item xs={6}>
                                    <Typography variant="body2" color="textSecondary">{el?.k}</Typography>
                                    <Typography variant="h6">{el?.v}</Typography>
                                </Grid>
                            ))
                            }
                        </Grid>
                    </Box>
                </>))}
            </Paper>
        </Dialog>
    );
};

export default WorkflowDetails;
