// udm.js (UDM microservice)
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const app = express();
const port = 3000;

// In-memory user data
const users = [
  {
    username: "user1",
    password: "password1",
  },
  {
    username: "user2",
    password: "password2",
  },
];
// Secret key for JWT token signing
const jwtSecretKey = "your-secret-key";

// Middleware to parse JSON requests
app.use(bodyParser.json());

app.post("/verify-user", (req, res) => {
  const { token } = req.body;

  // Verify the JWT token
  jwt.verify(token, jwtSecretKey, (err, decoded) => {
    if (err) {
      // Token verification failed
      res.status(401).json({ verified: false });
    } else {
      // Token verification succeeded
      const { username } = decoded;

      // Find the user in the user data
      const user = users.find((u) => u.username === username);

      if (user) {
        // User is found in the user data, and verification succeeds
        res.json({ verified: true, username: user.username });
      } else {
        // User is not found in the user data, and verification fails
        res.status(401).json({ verified: false });
      }
    }
  });
});
// User registration route
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if the user exists in the in-memory data
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    res.json({
      auth: false,
      message: "Authentication failed - Username or Password is wrong",
    });
    return;
  }

  // Generate a JWT token
  const token = jwt.sign({ username }, jwtSecretKey, { expiresIn: "1h" });

  res.json({ auth: true, message: "Registration successful", token });
});

app.listen(port, () => {
  console.log(`UDM microservice is running on port ${port}`);
});
