// excelExportUtil.js
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import notify from "../../../assets/svg/utils/toast/Toast"; // Adjust path if needed
import { t } from "i18next"; // For internationalization support



/**
 * Exports data to an Excel file.
 * @param {Array} data - The data array representing the table rows.
 * @param {Array} headers - The headers array (each element is an array of column headers).
 * @param {String} fileName - The name of the exported file (with .xlsx extension).
 */
export const handleExportToExcel = (data, headers, fileName) => {
  if (!data || data.length === 0) {
    notify("warning", t("noDataToExport"));
    return;
  }

  const worksheetData = headers.concat(data);

  // Create a new workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(worksheetData);

  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // Convert to binary and save
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  saveAs(blob, fileName);
};
