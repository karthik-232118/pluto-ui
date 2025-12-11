import { BASE_URL, ENDPOINT_URL } from "../../config/urlConfig";
import { ApiService, FileUploadService } from "../../config/apiServices";

export const uploadDocument = (data, onProgress) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.common?.documentUpload;
  return FileUploadService.post(METHOD_URL, data, {
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

// riskDocumentUpload


export const riskUploadDocument = (data, onProgress) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.common?.riskDocumentUpload;
  return FileUploadService.post(METHOD_URL, data, {
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

export const uploadTrainingSimulationVideo = (data, onProgress) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.common?.trainingSimulationVideoUpload;
  return FileUploadService.post(METHOD_URL, data, {
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

export const uploadTrainingSimulationZip = (data, onProgress) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.common?.trainingSimulationZipUpload;
  return FileUploadService.post(METHOD_URL, data, {
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

export const uploadTestSimulationZip = (data, onProgress) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.common?.testSimulationZipUpload;
  return FileUploadService.post(METHOD_URL, data, {
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};


export const uploadImage = (data, onProgress) => {
  const METHOD_URL =
    BASE_URL + ENDPOINT_URL?.common?.uploadImage;
  return FileUploadService.post(METHOD_URL, data, {
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

export const uploadSOPPDF = (data, onProgress) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.common?.upload_SOP_PDF;
  return FileUploadService.post(METHOD_URL, data, {
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};


export const listProcessOwner = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.common?.list_process_owner;
  return ApiService.post(METHOD_URL, data);
};

// export const updateDocumentstatus = () => {
//   const METHOD_URL =
//     BASE_URL + ENDPOINT_URL?.common?.updateDocumentstatus;
//   return ApiService.post(METHOD_URL);
// };

export const updateEditedDocument = () => {
  const METHOD_URL = `${BASE_URL}${ENDPOINT_URL?.common?.updateEditedDocument}`;
  return ApiService.post(METHOD_URL);
};

// get_element_details

export const getElementDetails = (data) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.common?.get_element_details;
  return ApiService.post(METHOD_URL, data);
}

// template_upload_docx

export const templateUploadDocx = (data, onProgress) => {
  const METHOD_URL = BASE_URL + ENDPOINT_URL?.common?.template_upload_docx;
  return FileUploadService.post(METHOD_URL, data, {
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};
