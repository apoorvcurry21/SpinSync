import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "leaflet/dist/leaflet.css";

// Optionally populate the database with sample data in development mode
// Uncomment this section to populate database with sample data
/*
if (process.env.NODE_ENV === 'development') {
  import('./utils/populateDatabase')
    .then(module => {
      // Uncomment the line below to populate data automatically
      // module.populateDatabase();
      console.log('Sample data population available - use the button in the app to populate data');
    })
    .catch(err => console.error('Failed to load sample data module:', err));
}
*/

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
