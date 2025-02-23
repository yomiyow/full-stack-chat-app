import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be atleast 6 characters'
      });
    }

    // Email validation
    const user = await User.findOne({ email });
    if (user) return res.status(422).json({ message: 'Email already exists' });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashPassword
    });

    // generate access token from jwt
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        message: 'User created successfully'
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }

  } catch (error) {
    console.error('Error Signup: ', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const login = (req, res) => {
  res.send('Login Page');
};

export const logout = (req, res) => {
  res.send('Logout Page');
};