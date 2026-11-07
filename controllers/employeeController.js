const User = require("../models/User");

// @desc    Get all employees (Admin view)
// @route   GET /api/employees
// @access  Private/Admin
const getAllEmployees = async (req, res) => {
  try {
    // select: false lagane ke baad password waise bhi nahi aayega
    const employees = await User.find({ role: "employee" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new employee (Admin only)
// @route   POST /api/employees
// @access  Private/Admin
const createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      department,
      designation,
      aadharNumber,
      panNumber,
      photoUrl,
      resumeUrl,
      documents,
      bankDetails,
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Yeh email pehle se exist karta hai" });
    }

    // Default password agar admin specify na kare to phone number ya 123456
    const initialPassword = password || phone || "123456";

    const employee = await User.create({
      name,
      email,
      password: initialPassword,
      role: "employee",
      phone,
      address,
      department: department || "Development",
      designation: designation || "Team Member",
      aadharNumber,
      panNumber,
      photoUrl,
      resumeUrl,
      documents: documents || {},
      bankDetails: bankDetails || {},
      status: "Active",
    });

    res.status(201).json({
      message: "Employee successfully create ho gaya!",
      employee: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        designation: employee.designation,
        photoUrl: employee.photoUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update employee status/details
// @route   PUT /api/employees/:id
// @access  Private/Admin
const updateEmployee = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee nahi mila" });
    }

    // Details update
    Object.assign(employee, req.body);
    await employee.save();

    res.json({ message: "Employee details update ho gayi!", employee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
const deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee nahi mila" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee record delete ho gaya!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};