import { useState, useEffect, lazy, Suspense, useMemo } from "react";
import {
  CssBaseline,
  Box,
  createTheme,
  ThemeProvider,
  useTheme,
  Grid,
  Fab,
  Tooltip,
  Link,
  Modal,
} from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import SideBar from "./components/sidebar/SideBar";
import NavBar from "./components/navbar/NavBar";
const Login = lazy(() => import("./components/login/Login"));
import VideoPage from "./components/allpages/videoPage/VideoPage";
import DashBoard from "./components/allpages/dashboard/DashBoard";
import MyTest from "./components/allpages/mytest/MyTest";
import Questions from "./components/allpages/questions/Questions";
import AccountOpeningForm from "./components/allpages/accountopening/AccountOpeningForm";
import AddUser from "./components/allpages/users/AddUser";
import PersonalInformation from "./components/allpages/users/PersonalInformation";
import ProfessionalInformation from "./components/allpages/users/ProfessionalInformation";
import PermissionsPasswords from "./components/allpages/users/PermissionsPasswords";
import TrainingSimulation from "./components/trainingsimulation/TrainingSimulation";
import TestSimuation from "./components/testsimuation/TestSimuation";
import SaveList from "./components/allpages/savedlist/SaveList";
import Sops from "./components/allpages/sops/Sops";
import VideoSimulation from "./components/videosimulation/VideoSimulation";
import SearchResult from "./components/allpages/searchresult/SearchResult";
import ElementFolders from "./common/folders/ElementFolders";
import NewSOPModal from "./components/modals/NewSOPModal";
import HomePage from "./components/allpages/accountopening/homePage";
import BPMN from "./components/bpmn/BPMN";
import ProfilePage from "./components/allpages/profilepage/ProfilePage";
import GenerateKey from "./components/generatekey/GenerateKey";
import Key from "./components/generatekey/Key";
import AllModalPage from "./components/allpages/masterpopups/AllModalPage";
import Newdocuments from "./components/allpages/documents/Newdocuments";
import NewTrainingSimulation from "./components/allpages/documents/NewTrainingSimulation";
import NewTestSimulation from "./components/allpages/documents/NewTestSimulation";
import AdminDashBorad from "./components/admindashborad/AdminDashBorad";
import ProcessownerDashboard from "./components/ProcessownerDashboard/dashboard/ProcessownerDashboard";
import McqTestSuccess from "./components/allpages/questions/McqTestSuccess";
import UsersManagement from "./components/allpages/users/UsersManagement";
import RoleList from "./components/allpages/users/RoleList";
import TestMCQCreation from "./components/allpages/mcqcreation/TestMCQCreation";
import Zone from "./components/allpages/users/Zone";
import Department from "./components/allpages/users/Department";
import Unit from "./components/allpages/users/Unit";
import CertificateWithAPIContent from "./components/allpages/profilepage/CertificateWithAPIContent";
import CertificateWithAPIContent2 from "./components/allpages/profilepage/CertificateWithAPIContent2";
import LicenseKeyManagement from "./components/allpages/licensekeymanagement/LicenseKeyManagement";
import SampleOne from "./components/allpages/licensekeymanagement/sample";
import EnterprisesList from "./components/allpages/users/EnterprisesList";
import { useSelector } from "react-redux";
import AdvertisementManagement from "./components/advertisement/AdvertisementManagement";
import RequestList from "./components/admindashborad/requestList";
import UserAuthLogs from "./components/allpages/reports/UserAuthLogs";
import ElementPublishLogs from "./components/allpages/reports/ElementPublishLogs";
import ElementUserAccessLogs from "./components/allpages/reports/ElementUserAccessLogs";
import ElementActivityTransition from "./components/allpages/reports/ElementActivityTransition";
import ElementProcessOwnerAccessLogs from "./components/allpages/reports/ElementProcessOwnerAccessLogs";
import MCQSimulationLogs from "./components/allpages/reports/MCQSimulationLogs";
import MCQSimulationLogDetails from "./components/allpages/reports/MCQSimulationLogDetails";
import AllTestsPage from "./components/allpages/dashboard/AllTestsPage";
import Nodata from "./common/folders/Nodata";
import ImpactAnalysis from "./components/impactAnalysis/ImpactAnalysis";
import BlukUserManagement from "./components/allpages/users/BlukUserManagement";
import ProcessOwnerMCQSimulationLogs from "./components/allpages/reports/ProcessOwnerMCQSimulationLogs";
import AllNotificationsPage from "./components/navbar/AllNotificationsPage";
import Esign from "./components/allpages/eSign";
import EsignCreation from "./components/allpages/eSign/eSignCreation";
import EsignRequestView from "./components/allpages/eSign/eSignRequestView";
import NotesPage from "./components/allpages/notespage/NotesPage";
import ColorMarkerPDF from "./components/allpages/accountopening/Colorcode";
import Setting from "./components/allpages/settings/Setting";
import SearchAi from "./components/navbar/SearchAi";
import FormSum from "./components/allpages/reports/FormSum";
import UnAccessedElement from "./components/ProcessownerDashboard/UnAccessedElement";
import RejectedElements from "./components/ProcessownerDashboard/dashboard/RejectedElements";
import BulkEmail from "./components/bulkemail/BulkEmail";
import BulkemailReports from "./components/allpages/reports/Bulkemails";
import DashBoard1 from "./components/allpages/dashboard/DashBoard1";
import Signatories from "./components/allpages/eSign/pdfViewer/components/general-components/signatories";
import BulkMCQs from "./components/allpages/mcqcreation/BulkMCQs";
import FAQSection from "./components/allpages/faqPage/FAQPage";
import FlowPage from "./components/allpages/questions/FlowPage";
import NodeToolbarExample from "./components/allpages/questions/NodeToolbarExample";
import Pageloader from "./assets/image/cubeloader1.gif";
import WorkflowList from "./components/workflow/WorkflowList";
import FLow from "./components/workflow/FLow";
import Executions from "./components/workflow/RunTheWorkFlow/RunWorkflow";
import DynamicForms from "./components/workflow/RunTheWorkFlow/DynamicForms";
import PrevDataAndDynamicForm from "./components/workflow/RunTheWorkFlow/PrevDataAndDynamicForm";
import { useTranslation } from "react-i18next";
import i18n from "./components/language/i18n";
import Myworkflow from "./components/workflow/myworkflow";
import { AutoAwesome } from "@mui/icons-material";
import Chat from "./components/chat/chat";
import Searchgpt from "./components/navbar/SearchAi";
import MindMap from "./components/impactAnalysis/MindMap";
import FlowEditor from "./components/allpages/questions/FlowEditor";
import AllAcknowledgmentsPage from "./components/allpages/dashboard/AllPendingAcknowledgments";
import GroupManagement from "./components/allpages/groupManagement/GroupManagement";
import RiskList from "./components/allpages/risk/RiskList";
import RiskCreate from "./components/allpages/risk/RiskCreate";
import FlowPageEdit from "./components/allpages/questions/FlowPageEdit";
import PropTypes from "prop-types";
import OwnerChange from "./components/ownerChange/OwnerChange";
import SignatoriesChange from "./components/allpages/accountopening/signatoriesChange/SignatoriesChange";
import SOPCreationSeteps from "./components/allpages/questions/SOPCreationSeteps";
import CreateMCQSteps from "./components/allpages/mcqcreation/CreateMCQSteps";
import DoumentReadedLogs from "./components/allpages/reports/DoumentReadedLogs";
import { useHeadingBgColor } from "./components/useHeadingBgColor";
import { AddDocumentReadingTimingApi } from "./services/elements/Elements";
import EnterPriceTree from "./components/allpages/users/EnterPriceTree";
import BPMNOnlyView from "./components/bpmn/BPMNOnlyView";
import VisioToBPMNConverter from "./components/allpages/accountopening/VisioToBPMNConverter";
import CreateDashboard from "./components/allpages/createDashboard/CreateDashboard";
import DataSource from "./components/allpages/dataSource/DataSource";
import InternalDB from "./components/allpages/dataSource/InternalDB";
import ExternalDB from "./components/allpages/dataSource/ExternalDB";
import UploadDB from "./components/allpages/dataSource/UploadeDB";
import ExternalAPI from "./components/allpages/dataSource/ExternalAPI";
import OtherSources from "./components/allpages/dataSource/OtherSources";
import EmailTemplate from "./components/allpages/commoncontainer/emailTemplate/EmailTemplate";

