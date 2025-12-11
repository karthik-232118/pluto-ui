// BackgroundBox.js
import React from "react";
import { Box } from "@mui/material";
import MeshBackground from "../../assets/image/MeshBg.jpg";

const BackgroundMeshBox = ({ children, sx = {} }) => {
  return (
    <Box
      sx={{
        position: "relative",
        "&::before": {
          content: "''",
          position: "absolute",
          left: "0",
          width: "100%",
          height: "100%",
          backgroundImage: `url(${MeshBackground})`,
          backgroundSize: "cover",
          zIndex: 1,
        },
        ...sx,
      }}
    >
      <Box position="relative" zIndex={2}>
        {children}
      </Box>
    </Box>
  );
};

export default BackgroundMeshBox;
// import React from "react";
// import { Box } from "@mui/material";

// const BackgroundMeshBox = ({ children, sx = {} }) => {
//   return (
//     <Box
//       sx={{
//         position: "relative",
//         "&::before": {
//           content: "''",
//           position: "absolute",
//           left: "0",
//           width: "100%",
//           height: "100%",
//           background: "linear-gradient(-45deg, #008cff30, #3200A830, #73AEE530, #9747FF30, #D4ECFF30)",
//           backgroundSize: "400% 400%",
//           animation: "gradient 15s ease infinite",
//           zIndex: 1,
//         },
//         "@keyframes gradient": {
//           "0%": { backgroundPosition: "0% 50%" },
//           "50%": { backgroundPosition: "100% 50%" },
//           "100%": { backgroundPosition: "0% 50%" },
//         },
//         ...sx,
//       }}
//     >
//       <Box position="relative" zIndex={2}>
//         {children}
//       </Box>
//     </Box>
//   );
// };

// export default BackgroundMeshBox;
