import moment from "moment";
import xss from "xss";
import * as XLSX from "xlsx";
import notify from "../assets/svg/utils/toast/Toast";
import TextHelper from "../assets/svg/reactflow/TextHelper.svg";
import Webhook from "../assets/svg/reactflow/Webhook.svg";
import Salesforce from "../assets/svg/reactflow/Salesforce.svg";
import TextInput from "../assets/svg/reactflow/TextInput.svg";
import Onedrive from "../assets/svg/reactflow/Onedrive.svg";
import Postgresql from "../assets/svg/reactflow/Postgresql.svg";
import Zoho from "../assets/svg/reactflow/Zoho.svg";
import Code from "../assets/svg/reactflow/Code.svg";
import API from "../assets/svg/reactflow/API.svg";
import GoogleDrive from "../assets/svg/reactflow/Google Drive.svg";
import AI from "../assets/svg/reactflow/AI Transformation.svg";
import ImageHelper from "../assets/svg/reactflow/ImageHelper.svg";
import mongodb from "../assets/svg/reactflow/MongoDB.svg";
import cvc from "../assets/svg/reactflow/csv.svg";
import datamapper from "../assets/svg/reactflow/Data Mapper.svg";
import email from "../assets/svg/reactflow/email.svg";
import ActionRequired from "../assets/svg/reactflow/ActionRequired.svg";
import Erorr from "../assets/svg/reactflow/Error.svg";
import Success from "../assets/svg/reactflow/Success.svg";
import DataTableImage from "../assets/svg/reactflow/dataTable.svg";

// Function to validate and sanitize an array of inputs
export const validateAndSanitizeInputs = (inputs) => {
  // Loop through each input and sanitize it
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const sanitizedInput = xss(input); // Sanitize the input using xss

    // If input is modified during sanitization, return false
    if (sanitizedInput && input && sanitizedInput != input) {
      return false;
    }
  }

  // If all inputs are safe, return true
  return true;
};

// Caesar Cipher Encryption Function
export const encryptString = (plainText, shift) => {
  let encryptedText = "";

  // Loop through each character in the plainText
  for (let i = 0; i < plainText.length; i++) {
    let charCode = plainText.charCodeAt(i);

    // Encrypt only alphabetic characters
    if (charCode >= 65 && charCode <= 90) {
      // Uppercase letters
      encryptedText += String.fromCharCode(((charCode - 65 + shift) % 26) + 65);
    } else if (charCode >= 97 && charCode <= 122) {
      // Lowercase letters
      encryptedText += String.fromCharCode(((charCode - 97 + shift) % 26) + 97);
    } else {
      encryptedText += plainText[i]; // Non-alphabet characters remain unchanged
    }
  }

  return encryptedText;
};

export const dateformatter = (date) => {
  return moment(date).format("D MMM  YY , h:mm A");
};

export const formartTimes = (date) => {
  return moment(date).fromNow();
};

export const formatSidebarText = (text) => {
  switch (text) {
    case "TrainingSimulation":
      return "Training Simulation";
    case "TestSimulation":
      return "Test Simulation";
    case "TestMCQ":
      return "Test MCQ";
    default:
      return text;
  }
};

// Update function signature to accept t as an argument
export const createSampleWorkbook = (
  data = [],
  sheetName = "Sheet",
  fileName = "Excel",
  t = (msg) => msg // fallback if t is not provided
) => {
  if (data.length === 0) {
    // notify("error", t("No data found to export Excel file."));
    return;
  }

  const wb = XLSX.utils.book_new();
  const wsOwner = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, wsOwner, sheetName);

  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

