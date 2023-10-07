// nrf.js (NRF microservice)
const express = require("express");
const app = express();
const port = 3000;

// Serve the serviceRegistry JSON
app.get("/af", (req, res) => {
  res.json({ msg: "AF Hello" });
});

// Define routes and functionality for other services

app.listen(port, () => {
  console.log(`AF microservice is running on port ${port}`);
});
