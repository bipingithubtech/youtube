import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // use 'lowercase' instead of 'lowerCase'
      index: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"], // corrected validation message
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Proceed if password is not modified
  try {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error); // Pass error to next middleware
  }
});

// Custom method to compare passwords
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.method.AcessToken = async function () {
  jwt.sign(
    { _id: this._id, email: this.email, username: this.username },
    process.env.AcessToken,
    { expiresIn: "1h" }
  );
};
userSchema.method.generateRefreshToken = async function () {
  jwt.sign({ _id: this._id }, process.env.refreshToken, { expiresIn: "1h" });
};

const User = mongoose.model("User", userSchema);

export default User;
