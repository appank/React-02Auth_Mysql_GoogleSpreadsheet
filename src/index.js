import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthContextProvider } from "./context/AuthContext"; // pastikan ini benar

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
