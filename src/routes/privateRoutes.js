import AccountOpeningForm from "../components/allpages/accountopening/AccountOpeningForm";
import AutoFinance from "../components/allpages/docsflow/AutoFinance";
import Credit from "../components/allpages/docsflow/Credit";
import Document from "../components/allpages/docsflow/Document";
import MyTest from "../components/allpages/mytest/MyTest";
import Questions from "../components/allpages/questions/Questions";
import SaveList from "../components/allpages/savedlist/SaveList";
import SearchResult from "../components/allpages/searchresult/SearchResult";
import AutoFinanceSOPS from "../components/allpages/sops/AutoFinanceSOPS";
import CreditSOPs from "../components/allpages/sops/CreditSOPs";
import DocumentSOPs from "../components/allpages/sops/DocumentSOPs";
import Sops from "../components/allpages/sops/Sops";

import TestSimulation from "../components/testsimuation/TestSimuation";
import TrainingSimulation from "../components/trainingsimulation/TrainingSimulation";
import VideoSimulation from "../components/videosimulation/VideoSimulation";



export const PrivateRoutes =[

    {
        path:"/mytest",
        element: <MyTest />, 
    },
    {
        path:"/questions",
        element:<Questions/>
    },
    {
        path:"/account-openingform",
        element:<AccountOpeningForm/>
    },
    {
        path:"/training-simulation",
        element:<TrainingSimulation/>
    },
    {
        path:"/test-simulation",
        element:<TestSimulation/>
    },
    {
        path:"/autoFinance",
        element:<AutoFinance/>
    },
    {
        path:"/credit",
        element:<Credit/>
    },
    {
        path:"/document",
        element:<Document/>
    },
    {
        path:"/save-list",
        element:<SaveList/>
    },
    {
        path:"/autoFinanceSop",
        element:<AutoFinanceSOPS/>
    },
    {
        path:"/credit-sops",
        element:<CreditSOPs/>
    },
    {
        path:"/document-sops",
        element:<DocumentSOPs/>
    },
    {
        path:"/sops",
        element:<Sops/>
    },
    {
        path:"/video-simulation",
        element:<VideoSimulation/>
    },
    {
        path:"/search-result",
        element:<SearchResult/>
    }



]