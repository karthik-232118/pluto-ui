import React, { useState } from "react";
import {
  Box,
  Divider,
  TextField,
  Typography,
  Button,
  Select,
  MenuItem,
  IconButton,
  FormControlLabel,
  Switch,
} from "@mui/material";
import ImageConverttobs64 from "./ImageConverttobs64";
import { useSelector } from "react-redux";
import ImageRisze from "./ImageRisze";
import CompressImage from "./CompressImage";
import CropImage from "./CropImage";

const ImageHelperServices = () => {
  const { open, name } = useSelector((state) => state.workflow.data);
  return (
    <>
      {name === "Image Helper (Image to Base64)" && <ImageConverttobs64 />}
      {name === "Image Helper (Resize Image)" && <ImageRisze />}
      {name === "Image Helper (Compresses an image)" && <CompressImage />}
      {name === "Image Helper (Crop Image)" && <CropImage />}
    </>
  );
};

export default ImageHelperServices;