export const geticons = (name) => {
  const icons = {
    "SMTP - Send Email": email,
    "Email Custom API Call": email,
    Email: email,
    Concatenation: TextHelper,
    Find: TextHelper,
    "Remove HTML": TextHelper,
    Replace: TextHelper,
    Split: TextHelper,
    Utility: Webhook,
    "HTTP Call": Webhook,
    "Call Rest API": Webhook,
    "Human Input": TextInput,
    "Create Form": TextInput,
    "External Forms": TextInput,
    Decisions: TextInput,
    "Data mapper": datamapper,
    "Import - csv": cvc,
    "Text Helper": TextHelper,
    API: API,
    "Image Helper": ImageHelper,
    "Output View": ImageHelper,
    "AI Transformation": AI,
    Code: Code,
    OneDrive: Onedrive,
    "Google Drive": GoogleDrive,
    mongo: mongodb,
    postgresql: Postgresql,
    salesforce: Salesforce,
    Zoho: Zoho,
    "If Else Clause": TextInput,
    "Data Table": DataTableImage,
  };
  return icons[name];
};

export const allowedHideUnhideModules = ["Document", "SOP", "Form"];
export function convertToDaysAndHours(seconds) {
  if (seconds < 0) return "0 sec";

  const days = Math.floor(seconds / (24 * 3600));
  const hours = Math.floor((seconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const sec = Math.floor(seconds % 60);

  if (days > 0) {
    return `${days} d ${hours} h ${minutes} min ${sec} sec`;
  } else if (hours > 0) {
    return `${hours} h ${minutes} min ${sec} sec`;
  } else if (minutes > 0) {
    return `${minutes} min ${sec} sec`;
  } else {
    return `${sec} sec`;
  }
}

export const getStatusStyle = (status) => {
  switch (status) {
    case "Error":
    case "Rejected":
    case "Reject":
      return {
        backgroundColor: "#D32F2F",
        color: "#ffff",
        borderRadius: "22px",
        height: "32px",
        width: "fit-content",
        textAlign: "center",
        fontSize: "14px",
        alignItems: "center",
        display: "flex",
        justifiContent: "space-between",
        padding: "12px",
        marginBottom: "8px",
      };
    case "Completed":
    case "Success":
    case "Aprroved":
      return {
        backgroundColor: "#0BBC28",
        color: "#ffff",
        borderRadius: "22px",
        height: "32px",
        width: "fit-content",
        textAlign: "center",
        fontSize: "14px",
        alignItems: "center",
        display: "flex",
        justifiContent: "space-between",
        padding: "12px",
        marginBottom: "8px",
      };
    case "Pending":
      return {
        backgroundColor: "#EF6C00",
        color: "#ffff",
        borderRadius: "22px",
        height: "32px",
        width: "fit-content",
        textAlign: "center",
        fontSize: "14px",
        alignItems: "center",
        display: "flex",
        justifiContent: "space-between",
        padding: "12px",
        marginBottom: "8px",
      };
    default:
      return {
        backgroundColor: "#EF6C00",
        color: "#ffff",
        borderRadius: "22px",
        height: "32px",
        width: "fit-content",
        textAlign: "center",
        fontSize: "14px",
        alignItems: "center",
        display: "flex",
        justifiContent: "space-between",
        padding: "12px",
        marginBottom: "8px",
      };
  }
};

export const getStatus = (status) => {
  const statusIcons = {
    Completed: Success,
    Faild: Erorr,
    ActionRequired: ActionRequired,
    EmailActionRequired: ActionRequired,
  };

  switch (status) {
    case "Completed":
    case "Success":
      return statusIcons.Completed;
    case "Failed":
      return statusIcons.Faild;
    case "ActionRequired":
      return statusIcons.ActionRequired;
    case "EmailActionRequired":
      return statusIcons.EmailActionRequired;
    default:
      return statusIcons.ActionRequired;
  }
};

export const formatUserName = (Obj) => {
  const detail = Obj?.UserDetail || {};
  const userName = Obj?.UserName;

  const parts = [
    detail.UserFirstName,
    detail.UserMiddleName,
    detail.UserLastName,
  ].filter(Boolean);

  const fullName = parts.join(" ").trim();

  if (fullName && userName) {
    return `${fullName} (${userName})`;
  } else if (fullName) {
    return fullName;
  } else if (userName) {
    return `(${userName})`;
  } else {
    return "-";
  }
};
