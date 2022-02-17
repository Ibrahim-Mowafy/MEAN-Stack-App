const express = require("express");

const app = express();

app.use((req, res, next) => {
  res.send("hello form express");
});

module.exports = app;
