import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Button } from "@mui/material";
import tworing from "../../assets/svg/sopsinside/tworing.svg";
import sopIcon from "../../assets/svg/sopsinside/sop.svg";
import documents from "../../assets/svg/sopsinside/documents.svg";
import trainingsimulation from "../../assets/svg/sopsinside/trainingsimulation.svg";
import testsimulation from "../../assets/svg/sopsinside/testsimulation.svg";
import Dashborad_trs from "../../assets/image/dashborad/Dashborad_mcq.svg";
import { viewImpactAnalysis } from "../../services/impactAnalysis/ImpactAnalysis";
import { useSelector, useDispatch } from "react-redux";
import { impactAnalysis } from "../../store/impactAnalysis/ImpactAnalysis";
import notify from "../../assets/svg/utils/toast/Toast";
import RiskIcon from "../../assets/image/accountOpening/risk.svg";
import ComplianceIcon from "../../assets/image/accountOpening/com.svg";
import { GetListRiskAndCompliences } from "../../store/riskandCompliences/action";
import RiskAndComplianceModal from "./RiskAndComplianceModal";
import RiskAndComplianceModalTwo from "./RiskAndComplianceModalTwo";
import cicon from "../../assets/svg/BPMN/cicon.svg";
import Roles from "../../assets/svg/impactanalysis/Roles.svg";
import Department from "../../assets/svg/impactanalysis/Department.svg";
import Stackholder from "../../assets/svg/impactanalysis/Stackholder.svg";
import Auditor from "../../assets/svg/impactanalysis/Auditor.svg";
import signature from "../../assets/svg/impactanalysis/Signature.svg";
import { ArrowBack, FirstPage } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

const styles = {
  container: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    margin: "20px 120px 20px 0",
  },
  centerCircle: {
    backgroundColor: "#3B82F6",
    color: "white",
    width: "225px",
    height: "225px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    borderRadius: "50%",
    cursor: "pointer",
    border: "4px solid #E2EDFF",
    position: "relative",
    zIndex: 1,
    marginLeft: "5.5rem",
    marginBottom: "3rem",
  },
  blueItem: {
    backgroundColor: "#FFFFFF",
    padding: "5px",
    color: "#000",
    minWidth: "150px",
    height: "60px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    borderRadius: "12px",
    cursor: "pointer",
    position: "absolute",
    border: "4px solid",
    fontSize: "14px",
    zIndex: 1,
    marginTop: "-3.3rem",
    marginLeft: "-3rem",
  },
  modalItem: {
    position: "absolute",
    backgroundColor: "#fff",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    minWidth: "120px",
    textAlign: "center",
    cursor: "pointer",
  },
  iconContainer: {
    display: "inline-flex",
    marginLeft: "6px",
    gap: "6px",
  },
  icon: {
    width: "20px",
    height: "20px",
    cursor: "pointer",
  },
};

const payloadMapping = {
  Documents: "Document",
  "Training Simulation": "TrainingSimulation",
  "Test Simulation": "TestSimulation",
  "Test MCQs": "TestMCQ",
  SOP: "SOP",
  Departments: "Department",
  Roles: "Role",
  Auditors: "Auditor",
  "Stake Holders": "StakeHolder",
  Signatories: "UserSignature",
};

