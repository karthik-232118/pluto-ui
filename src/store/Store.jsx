import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import sopsReducer from "./sops/slice";
import elementReducer from "./elements/slice";
import mcqsReducer from "./mcqs/slice";
import searchReducer from "./search/slice";
import mcqEndTestReducer from "./mcqendtest/slice";
import moduleReducer from "./moduleid/slice";
import userReducer from "./user/slice";
import favouritesReducer from "./favourites/slice";
import attemptsReducer from "./attempts/silce";
import dashboardReducer from "./dashboard/slice";
import enterpriseReducer from "./enterprise/slice";
import getalluserReducer from "./usermanagement/slice";
import mcqcreationlistReducer from "./mcqcreationlist/slice";
import keygenrerationReducer from "./keygenreration/slice";
import downloadReducer from "./downloadpdf/downloadReducer";
import licensekeydetailsReducer from "./licensekeymanagement/slice";
import testReducer from "./mcqtestslice/testSlice";
import authReducer from "./login/slice";
import advertisementReducer from "./Advertisement/slice";
import detailsReducer from "./details/slice";
import activityReducer from "./activitysidebar/slice";
import sopReducer from "./sopid/Slice";
import SubsidedataReducer from "./subsidebardata/silce";
import ImpactAnalysisReducer from "./impactAnalysis/ImpactAnalysis";
import idsReducer from "./favIds/slice";
import dashboardElementIdReducer from "./dashboardelementID/slice";
import myRequestReducer from "./myrequest/slice";
import notificationReducer from "./notification/slice";
import linkedDataReducer from "./notificationLinkedIDandName/slice";
// import socketReducer from "./socket/slice";
import notesReducer from "./notes/slice";
import chatReducer from "./chat/slice";
import ListRiskAndCompliencesReducer from "./riskandCompliences/slice";
import certificateReducer from "./certificate/silce";
import esingReducer from "./eSign/slice";
import testIDReducer from "./testmcqid/slice";
import selectedIdReducer from "./SearchSelectID/setSelectedId";
import testMcqReducer from "./BulkMCQS/testMcqSlice";
// import clipReducer from "./clip/clipSlice";
// import rolesReducer from "./rolesSlice/rolesSlice";
// import imageReducer from "./imageSlice/imageSlice";
import workflowReducer from "./flow/slice";
import flowWithSop from "./FlowWithSOP/flowWithSop";
import SOPReactFlowReducer from "./SOPReactFlow/slice";
import SOPflowModalReducer from "./SOPflowModal/SOPflowModal";
// import attachmentsReducer from "./attachmentsSlice/attachmentsSlice";
// import selectedNodeReducer from "./selectedNode/selectedNodeSlice";
import docOneReducer from "./docOne/slice";
import docTwoReducer from "./docTwo/slice";
// other imports...
import movefileReducer from "./moveFile/slice";

import forntendStateReducer from "./presist/action";
import actionReducer from "./ActionableData/actionSlice";
import dashboardActionsReducer from "./dashboardActions/slice";
import docxTemplateReducer from "./Docxtemplate/slice";

const persistConfig = {
  key: "sidebarstate",
  storage,
};

const impactAnalysisPersistStoreConfig = {
  key: "impactAnalysis",
  storage,
};

const persistedReducer = persistReducer(persistConfig, forntendStateReducer);
const impactAnalysisReducer = persistReducer(
  impactAnalysisPersistStoreConfig,
  ImpactAnalysisReducer
);

const store = configureStore({
  reducer: {
    sops: sopsReducer,
    elements: elementReducer,
    sidebarstate: persistedReducer,
    impactAnalysis: impactAnalysisReducer,
    mcqEndTest: mcqEndTestReducer,
    mcqs: mcqsReducer,
    search: searchReducer,
    module: moduleReducer,
    user: userReducer,
    favourites: favouritesReducer,
    attempts: attemptsReducer,
    dashboard: dashboardReducer,
    enterprise: enterpriseReducer,
    getalluser: getalluserReducer,
    mcqcreationlist: mcqcreationlistReducer,
    keygenreration: keygenrerationReducer,
    download: downloadReducer,
    licensekeydetails: licensekeydetailsReducer,
    test: testReducer,
    loginuser: authReducer,
    advertisement: advertisementReducer,
    details: detailsReducer,
    sop: sopReducer,
    activity: activityReducer,
    subsidedata: SubsidedataReducer,
    ids: idsReducer,
    elementid: dashboardElementIdReducer,
    myReq: myRequestReducer,
    notification: notificationReducer,
    linkedData: linkedDataReducer,
    noteslist: notesReducer,
    chat: chatReducer,
    RiskAndCompliences: ListRiskAndCompliencesReducer,
    certificate: certificateReducer,
    esing: esingReducer,
    testId: testIDReducer,
    selectedId: selectedIdReducer,
    testMcq: testMcqReducer,
    // clip: clipReducer,
    // roles: rolesReducer,
    // image: imageReducer,
    workflow: workflowReducer,
    flowWithSop: flowWithSop,
    SOPReactFlow: SOPReactFlowReducer,
    SOPflowModal: SOPflowModalReducer,
    // attachments: attachmentsReducer,
    // selectedNode: selectedNodeReducer,
    docOne: docOneReducer,
    docTwo: docTwoReducer,
    movefile: movefileReducer,
    action: actionReducer,
    dashboardAction: dashboardActionsReducer,
    docxTemplate:docxTemplateReducer,
  },
});
const persistor = persistStore(store);

export { store, persistor };
