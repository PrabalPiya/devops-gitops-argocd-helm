const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello how are u");
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "GitOps app is healthy",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});