const ImpactAnalysis = () => {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const errorNotified = useRef(false);
  const hasFetched = useRef(false);
  const impactAnalysisPersistData = useSelector(
    (state) => state?.impactAnalysis?.state || {}
  );
  const { RiskAndCompliences } = useSelector(
    (state) => state.RiskAndCompliences
  );
  const [initialImpactAnalysisData, setInitialImpactAnalysisData] =
    useState(null);
  const [isFetchingImpactAnalysis, setIsFetchingImpactAnalysis] =
    useState(false);
  const [impactAnalysisData, setImpactAnalysisData] = useState(null);

  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [showRiskAndComplianceModal, setShowRiskAndComplianceModal] =
    useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [showRiskAndComplianceModalTwo, setShowRiskAndComplianceModalTwo] =
    useState(false);

  const [totalRiskCount, setTotalRiskCount] = useState(0);
  const [totalComplianceCount, setTotalComplianceCount] = useState(0);
  const [totalClauseCount, setTotalClauseCount] = useState(0);
  const [SOPID, setSOPID] = useState(null);
  const [sideClicked, setSideClicked] = useState("");
  const { t } = useTranslation();

  const modalRef = useRef(null);
  const [blueCenter, setBlueCenter] = useState(null);
  const blueItemRefs = useRef({});

  // NEW: local state for opening the "Large Sub-Items" modal
  const [showLargeSubItemsModal, setShowLargeSubItemsModal] = useState(false);
  const [largeSubItems, setLargeSubItems] = useState([]);
  const [largeSubItemsLabel, setLargeSubItemsLabel] = useState("");
  const impactAnalysisDatas = useSelector(
    (state) => state.impactAnalysis.state
  );
  const [storedData, setStoredData] = useState({
    ModuleID: null,
    ImpactAnalysisTarget: null,
  });

  const hasStoredData = useRef(false);
  useEffect(() => {
    console.log("Impact Analysis Data:", impactAnalysisDatas);
  }, [impactAnalysisDatas]);

  useEffect(() => {
    if (
      !hasStoredData.current &&
      impactAnalysisDatas?.ModuleID &&
      impactAnalysisDatas?.ImpactAnalysisTarget
    ) {
      // Store the first received values only
      setStoredData({
        ModuleID: impactAnalysisDatas.ModuleID,
        ImpactAnalysisTarget: impactAnalysisDatas.ImpactAnalysisTarget,
      });
      hasStoredData.current = true; // Mark as stored
    }
  }, [impactAnalysisDatas]);

  useEffect(() => {
    return () => {
      // Clear stored values when leaving the page
      setStoredData({ ModuleID: null, ImpactAnalysisTarget: null });
      hasStoredData.current = false; // Reset for next visit
    };
  }, []);

  const storedPayload = localStorage.getItem("impactAnalysisPayload");
  if (storedPayload) {
    console.log(JSON.parse(storedPayload));
  } else {
    console.log("No impactAnalysisPayload found in localStorage");
  }

  // Log the stored data to console
  useEffect(() => {
    console.log(
      "Stored First-Time ModuleID & ImpactAnalysisTarget:",
      storedData
    );
  }, [storedData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setSelectedItem(null);
        setBlueCenter(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchImpactAnalysis = async (data) => {
    errorNotified.current = false;
    setIsFetchingImpactAnalysis(true);
    try {
      const response = await viewImpactAnalysis(data);
      if (response?.status === 200) {
        const responseData = response?.data?.data;
        const { doc, trs, tes, mcq, sop } = responseData?.attachedLinks || {};
        const departments = responseData?.assignedDepartments || [];
        const roles = responseData?.assignedRoles || [];
        const Auditors = responseData?.uniqueAuditors || [];
        const stakeHolders = responseData?.stakeHolders || [];
        const sigatureUsers = responseData?.sigatureUsers || [];
        const { NoOfRisk, NoOfCompliance, NoOfClause } =
          responseData?.riskAndComplience || {};

        const modifiedData = {
          doc,
          trs,
          tes,
          mcq,
          sop,
          departments,
          roles,
          Auditors,
          stakeHolders,
          sigatureUsers,
        };

        // Summation logic for doc risk etc.
        let riskCounts = 0;
        let complianceCounts = 0;
        let clauseCounts = 0;
        doc?.forEach((item) => {
          riskCounts += item?.RiskAndComplience?.NoOfRisk || 0;
          complianceCounts += item?.RiskAndComplience?.NoOfCompliance || 0;
          clauseCounts += item?.RiskAndComplience?.NoOfClause || 0;
        });

        setTotalRiskCount(riskCounts);
        setTotalComplianceCount(complianceCounts);
        setTotalClauseCount(clauseCounts);

        const riskCount = NoOfRisk || 0;
        const complianceCount = NoOfCompliance || 0;
        const clauseCount = NoOfClause || 0;

        const keys = Object.keys(modifiedData);

        const result = keys.map((key, index) => {
          const label =
            key === "doc"
              ? "Documents"
              : key === "trs"
              ? "Training Simulation"
              : key === "tes"
              ? "Test Simulation"
              : key === "mcq"
              ? "Test MCQs"
              : key === "sop"
              ? "SOP"
              : key === "departments"
              ? "Departments"
              : key === "roles"
              ? "Roles"
              : key === "Auditors"
              ? "Auditors"
              : key === "stakeHolders"
              ? "Stake Holders"
              : key === "sigatureUsers"
              ? `Signatories`
              : "";

          const color =
            key === "doc"
              ? "#875FC0"
              : key === "trs"
              ? "#FFB72B"
              : key === "tes"
              ? "#46C5F2"
              : key === "mcq"
              ? "#3D54CD"
              : key === "sop"
              ? "#EB4887"
              : key === "departments"
              ? "#E11D48"
              : key === "roles"
              ? "#004D40"
              : key === "Auditors"
              ? "#16A34A"
              : key === "stakeHolders"
              ? "#F57F17"
              : key === "sigatureUsers"
              ? "#0891B2"
              : "";

          const subItems = modifiedData[key]?.map((item) => {
            if (
              key === "doc" ||
              key === "trs" ||
              key === "tes" ||
              key === "mcq" ||
              key === "sop"
            ) {
              return {
                label: item?.ContentLinkTitle || item?.name,
                value: item?.ContentLink || item?.id,
              };
            } else if (key === "departments") {
              return {
                label: item?.DepartmentName,
                value: item?.DepartmentID,
              };
            } else if (key === "roles") {
              return {
                label: item?.RoleName,
                value: item?.RoleID,
              };
            } else if (
              key === "Auditors" ||
              key === "stakeHolders" ||
              key === "sigatureUsers"
            ) {
              return {
                label: `${item?.UserFirstName} ${item?.UserMiddleName} ${item?.UserLastName}`,
                value: item?.UserID,
              };
            }
            return null;
          });

          return {
            id: index + 1,
            label,
            color,
            subItems,
            icon:
              key === "doc"
                ? documents
                : key === "trs"
                ? trainingsimulation
                : key === "tes"
                ? testsimulation
                : key === "mcq"
                ? Dashborad_trs
                : key === "sop"
                ? sopIcon
                : key === "departments"
                ? Department
                : key === "roles"
                ? Roles
                : key === "Auditors"
                ? Auditor
                : key === "stakeHolders"
                ? Stackholder
                : key === "sigatureUsers"
                ? signature
                : "",
          };
        });

        // Add Risk/Compliance/Clause
        if (riskCount > 0) {
          result.push({
            id: result.length + 1,
            label: "Risks",
            color: "rgb(59, 130, 246)",
            subItems: [{ label: `Risks: ${riskCount}`, value: riskCount }],
            icon: RiskIcon,
          });
        }
        if (complianceCount > 0) {
          result.push({
            id: result.length + 2,
            label: "Compliances",
            color: "rgb(59, 130, 246)",
            subItems: [
              {
                label: `Compliances: ${complianceCount}`,
                value: complianceCount,
              },
            ],
            icon: ComplianceIcon,
          });
        }
        if (clauseCount > 0) {
          result.push({
            id: result.length + 3,
            label: "Clauses",
            color: "rgb(59, 130, 246)",
            subItems: [
              { label: `Clauses: ${clauseCount}`, value: clauseCount },
            ],
            icon: cicon,
          });
        }

        setImpactAnalysisData(result);
      }
    } catch (error) {
      setImpactAnalysisData([]);
      if (!errorNotified.current) {
        notify(
          "error",
          error?.response?.data || "Something went wrong!"
        );
        errorNotified.current = true;
      }
      return navigation(-1);
    } finally {
      setIsFetchingImpactAnalysis(false);
      hasFetched.current = false;
      errorNotified.current = false;
    }
  };

  useEffect(() => {
    const fetchImpactAnalysis = async () => {
      try {
        const response = await viewImpactAnalysis();
        if (response?.status === 200) {
          // Set initial data only once
          // const processedData = processData(response.data);
          // setImpactAnalysisData(processedData);
          // setInitialImpactAnalysisData(processedData);
        }
      } catch (error) {
        console.error("Error fetching impact analysis data:", error);
      }
    };

    fetchImpactAnalysis();
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      const { ModuleID = null, ImpactAnalysisTarget = null } =
        impactAnalysisPersistData;
      if (ModuleID && ImpactAnalysisTarget) {
        fetchImpactAnalysis({ ModuleID, ImpactAnalysisTarget });
        setSOPID(ModuleID);
      } else {
        if (!errorNotified.current) {
          notify(
            "error",
            "Element is not selected! Please select an element to view Impact Analysis."
          );
          errorNotified.current = true;
        }
        return navigation(-1);
      }
    }
  }, [impactAnalysisPersistData]);

  // useEffect(() => {
  //   if (SOPID) {
  //     dispatch(GetListRiskAndCompliences({ SOPID }));
  //   }
  // }, [SOPID, dispatch]);

  const handleModalClick = (item) => {
    if (item?.subItems?.length > 0) {
      setLargeSubItems(item.subItems);
      setLargeSubItemsLabel(item.label);
      setShowLargeSubItemsModal(true);
      return;
    }
    setSelectedItem({
      id: item?.id,
      label: item?.label,
      subItems: item?.subItems,
      color: item?.color,
    });
    setShowModal(item.id);
    const blueEl = blueItemRefs.current[item.id];
    if (blueEl) {
      const rect = blueEl.getBoundingClientRect();
      setBlueCenter({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
  };

  const handleBackClick = () => {
    const storedPayloadStr = localStorage.getItem("impactAnalysisPayload");
    if (storedPayloadStr) {
      try {
        const storedPayload = JSON.parse(storedPayloadStr);
        dispatch(impactAnalysis(storedPayload));
        console.log("Dispatched stored payload:", storedPayload);
      } catch (error) {
        console.error("Failed to parse stored payload", error);
      }
    } else {
      console.log("No stored impactAnalysisPayload found");
    }

    // Reset your state/UI as before
    setImpactAnalysisData(initialImpactAnalysisData);
    setSelectedItem(null);
    setShowLargeSubItemsModal(false);
  };

  const handleSubItemClick = (payload) => {
    const { ImpactAnalysisTarget, ModuleID } = payload;
    let idType = "";
    switch (ImpactAnalysisTarget) {
      case "Department":
        idType = "DepartmentID";
        break;
      case "Role":
        idType = "RoleID";
        break;
      case "Auditor":
        idType = "AuditorID";
        break;
      case "StakeHolder":
        idType = "StakeHolderID";
        break;
      case "UserSignature":
        idType = "UserSignatureID";
        break;
      default:
        idType = null;
    }
    if (idType) {
      dispatch(GetListRiskAndCompliences({ [idType]: ModuleID }));
    }
    hasFetched.current = false;
    dispatch(impactAnalysis(payload));
    setShowModal(null);
    setSelectedItem(null);
    setBlueCenter(null);
  };

  if (isFetchingImpactAnalysis) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <p style={{ marginTop: "20px", color: "#3B82F6", fontSize: "18px" }}>
          Fetching {impactAnalysisPersistData?.name} ...
        </p>
      </Box>
    );
  }

  const totalSubItemsLength = impactAnalysisData?.reduce(
    (total, item) => total + (item.subItems?.length || 0),
    0
  );

  const handleIconClick = (heading) => {
    console.log(
      heading === "Risks",
      heading === "Compliances",
      heading === "Clauses",
      "heading"
    );
    if (
      heading === "Risks" ||
      heading === "Compliances" ||
      heading === "Clauses"
    ) {
      setModalHeading(heading);
      setShowRiskAndComplianceModalTwo(true);
    } else {
      setModalHeading(heading);
      setShowRiskAndComplianceModal(true);
    }
  };

  const displayedItems =
    impactAnalysisData?.filter((item) => {
      const isRiskOrCompliance =
        item.label === "Risks" ||
        item.label === "Compliances" ||
        item.label === "Clauses";
      const value = item.subItems[0]?.value;
      if (isRiskOrCompliance && (value === 0 || value === undefined)) {
        return false;
      }
      return item?.subItems?.length > 0;
    }) || [];
  const circleRadius = 250;
  const blueAngleIncrement = (2 * Math.PI) / displayedItems.length;
  const handleClick = (event) => {
    const centerX = window.innerWidth / 2;
    const clickX = event.clientX;
    if (clickX < centerX) {
      setSideClicked("left");
    } else {
      setSideClicked("right");
    }
  };

  return (
    <div style={styles.container} onClick={handleClick}>
      <Box
        sx={{
          position: "absolute",
          top: "20px",
          left: "20px",
          display: "flex",
          gap: "10px",
        }}
      >
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => {
            navigation(-1);
          }}
          sx={{
            textTransform: "none",
            fontSize: "14px",
            padding: "8px 16px",
            borderRadius: "4px",
          }}
        >
          {t("back")}
        </Button>
        <Button
          variant="contained"
          startIcon={<FirstPage />}
          onClick={handleBackClick}
          sx={{
            textTransform: "none",
            fontSize: "14px",
            padding: "8px 16px",
            borderRadius: "4px",
          }}
        >
          {t("goToFirstStage")}
        </Button>
      </Box>
      <motion.div
        key={totalSubItemsLength}
        style={styles.centerCircle}
        onClick={() => {
          console.log(
            "ImpactAnalysisTarget:",
            impactAnalysisPersistData?.ImpactAnalysisTarget
          );
          console.log("Name:", impactAnalysisPersistData?.name);
          console.log("Total SubItems Length:", totalSubItemsLength || 0);
        }}
        initial={{ x: "-100vw" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        ({impactAnalysisPersistData?.ImpactAnalysisTarget})<br />
        {impactAnalysisPersistData?.name} <br />({totalSubItemsLength || 0})
      </motion.div>

      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {displayedItems.map((item, index) => {
          const angle = index * blueAngleIncrement;
          const x = circleRadius * Math.cos(angle);
          const y = circleRadius * Math.sin(angle);
          const x2 = 53 + (x / window.innerWidth) * 100;
          const y2 = 47 + (y / window.innerHeight) * 100;
          return (
            <line
              key={`line-${item.id}`}
              x1="53%"
              y1="47%"
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="#7D92AE"
              strokeWidth="2"
            />
          );
        })}
      </svg>

      {/* Render each Blue item */}
      {displayedItems.map((item, index) => {
        const isRiskOrCompliance =
          item.label === "Risks" ||
          item.label === "Compliances" ||
          item.label === "Clauses";
        const value = item.subItems[0]?.value;
        const angle = index * blueAngleIncrement;
        const x = circleRadius * Math.cos(angle);
        const y = circleRadius * Math.sin(angle);

        return (
          <React.Fragment key={item.id}>
            <motion.div
              ref={(el) => (blueItemRefs.current[item.id] = el)}
              style={{
                ...styles.blueItem,
                top: `calc(50% + ${y}px)`,
                left: `calc(50% + ${x}px)`,
                transform: "translate(-50%, -50%)",
                borderColor: item.color,
                cursor: "pointer",
                zIndex: 9999,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
              onClick={() => {
                if (isRiskOrCompliance) {
                  handleIconClick(item.label);
                } else {
                  handleModalClick(item);
                }
              }}
            >
              {item?.icon && (
                <img
                  src={item.icon}
                  alt={`${item.label} icon`}
                  style={{ marginRight: "8px", width: "30px", height: "30px" }}
                />
              )}
              {item?.label}
              {isRiskOrCompliance
                ? value !== 0 && value !== undefined && ` (${value})`
                : ` (${item.subItems.length})`}
            </motion.div>
          </React.Fragment>
        );
      })}

      {/* Show sub-items around a Blue item only if <= 10 */}
      {selectedItem && blueCenter && selectedItem.subItems.length <= 0 && (
        <div
          ref={modalRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            {selectedItem.subItems.map((subItem, idx, arr) => {
              const offsetX = 150;
              const offsetY = (idx - (arr.length - 1) / 2) * 50;
              const subX =
                sideClicked === "left"
                  ? blueCenter.x - offsetX
                  : blueCenter.x + offsetX;
              const subY = blueCenter.y + offsetY;

              return (
                <line
                  key={`connector-${idx}`}
                  x1={blueCenter.x}
                  y1={blueCenter.y}
                  x2={sideClicked === "right" ? subX : subX - 100}
                  y2={subY}
                  stroke="#7D92AE"
                  strokeWidth="2"
                />
              );
            })}
          </svg>

          {selectedItem.subItems.map((subItem, idx, arr) => {
            const offsetX = sideClicked === "left" ? 400 : 100;
            const offsetY = (idx - (arr.length - 1) / 2) * 50;
            const subX =
              sideClicked === "left"
                ? blueCenter.x - offsetX
                : blueCenter.x + offsetX;
            const subY = blueCenter.y + offsetY;

            return (
              <div
                key={`subitem-${idx}`}
                onClick={() =>
                  handleSubItemClick({
                    ImpactAnalysisTarget: payloadMapping[selectedItem?.label],
                    ModuleID: subItem?.value,
                    name: subItem?.label,
                  })
                }
                style={{
                  position: "absolute",
                  left: sideClicked === "right" ? subX + 15 : subX - 130,
                  top: subY - 20,
                  pointerEvents: "auto",
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  minWidth: "100px",
                  marginLeft: "4rem",
                }}
              >
                {subItem?.label}
                <img
                  src={tworing}
                  alt=""
                  style={{ marginLeft: "8px", width: "20px", height: "20px" }}
                />
              </div>
            );
          })}
        </div>
      )}

      {showLargeSubItemsModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => setShowLargeSubItemsModal(false)} 
        >
        
          <div
            style={{
              backgroundColor: "#f5f5f5",
              borderRadius: "12px",
              width: "500px",
              maxHeight: "80vh",
              overflowY: "auto",
              padding: "20px",
              position: "relative",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e0e0e0",
            }}
            onClick={(e) => e.stopPropagation()} 
          >
            <h4
              style={{
                marginTop: 0,
                color: "#333",
                fontSize: "1.2rem",
                fontWeight: "600",
              }}
            >
              {largeSubItemsLabel}
            </h4>
            <button
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                fontSize: "1.2rem",
                cursor: "pointer",
                color: "#666",
                transition: "color 0.2s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#333")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#666")}
              onClick={() => setShowLargeSubItemsModal(false)}
            >
              ✕
            </button>

            {/* List all sub-items */}
            {largeSubItems.map((subItem, idx) => (
              <div
                key={`large-subitem-${idx}`}
                onClick={() => {
                  handleSubItemClick({
                    ImpactAnalysisTarget: payloadMapping[largeSubItemsLabel],
                    ModuleID: subItem.value,
                    name: subItem.label,
                  });
                  setShowLargeSubItemsModal(false);
                }}
                style={{
                  margin: "8px 0",
                  padding: "10px 12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#fff",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#f9f9f9";
                  e.currentTarget.style.boxShadow =
                    "0 4px 8px rgba(0, 0, 0, 0.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#fff";
                  e.currentTarget.style.boxShadow =
                    "0 2px 4px rgba(0, 0, 0, 0.05)";
                }}
              >
                <span
                  style={{ color: "#444", fontSize: "1rem", fontWeight: "500" }}
                >
                  {subItem.label}
                </span>
                <img
                  src={tworing}
                  alt=""
                  style={{
                    marginLeft: "8px",
                    width: "20px",
                    height: "20px",
                    opacity: "0.8",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <RiskAndComplianceModal
        open={showRiskAndComplianceModal}
        onClose={() => setShowRiskAndComplianceModal(false)}
        heading={modalHeading}
        RiskAndCompliences={RiskAndCompliences}
      />
      <RiskAndComplianceModalTwo
        open={showRiskAndComplianceModalTwo}
        onClose={() => setShowRiskAndComplianceModalTwo(false)}
        heading={modalHeading}
        RiskAndCompliences={RiskAndCompliences}
      />
    </div>
  );
};

export default ImpactAnalysis;
