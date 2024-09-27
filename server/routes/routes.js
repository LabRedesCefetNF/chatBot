const express = require("express");
const router = express.Router();
const userController = require("../controller/userController.js");
const domainController = require("../controller/domainController.js");

router.post("/users", userController.saveUser);
router.post("/domains", domainController.saveDomain);

module.exports = router;
