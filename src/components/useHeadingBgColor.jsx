// // headingBgColor.js - Simplified version
// // headingBgColor.js - Simplified version

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Getentrprise } from "../store/enterprise/action";

// export const useHeadingBgColor = () => {
//   const [bgColor, setBgColor] = useState("#2C64FF"); // Default color
//   const dispatch = useDispatch();
// //   const { enterpriselist } = useSelector((state) => state.enterprise);

//   useEffect(() => {
//     const payload = {};
//     // dispatch(Getentrprise(payload));
//   }, [dispatch]);

//   useEffect(() => {
//      setBgColor("#2C64FF");
//     // if (enterpriselist && enterpriselist.length > 0) {
//     //   const orgColor = enterpriselist[0]?.OrganizationStructureColor;
//     //   if (orgColor) {
//     //     setBgColor("#33f2d9");
//     //   }
//     // }
//   }, [setBgColor]);

//   return bgColor; // Just return the color string
// };

// headingBgColor.js - Simplified version

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Getentrprise } from "../store/enterprise/action";

// export const useHeadingBgColor = () => {
//   const [bgColor, setBgColor] = useState(() => {
//     return localStorage.getItem("orgBgColor") || "";
//   });
//   const dispatch = useDispatch();
//   const { enterpriselist } = useSelector((state) => state.enterprise);

//   useEffect(() => {
//     if (!localStorage.getItem("orgBgColor")) {
//       const payload = {};
//       dispatch(Getentrprise(payload));
//     }
//   }, [dispatch]);

//   useEffect(() => {
//     if (enterpriselist && enterpriselist.length > 0) {
//       const orgColor = enterpriselist[0]?.OrganizationStructureColor;
//       if (orgColor) {
//         setBgColor(orgColor || "#3B82F6");
//         localStorage.setItem("orgBgColor", orgColor);
//       }
//     }
//   }, [enterpriselist]);

//   return bgColor;
// };

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Getentrprise } from "../store/enterprise/action";
 
export const useHeadingBgColor = () => {
  const [bgColor, setBgColor] = useState(() => {
    return localStorage.getItem("orgBgColor") || "";
  });
  const dispatch = useDispatch();
  const { enterpriselist } = useSelector((state) => state.enterprise);
  useEffect(() => {
    if (enterpriselist && enterpriselist.length > 0) {
      const orgColor = enterpriselist[0]?.OrganizationStructureColor;
      if (orgColor) {
        setBgColor(orgColor || "#3B82F6");
        localStorage.setItem("orgBgColor", orgColor);
      }
    }
  }, [enterpriselist]);
 
  return bgColor;
};
 
 