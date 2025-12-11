import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Box,
  Avatar,
  Card,
  Divider,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../../config/urlConfig";
import { dateformatter } from "../../../utils";

const PrviouseData = () => {
  const { getpervData } = useSelector((state) => state.workflow);

  // Ensure that getpervData exists and has valid data
  const fieldValues = getpervData?.value || [];

  // If there's no data, render nothing (no Card, no content)
  if (fieldValues.length === 0) {
    return null; // Nothing will be rendered if there's no data
  }

  return (
    <div>
      {/* Render previous data sections only if there is content */}
      {fieldValues.map((item, index) => {
        const fieldItemValues = item?.values || {};

        // Only render a Card if there is content in the item
        if (Object.keys(fieldItemValues).length === 0) {
          return null; // Skip this item if no data exists
        }

        return (
          <Card
            sx={{ padding: "10px", marginBottom: "20px" }}
            key={item?.title || index}
          >
            {item?.title && (
              <Typography variant="h6" marginBottom={2}>
                {item?.title}
              </Typography>
            )}
            {item?.title && <Divider sx={{ marginBottom: "10px" }} />}
            <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
              <Avatar />
              <div>
                <Typography variant="body1" marginBottom={0} textAlign="start">
                  {`${item?.owner?.UserFirstName} ${item?.owner?.UserLastName}` ||
                    "No email available"}
                </Typography>
                <Typography variant="body1">
                  {item?.owner?.UserEmail}
                </Typography>
              </div>
            </Box>

            {/* Render table if values exist */}
            <Table sx={{ width: "100%" }}>
              <TableBody>
                {Object.keys(fieldItemValues).map((key, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell>{key}</TableCell>
                    <TableCell sx={{ maxWidth: "50%" }}>
                      <Typography
                        sx={{ textWrap: "wrap", wordBreak: "break-all" }}
                        title={fieldItemValues[key]}
                      >
                        {fieldItemValues[key]?.length < 100
                          ? fieldItemValues[key]
                          : fieldItemValues[key]?.slice(0, 100) + "..."}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        );
      })}
    </div>
  );
};

export default PrviouseData;
