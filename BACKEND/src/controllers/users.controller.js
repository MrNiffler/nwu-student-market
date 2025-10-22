import * as User from '../models/User.js';

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { full_name, email, password, student_number, role } = req.body;

    if (!full_name || !email || !password || !student_number) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    // Check if user already exists
    const existingUser = await User.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists." });
    }

    const newUser = await User.createUser(full_name, email, password, student_number, role);
    res.status(201).json({ success: true, message: "User created successfully", data: newUser });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ success: false, message: "Server error creating user." });
  }
};

// Get all users
export const getAllUsers = async (_req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ success: false, message: "Server error fetching users." });
  }
};
