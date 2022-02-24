const express = require("express");
const Post = require("../models/post");

const routes = express.Router();

routes.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then((createdPost) => {
    res
      .status(201)
      .json({ message: "Post added successfully", postId: createdPost._id });
  });
});
routes.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

routes.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({ _id: req.params.id }, post).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Update Successfully!" });
  });
});

routes.get("", (req, res, next) => {
  Post.find().then((documents) => {
    res
      .status(200)
      .json({ message: "Posts fetched successfully!", posts: documents });
  });
});

routes.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = routes;
 