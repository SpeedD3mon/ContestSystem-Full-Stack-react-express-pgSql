
import { generateToken,generateRefreshToken } from '../config/auth.js';
import * as userModel from '../models/userModel.js';

export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await userModel.createUser({ username, email, password, role });

    const token = generateToken(user);
    const refresh_token = generateRefreshToken(user);

    // Save refresh token in DB for user
    await userModel.saveRefreshToken(user.user_id, refresh_token);

    res.status(201).json({ user, token, refresh_token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findUserByEmail(email);
    if (!user || password !== user.password)
      return res.status(401).json({ error: 'Invalid email or password' });

    const token = generateToken(user);
    const refresh_token = generateRefreshToken(user);

    await userModel.saveRefreshToken(user.user_id, refresh_token);

    res.json({ user, token, refresh_token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) return res.status(400).json({ error: "Refresh token required" });

    // Find user with this refresh token
    const user = await userModel.findUserByRefreshToken(refresh_token);
    if (!user) return res.status(401).json({ error: "Invalid refresh token" });

    // Generate new access token
    const newToken = generateToken(user);

    res.json({ access_token: newToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getUserHistory = async (req, res) => {
  try {
    
    const userId = req.user.user_id;

   const history = await userModel.getUserHistoryById(userId);

    res.json( history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};