import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
// import "@react-pdf-viewer/highlight/lib/styles/index.css";
import "./index.css";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { store, persistor } from "./store/Store.jsx";
import { PersistGate } from "redux-persist/integration/react";
import { DownloadProvider } from "./components/downloadprovider/DownloadProvider.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <SocketProvider>
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ToastContainer />
          <DownloadProvider>
            <App />
          </DownloadProvider>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  </SocketProvider>
);
