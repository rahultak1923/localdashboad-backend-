const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getMyProfile, updateMyProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMyProfile);
router.put("/profile", protect, updateMyProfile);

module.exports = router;