import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import ServicesSendEmail from "../../../components/workflow/smtp/ServicesSenemail";
import ServicesCustomEmailApi from "../../../components/workflow/smtp/ServicesCustomEmailApi";
import TextInputServices from "../../../components/workflow/HumenInputs/services";
import IfElseServices from "../../../components/workflow/ifelse/service";
import CsvServies from "../../../components/workflow/csv/services";
import TextService from "../../../components/workflow/text/TextService";
import TextSplitService from "../../../components/workflow/text/TextSplitService";
import TextRemoveHTMLService from "../../../components/workflow/text/TextRemoveHTMLService";
import TextReplaceService from "../../../components/workflow/text/TextReplaceService";
import TextFindService from "../../../components/workflow/text/TextFindService";
import ServiceDynamic from "../../../components/workflow/HumenInputs/ServiceDynamic";
import OutputService from "../../../components/workflow/output/OutputService";
import FormApiService from "../../../components/workflow/HumenInputs/FormApiService";
import WebHookRecieveHttp from "../../../components/workflow/webhook/WebHookRecieveHttp";
import LeftSideBar from "./LeftSideBar";
const WorkFLowServices = () => {
  const { name} = useSelector((state) => state.workflow.data);
  return (
    <>
      <Box
        sx={{
          width: "calc(100% - 50px)",
          padding: "12px",
        }}
      >
        {name === "EMail" && <ServicesSendEmail />}
        {name === "Email Custom API Call" && <ServicesCustomEmailApi />}
        {name === "Human Input" && <TextInputServices />}
        {name === "Create Form" && <ServiceDynamic />}
        {name === "External Forms" && <FormApiService />}
        {name === "If Else Clause" && <IfElseServices />}
        {(name === "CSV (Convert JSON to CSV)" ||
          name === "CSV (Convert CSV to JSON)") && <CsvServies />}
        {name === "Concatenation" && <TextService />}
        {name === "Split" && <TextSplitService />}
        {name === "Remove HTML" && <TextRemoveHTMLService />}
        {name === "Replace" && <TextReplaceService />}
        {name === "Find" && <TextFindService />}
        {name === "Output" && <OutputService />}
        {name === "Call Rest API" && <WebHookRecieveHttp />}
        {/* Default fallback if no match */}
        {![
          "Gmail",
          "Email Custom API Call",
          "Webhook - Call Rest API/Webhook",
          "Human Input",
          "Create Form",
          "External Forms",
          "If",
          "CSV (Convert JSON to CSV)",
          "CSV (Convert CSV to JSON)",
          "Concatenation",
          "Split",
          "Remove HTML",
          "Replace",
          "Find",
          "Output",
          "Call Rest API",
        ].includes(name) && <LeftSideBar />}
      </Box>
    </>
  );
};

export default WorkFLowServices;
