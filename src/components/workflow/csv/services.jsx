import React from "react";
import Convertcsvtojson from "./convertcsvtojson";
import Convertjsontocsv from "./convertjsontocsv";
import { useSelector } from "react-redux";
const Services = () => {
  const { name } = useSelector((state) => state.workflow.data);

  return (
    <div>
      {name === "CSV (Convert JSON to CSV)" && <Convertjsontocsv />}
      {name === "CSV (Convert CSV to JSON)" && <Convertcsvtojson />}
    </div>
  );
};

export default Services;
