// nrf.js (NRF microservice)
const express = require("express");
const app = express();
const port = 3000;

// Simulated service registration information (replace with actual data)
const serviceRegistry = {
  registration: "udm-service:3000",
  af: "af-service:3000", // Map the 'registration' service to the UDM microservice
  // Add more service mappings as needed
};

// Serve the serviceRegistry JSON
app.get("/service-registry", (req, res) => {
  res.json(serviceRegistry);
});

// Define routes and functionality for other services

app.listen(port, () => {
  console.log(`NRF microservice is running on port ${port}`);
});
