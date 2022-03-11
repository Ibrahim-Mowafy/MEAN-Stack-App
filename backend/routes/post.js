const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");
const PostControllers = require("../controllers/post");

router.post("", checkAuth, extractFile, PostControllers.createPost);

router.get("", PostControllers.getPosts);
router.get("/:id", PostControllers.getPost);

router.put("/:id", checkAuth, extractFile, PostControllers.updatePost);

router.delete("/:id", checkAuth, PostControllers.deletePost);

module.exports = router;
