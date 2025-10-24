import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  const { role, name, email, password } = req.body;

  try {
    if (!name || !role || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    if (password.length <= 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      role,
      email,
      password: hashedPassword,
    });

    const token = await genToken(newUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Sign in
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields Required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Password Incorrect" });
    }

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};