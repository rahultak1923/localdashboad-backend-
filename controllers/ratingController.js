const Rating = require("../models/Rating");
const User = require("../models/User");

// @desc    Admin: Give or update employee rating
// @route   POST /api/ratings
// @access  Private/Admin
const setEmployeeRating = async (req, res) => {
  try {
    const { employeeId, month, stars, feedback } = req.body;

    if (!employeeId || !month || !stars) {
      return res.status(400).json({ message: "Employee, month aur stars zaroori hain!" });
    }

    const rating = await Rating.findOneAndUpdate(
      { employeeId, month },
      {
        stars: Number(stars),
        feedback,
        givenBy: req.user._id,
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Rating safalta-purvak update ho gayi!", rating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Employee: Khud ki monthly ratings dekhna
// @route   GET /api/ratings/my
// @access  Private (Employee)
const getMyRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ employeeId: req.user._id }).sort({ createdAt: -1 });
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin: Sabhi employees ki current aur past ratings dekhna
// @route   GET /api/ratings/all
// @access  Private/Admin
const getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find()
      .populate("employeeId", "name email designation department photoUrl")
      .sort({ createdAt: -1 });
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Top Performer Banner ke liye (Highest rated employee)
// @route   GET /api/ratings/top
// @access  Private
const getTopPerformer = async (req, res) => {
  try {
    // Current highest rating fetch
    const topRating = await Rating.findOne()
      .sort({ stars: -1, createdAt: -1 })
      .populate("employeeId", "name designation department photoUrl email");

    res.json(topRating || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  setEmployeeRating,
  getMyRatings,
  getAllRatings,
  getTopPerformer,
};