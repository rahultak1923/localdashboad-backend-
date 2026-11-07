const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name zaroori hai"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email zaroori hai"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password zaroori hai"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    department: {
      type: String,
      default: "Development",
    },
    designation: {
      type: String,
      default: "Team Member",
    },
    aadharNumber: {
      type: String,
      default: "",
    },
    panNumber: {
      type: String,
      default: "",
    },
    photoUrl: {
      type: String,
      default: "",
    },
    resumeUrl: {
      type: String,
      default: "",
    },
    // Verification Documents
    documents: {
      aadharDocUrl: { type: String, default: "" },
      panDocUrl: { type: String, default: "" },
      marksheet10Url: { type: String, default: "" },
      marksheet12Url: { type: String, default: "" },
      graduationDocUrl: { type: String, default: "" },
    },
    // Salary Bank Details
    bankDetails: {
      accHolderName: { type: String, default: "" },
      bankName: { type: String, default: "" },
      accNumber: { type: String, default: "" },
      ifscCode: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

// // Save karne se pehle password hash karein
// userSchema.pre("save", async function () {
//   if (!this.isModified("password")) {
//     return;
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// // Password match karne ka method
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// Plain text password comparison method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return enteredPassword === this.password;
};

module.exports = mongoose.model("User", userSchema);