// amf.js (AMF microservice)
const express = require("express");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Define the NRF service URL (replace with the actual URL)
const nrfServiceUrl = "http://nrf-service:3000";

app.get("/", async (req, res) => {
  // Get the user information from JWT token
  const token = req.cookies.jwt;
  if (!token) {
    // User is not logged in, send login page
    res.sendFile(__dirname + "/login.html");
  } else {
    // User is authenticated
    // Check the NRF service to find out who handles registration (UDM)
    try {
      const response = await axios.get(`${nrfServiceUrl}/service-registry`);
      const serviceRegistry = response.data;

      // Check if the service name 'registration' is in the registry
      const serviceName = serviceRegistry["registration"];

      if (!serviceName) {
        res.status(500).send("Service not found");
        return;
      }
      // Send a request to UDM for user verification
      const serviceResponse = await axios.post(
        `http://${serviceName}/verify-user`,
        {
          token,
        }
      );

      if (serviceResponse.data.verified) {
        // User is verified, send a welcome message

        res.send(
          `<html><body>Welcome! ${serviceResponse.data.username}</body></html>`
        );
      } else {
        // User verification failed, delete the cookie and send back login page
        res.clearCookie("jwt"); // Delete the JWT cookie
        res.sendFile(__dirname + "/login.html"); // Send login page
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  }
});
// Define routes to forward requests to the appropriate microservices
app.post("/login", async (req, res) => {
  try {
    // Retrieve the service registry information from NRF
    const response = await axios.get(`${nrfServiceUrl}/service-registry`);
    const serviceRegistry = response.data;

    // Check if the service name 'registration' is in the registry
    const serviceName = serviceRegistry["registration"];

    if (!serviceName) {
      res.status(500).send("Service not found");
      return;
    }

    // Forward the request to the appropriate microservice (UDM in this case)
    const serviceResponse = await axios.post(
      `http://${serviceName}/login`,
      req.body
    );
    if (serviceResponse.data.auth) {
      res.cookie("jwt", serviceResponse.data.token);
    }
    res.send(serviceResponse.data.message);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Add routes for other functionalities, if needed

app.listen(port, () => {
  console.log(`AMF microservices is running on port ${port}`);
});
