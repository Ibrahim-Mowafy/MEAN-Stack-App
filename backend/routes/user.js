const express = require("express");
const UserControllers = require("../controllers/user");

const router = express.Router();
router.post("/signup", UserControllers.createUser);

router.post("/login", UserControllers.loginUser);

module.exports = router;