const AppContent = ({ setDashboardBlur, toggleDarkMode }) => {
  const { i18 } = i18n;
  const { t } = useTranslation();
  const location = useLocation();
  const isESignRequestView = location.pathname.startsWith("/e-sign-request");
  const isAuthRoute = location.pathname === "/";
  const isVideoPage = location.pathname === "/video";
  const isVideoPlayerPage = location.pathname === "/video-player";
  const isform = location.pathname.includes("/form/");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userType, setUserType] = useState(null); 
  const isLoginPage = location.pathname === "/";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fabAI, setFabAI] = useState(false);
  const { data, loading } = useSelector((state) => state.loginuser);
  const [aiMode, setAiMode] = useState(() => {
    return localStorage.getItem("aiMode") === "AIModeON";
  });
  const [prevLocation, setPrevLocation] = useState(location.pathname);
  const theme = useTheme();
  useEffect(() => {
    if (
      prevLocation.startsWith("/documents/view") &&
      !location.pathname.startsWith("/documents/view")
    ) {
      const documentViewingHistory = JSON.parse(
        localStorage.getItem("documentViewingHistory") || "[]"
      );
      if (documentViewingHistory.length > 0) {
        const latestDocument =
          documentViewingHistory[documentViewingHistory.length - 1];
        if (latestDocument) {
          const totalSeconds =
            latestDocument.timeSpentBreakdown?.totalSeconds || 0;
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;
          const days = 0;
          const readingStats = {
            DocumentID: latestDocument.documentId,
            NoOfPageRead: Array.isArray(latestDocument.pagesViewed)
              ? latestDocument.pagesViewed.length
              : 0,
            Days: days,
            Hours: hours,
            Minutes: minutes,
            Seconds: seconds,
          };
          try {
            AddDocumentReadingTimingApi(readingStats);
          } catch (error) {
            console.error("Error saving document reading time:", error);
          }
        }
      }
    }
    setPrevLocation(location.pathname);
  }, [location.pathname, prevLocation]);
  const storedsidebarData = localStorage.getItem("sidebarData");
  useEffect(() => {
    const handleStorageChange = () => {
      setAiMode(localStorage.getItem("aiMode") === "AIModeON");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  useEffect(() => {
    const storedUserType = localStorage.getItem("user_type");
    if (storedUserType) {
      setUserType(storedUserType);
    }
    if (data?.user_type) {
      setUserType(data.user_type);
      localStorage.setItem("user_type", data.user_type);
    }
  }, [data]);
  const bgColor = localStorage.getItem("orgBgColor");
  const PrivateRoute = ({ element }) => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const publicRoutes = ["/dynamic", "/form"];
    const currentPath = window.location.pathname;
    const isPublicRoute = publicRoutes.some((route) =>
      currentPath.startsWith(route)
    );
    if (isPublicRoute) {
      return element;
    }
    return isAuthenticated ? element : <Navigate to="/" />;
  };
  PrivateRoute.propTypes = {
    element: PropTypes.element.isRequired,
  };
  const handleOnClick = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    const sidebarData = localStorage.getItem("sidebarData");
    // console.log("sidebarDataInAppp:", sidebarData);
  }, []);
  useEffect(() => {
    if (location.pathname === "/sops") {
      localStorage.removeItem("moduleAction");
    }
  }, [location.pathname]);
  useEffect(() => {
    const storedsidebarData = localStorage.getItem("sidebarData");
    if (storedsidebarData) {
      try {
        const parsedData = JSON.parse(storedsidebarData);
        const hasAI = parsedData?.data?.some(
          (item) => item.ModuleName === "AI"
        );
        console.log(hasAI, "hasAI");
        setFabAI(hasAI);
      } catch (error) {
        console.error("Error parsing sidebarData:", error);
        setFabAI(false);
      }
    } else {
      setFabAI(false);
    }
  }, [storedsidebarData]);
  const sidebar = useMemo(
    () => (
      <SideBar
        setDashboardBlur={setDashboardBlur}
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
      />
    ),
    [setDashboardBlur, sidebarOpen]
  );
  const reportRoutes = () => {
    const commonRoutes = [
      {
        path: "/element-access-logs",
        element:
          userType !== "EndUser" ? (
            <ElementProcessOwnerAccessLogs />
          ) : (
            <ElementUserAccessLogs />
          ),
      },
      {
        path: "/mcq-and-simulation-logs",
        element:
          userType !== "EndUser" ? (
            <ProcessOwnerMCQSimulationLogs />
          ) : (
            <MCQSimulationLogs />
          ),
      },
      {
        path: "/mcq-and-simulation-logs/details",
        element: <MCQSimulationLogDetails />,
      },
      {
        path: "/e-sign",
        element: <Esign />,
      },
      {
        path: "/e-sign/create",
        element: <EsignCreation />,
      },
      {
        path: "/e-sign-request/:id",
        element: <EsignRequestView />,
      },
      {
        path: "/form",
        element: <ElementFolders />,
      },
    ];
    const nonEndUserRoutes =
      userType !== "EndUser"
        ? [
          {
            path: "/user-auth-logs",
            element: <UserAuthLogs />,
          },
          {
            path: "/element-publish-logs",
            element: <ElementPublishLogs />,
          },
          {
            path: "/element-activity-transition-logs",
            element: <ElementActivityTransition />,
          },
        ]
        : [];

    return [...commonRoutes, ...nonEndUserRoutes];
  };
  const hideAiIcon =
    location.pathname.startsWith("/test-mcqs/view") ||
    location.pathname.startsWith("/test-simulations/view");
  return (
    <Box
      display="flex"
      sx={{
        minHeight: "100vh",
        background:
          theme?.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.16)"
            : "#F2F4FE",
      }}
    >
      {!isLoginPage && !aiMode && (
        <>
          {/* <Link to="/ai-search">
            <Tooltip title={t("ai")} placement="top" arrow>
              <Fab
                aria-label="AI"
                onClick={handleOnClick}
                sx={{
                  position: "fixed",
                  bottom: 16,
                  right: 16,
                  zIndex: 1000,
                  backgroundColor: bgColor || "#3B82F6",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: bgColor || "#3B82F6",
                  },
                }}
              >
                <AutoAwesome />
              </Fab>
            </Tooltip>
          </Link> */}
          <Modal
            open={isModalOpen}
            onClose={handleCloseModal}
            aria-labelledby="searchgpt-modal"
            aria-describedby="searchgpt-modal-description"
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-end",
              marginTop: "13rem",
              marginRight: "2rem",
            }}
          >
            <Box
              sx={{
                minWidth: "70px",
                height: "600px",
                bgcolor: "background.paper",
                boxShadow: 24,
                borderRadius: "8px",
                marginTop: "-65px",
                padding: "1.5rem 0",
                zIndex: 1,
                overflow: "auto",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollbarWidth: "none",
              }}
            >
              <Searchgpt />
            </Box>
          </Modal>
        </>
      )}
      {!isAuthRoute &&
        !isVideoPage &&
        !isVideoPlayerPage &&
        !isESignRequestView &&
        !isform && (
          <NavBar sidebarOpen={sidebarOpen} toggleDarkMode={toggleDarkMode} />
        )}
      {!isAuthRoute &&
        !isVideoPage &&
        !isVideoPlayerPage &&
        !isESignRequestView &&
        !isform &&
        sidebar}
      <Box
        mt={isAuthRoute || isVideoPage || isVideoPlayerPage ? 0 : "70px"}
        sx={{
          flexGrow: 1,
          overflow: "auto",
        }}
      >
        <Suspense
          fallback={
            <Grid container>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                  }}
                >
                  <img src={Pageloader} alt="loader" style={{ width: "5%" }} />
                </Box>
              </Grid>
            </Grid>
          }
        >
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/video" element={<DynamicForms />} />
            <Route path="/video-player" element={<PrevDataAndDynamicForm />} />
            <Route
              path="/acknowledgments"
              element={<AllAcknowledgmentsPage />}
            />
            <Route
              path="/form/:id/:nodeId/:userid"
              element={<PrevDataAndDynamicForm />}
            />
            {userType !== undefined && userType !== null && !loading && (
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute
                    element={
                      userType === "Admin" ? (
                        <AdminDashBorad />
                      ) : userType === "EndUser" ? (
                        <DashBoard isBlurred={setDashboardBlur} />
                      ) : (
                        <ProcessownerDashboard isBlurred={setDashboardBlur} />
                      )
                    }
                  />
                }
              />
            )}
            <Route
              path="/dashboard1"
              element={<PrivateRoute element={<DashBoard1 />} />}
            />
            <Route
              path="/process-owner-dashboard"
              element={
                <PrivateRoute
                  element={
                    <ProcessownerDashboard isBlurred={setDashboardBlur} />
                  }
                />
              }
            />
            <Route path="/mytest" element={<MyTest />} />
            <Route path="/BPMNOnlyView" element={<BPMNOnlyView />} />
            <Route path="/sop-creation-steps" element={<SOPCreationSeteps />} />
            <Route
              path="/document-readed-logs"
              element={<DoumentReadedLogs />}
            />
            <Route path="/questions" element={<Questions />} />
            <Route
              path="/sop-creation"
              element={
                localStorage.getItem("moduleAction") === "Edit" ? (
                  <FlowPageEdit />
                ) : (
                  <FlowPage />
                )
              }
            />
            <Route path="/chatpage" element={<Chat />} />
            <Route path="/documents/view" element={<AccountOpeningForm />} />
            <Route
              path="/documents/view/:id"
              element={<AccountOpeningForm />}
            />
            <Route path="/addUser" element={<AddUser />} />
            <Route path="/form-submission" element={<FormSum />} />
            <Route path="/bulk-email-reports" element={<BulkemailReports />} />
            <Route
              path="/personal-information"
              element={<PersonalInformation />}
            />
            <Route
              path="/professional-information"
              element={<ProfessionalInformation />}
            />
            <Route
              path="/permissions-passwords"
              element={<PermissionsPasswords />}
            />
            {/* <Route path="/elements-expiry" element={<ElementsExpiry />} /> */}
            <Route path="/risk-management" element={<RiskList />} />
            <Route path="/risk-create" element={<RiskCreate />} />
            <Route
              path="/unaccessed-elements"
              element={<UnAccessedElement />}
            />

            <Route path="/rejected-elements" element={<RejectedElements />} />
            <Route
              path="/training-simulations/view"
              element={<TrainingSimulation />}
            />
            <Route path="/training-sim-video" element={<VideoPage />} />
            <Route path="/visio-to-bpmn" element={<VisioToBPMNConverter />} />
            <Route path="/create-dashboard" element={<CreateDashboard />} />
            <Route path="/email-template" element={<EmailTemplate />} />
            <Route path="/data-source" element={<DataSource />} />
            <Route path="/internal-db" element={<InternalDB />} />
            <Route path="/external-db" element={<ExternalDB />} />
            <Route path="/upload-file" element={<UploadDB />} />
            <Route path="/external-api" element={<ExternalAPI />} />
            <Route path="/other-sources" element={<OtherSources />} />
            <Route
              path="/training-simulations/view/:id"
              element={<TrainingSimulation />}
            />
            <Route path="/test-mcqs/view" element={<TestSimuation />} />
            <Route path="/test-mcqs/view/:id" element={<TestSimuation />} />
            <Route path="/save-list" element={<SaveList />} />
            <Route path="/sops/view" element={<Sops />} />
            <Route path="/bulk-email" element={<BulkEmail />} />
            <Route path="/sops/view/:id" element={<Sops />} />
            <Route path="/settings" element={<Setting />} />
            <Route path="/group-management" element={<GroupManagement />} />
            <Route path="/change-management" element={<OwnerChange />} />
            <Route path="/signatories-change" element={<SignatoriesChange />} />
            <Route
              path="/test-simulations/view"
              element={<VideoSimulation />}
            />
            <Route path="/notifications" element={<AllNotificationsPage />} />
            <Route
              path="/test-simulations/view/:id"
              element={<VideoSimulation />}
            />
            <Route path="/search-result" element={<SearchResult />} />
            <Route path="/Nodata" element={<Nodata />} />
            <Route path="/sops" element={<ElementFolders />} />
            <Route path="/colorcode" element={<ColorMarkerPDF />} />
            <Route path="/documents" element={<ElementFolders />} />
            <Route path="/training-simulations" element={<ElementFolders />} />
            <Route path="/test-simulations" element={<ElementFolders />} />
            <Route path="/test-mcqs" element={<ElementFolders />} />
            <Route path="/NewSOPModal" element={<NewSOPModal />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/bpmn" element={<BPMN />} />
            <Route path="/Signatories" element={<Signatories />} />
            <Route path="/floweditor" element={<FlowEditor />} />
            <Route path="/profilepage" element={<ProfilePage />} />
            <Route path="/generatekey" element={<GenerateKey />} />
            <Route path="/enterprisetree" element={<EnterPriceTree />} />

            <Route path="/key" element={<Key />} />
            <Route path="/allmodal" element={<AllModalPage />} />
            <Route path="/Newdocuments" element={<Newdocuments />} />
            <Route path="/notespage" element={<NotesPage />} />
            <Route path="/ai-search" element={<SearchAi />} />
            <Route
              path="/NewTrainingSimulation"
              element={<NewTrainingSimulation />}
            />
            <Route path="/all-tests" element={<AllTestsPage />} />
            <Route path="/NewTestSimulation" element={<NewTestSimulation />} />
            <Route path="/mcqtestresult" element={<McqTestSuccess />} />
            <Route path="/user-management" element={<UsersManagement />} />
            <Route path="/role" element={<RoleList />} />
            <Route path="/zone" element={<Zone />} />
            <Route path="/unit" element={<Unit />} />
            <Route path="/faqpage" element={<FAQSection />} />
            <Route path="/flowpagetwo" element={<NodeToolbarExample />} />
            <Route path="/enterprises" element={<EnterprisesList />} />
            <Route
              path="/bulk-user-management"
              element={<BlukUserManagement />}
            />
            <Route
              path="/advertisement-management"
              element={<AdvertisementManagement />}
            />
            <Route path="/department" element={<Department />} />
            <Route path="/mindmap" element={<MindMap />} />
            <Route path="/my-request" element={<RequestList />} />
            <Route path="/unit" element={<Unit />} />
            <Route
              path="/certificate"
              element={<CertificateWithAPIContent />}
            />
            <Route
              path="/certificate2"
              element={<CertificateWithAPIContent2 />}
            />
            <Route path="/license-key" element={<LicenseKeyManagement />} />
            <Route path="/sampleone" element={<SampleOne />} />
            <Route path="/impact-analysis" element={<ImpactAnalysis />} />
            <Route path="/bulk-mcqs" element={<BulkMCQs />} />
            <Route path="/TestMCQCreation" element={<TestMCQCreation />} />
            <Route path="/create-mcq-steps" element={<CreateMCQSteps />} />
            <Route path="/flow" element={<WorkflowList />} />
            <Route path="/run/:id" element={<Executions />} />
            <Route path="/workflow-creation/:id" element={<FLow />} />
            <Route path="/my-work-flow" element={<Myworkflow />} />
            {reportRoutes().map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
        </Suspense>
      </Box>
    </Box>
  );
};

