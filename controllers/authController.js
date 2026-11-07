const User = require("../models/User");
const jwt = require("jsonwebtoken");

// JWT Token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user / Admin setup
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email pehle se registered hai" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "employee",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        photoUrl: user.photoUrl,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Galat email ya password!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile (Khud ki details)
// @route   GET /api/auth/me
// @access  Private (Employee + Admin)
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User nahi mila" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update logged-in user profile (Khud ki details/documents update karna)
// @route   PUT /api/auth/profile
// @access  Private (Employee / Admin)
const updateMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User nahi mila" });
    }

    // Basic Fields
    if (req.body.name) user.name = req.body.name;
    if (req.body.phone) user.phone = req.body.phone;
    if (req.body.address) user.address = req.body.address;
    if (req.body.aadharNumber) user.aadharNumber = req.body.aadharNumber;
    if (req.body.panNumber) user.panNumber = req.body.panNumber;
    if (req.body.photoUrl) user.photoUrl = req.body.photoUrl;
    if (req.body.resumeUrl) user.resumeUrl = req.body.resumeUrl;

    // Documents Object update
    if (req.body.documents) {
      user.documents = {
        ...user.documents,
        ...req.body.documents,
      };
    }

    // Bank Details Object update
    if (req.body.bankDetails) {
      user.bankDetails = {
        ...user.bankDetails,
        ...req.body.bankDetails,
      };
    }

    // Password change (optional)
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      message: "Profile safalpurvak update ho gayi! 🎉",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        address: updatedUser.address,
        aadharNumber: updatedUser.aadharNumber,
        panNumber: updatedUser.panNumber,
        photoUrl: updatedUser.photoUrl,
        resumeUrl: updatedUser.resumeUrl,
        documents: updatedUser.documents,
        bankDetails: updatedUser.bankDetails,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMyProfile, updateMyProfile };