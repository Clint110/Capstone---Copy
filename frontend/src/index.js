import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "react-big-calendar/lib/css/react-big-calendar.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="363360235612-ejv496i99hb0j2vmeet085iofiohrft8.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