function App() {
  const [setDashboardBlur] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const IsdarkMode = localStorage.getItem("darkMode") === "true";
  // const { t } = useTranslation();
  const bgColor = useHeadingBgColor();

  const getDeviceType = (width) => {
    if (width < 768) {
      return "Phone";
    } else if (width >= 768 && width < 1024) {
      return "Tablet";
    } else {
      return "Laptop";
    }
  };

  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      const type = getDeviceType(width);
      localStorage.setItem("deviceType", type);
    };
    updateDeviceType();
    window.addEventListener("resize", updateDeviceType);
    return () => {
      window.removeEventListener("resize", updateDeviceType);
    };
  }, []);

  const Theme = createTheme({
    palette: {
      mode: IsdarkMode ? "dark" : "light",
      primary: {
        main: bgColor || "#2566e8",
      },
      secondary: {
        main: "#f48fb1",
      },
      background: {
        default: darkMode ? "#121212" : "#ffffff",
      },

      text: {
        color: "#ffffff",
      },
      border: {
        color: bgColor || "#2566e8",
      },


      shadows: [
        "none",
        "0px 4px 6px rgba(0, 0, 0, 0.1)",
        "0px 6px 12px rgba(0, 0, 0, 0.2)",
      ],
    },
    typography: {
      fontFamily: ["Inter"].join(","),
      poster: {
        fontFamily: "var(--font-family)",
        fontSize: "16px",
        fontWeight: "400",
        lineHeight: "24px",
        letterSpacing: "0.1em",
      },
      subtitle1: {
        fontFamily: "var(--font-family)",
        fontSize: "16px",
        fontWeight: "400",
        lineHeight: "24px",
        letterSpacing: "0.1em",
        marginBottom: "0.2rem",
      },
      subtitle2: {
        fontFamily: "var(--font-family)",
        fontSize: "16px",
        fontWeight: "600",
        lineHeight: "24px",
        letterSpacing: "0.1em",
      },
      h1: {
        color: "#000",
        fontFamily: "var(--font-family)",
        fontSize: "64px",
        fontWeight: "700",
        lineHeight: "144px",
      },
      h2: {
        fontFamily: "var(--font-family)",
        fontSize: "64px",
        fontWeight: "600",
        lineHeight: "normal",
      },
      h3: {
        fontFamily: "var(--font-family)",
        fontSize: "36px",
        fontWeight: "800",
        lineHeight: "54px",
      },
      h6: {
        fontFamily: "Inter",
        fontSize: "20px",
        fontWeight: "600",
        lineHeight: "28px",
        textAlign: "left",
        textUnderlinePosition: "from-font",
        textDecorationSkipInk: "none",
      },
      h5: {
        fontFamily: "Inter",
        fontSize: "24px",
        fontWeight: "600",
        lineHeight: "29.05px",
        textAlign: "left",
        textUnderlinePosition: "from-font",
        textDecorationSkipInk: "none",
      },
      h7: {
        fontFamily: "Inter",
        fontSize: "18px",
        fontWeight: "600",
        lineHeight: "24.3px",
        textAlign: "left",
        textUnderlinePosition: "from-font",
        textDecorationSkipInk: "none",
      },
      h8: {
        fontFamily: "Inter",
        fontSize: "14px",
        fontWeight: "500",
        lineHeight: "27.3px",
        textDecorationSkipInk: "none",
      },

      body1: {
        fontSize: "16px",
        // fontWeight: "700",
        lineHeight: "21.52px",
        letterSpacing: "-0.02em",
        textTransform: "capitalize",
        fontFamily: "Inter",
        marginBottom: "0.5rem",
      },
      caption: {
        fontFamily: "Inter",
        fontSize: "12px",
        fontWeight: "600",
        lineHeight: "14.52px",
        letterSpacing: "-0.02em",
        textAlign: "left",
        // textTransform: "capitalize",
      },
      caption1: {
        fontFamily: "Inter",
        fontSize: "14px",
        fontWeight: "400",
        lineHeight: "normal",
        letterSpacing: "-0.02em",
        textAlign: "left",
      },
    },
    components: {
      MuiPaginationItem: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            color: bgColor,
            "&.Mui-selected": {
              color: "#ffffff", // ✅ Force white text
              backgroundColor: bgColor, // or use your bgColor variable
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: bgColor, // optional hover effect
                color: "#ffffff",
              },
            },
          },
        },
      },

      MuiFormControlLabel: {
        "& .MuiFormControlLabel-label": {
          fontSize: "12px",
        },
        styleOverrides: {
          root: {
            marginBottom: "0px", // Removes bottom margin for the root container
          },
          label: {
            marginBottom: "0px", // Removes bottom margin for the label part
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            background: (theme) => theme.palette.background.default, // Return the value
            borderRadius: "8px",
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "capitalize",
            borderRadius: "8px",
          },
          contained: {
            backgroundColor: (theme) => theme.palette.primary.main,
            color: "#ffffff",
            boxShadow: "none",
            textTransform: "none",

            "&:hover": {
              backgroundColor: (theme) => `${theme.palette.primary.main}CC`, // ~80% opacity
              boxShadow: "none",
            },
            "&:disabled": {
              backgroundColor: "gray", // ~80% opacity
            },
          },
          outlined: {
            borderRadius: "8px",
            border: (theme) => `2px solid ${theme.palette.primary.main}`,
            color: `${(theme) => theme.palette.primary.main} !import`,
            textTransform: "none",

            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: (theme) => `${theme.palette.primary.main}CC`, // fallback
            },
          },
          text: {
            textTransform: "none",
            color: (theme) => theme.palette.primary.main,
            "&:hover": {
              backgroundColor: (theme) => `${theme.palette.primary.main}CC`, // ~80% opacity
            },
          },
        },
      },
      MuiBadge: {
        styleOverrides: {
          badge: {
            backgroundColor: (theme) => theme.palette.primary.main,
            color: "#fff",
            fontSize: "0.75rem",
            fontWeight: 600,
            minWidth: "20px",
            height: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          },
        },
      },

      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "capitalize",
          },
        },
      },
    },
  });

  const toggleDarkMode = () => {
    localStorage.setItem("darkMode", !darkMode);
    setDarkMode((prevMode) => !prevMode);
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "light" : "dark"
    );
  };

  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <div className="screenshot-blocker" />
      <Router>
        <Box>
          <AppContent
            setDashboardBlur={setDashboardBlur}
            toggleDarkMode={toggleDarkMode}
          />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;

AppContent.propTypes = {
  setDashboardBlur: PropTypes.func.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
};
