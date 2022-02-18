const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Post = require("./models/post");

const app = express();

mongoose
  .connect(
    "mongodb+srv://Mowafy:1ezmOZ8JkqLgJY5E@cluster0.xqpp1.mongodb.net/node-angular?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection field!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save();
  res.status(201).json({ message: "Post added successfully" });
});

// 1ezmOZ8JkqLgJY5E

app.get("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "dadsada21312d",
      title: "First server-side post",
      content: "this is content from server",
    },
    {
      id: "dads2ada232112d",
      title: "second server-side post",
      content: "this is content from server",
    },
    {
      id: "dadsada21312d",
      title: "First server-side post",
      content: "this is content from server",
    },
  ];
  res
    .status(200)
    .json({ message: "Posts fetched successfully!", posts: posts });
});

module.exports = app;
