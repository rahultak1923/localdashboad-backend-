const express = require("express");
const router = express.Router();
const {
  setEmployeeRating,
  getMyRatings,
  getAllRatings,
  getTopPerformer,
} = require("../controllers/ratingController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Routes
router.get("/top", protect, getTopPerformer);
router.get("/my", protect, getMyRatings);
router.get("/all", protect, getAllRatings);
router.post("/", protect, adminOnly, setEmployeeRating);

module.exports = router;