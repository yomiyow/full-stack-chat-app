import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js';

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

export const login = async (req, res) => {
  // save the client request
  const { email, password } = req.body;

  try {
    // find the user in the database
    const user = await User.findOne({ email });

    // if user doesnt exist return error response
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // validate the credentials
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // if credentials valid generate a token 
    generateToken(user._id, res);

    // return the user metadata as response
    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic
    });
  } catch (error) {
    console.error("Error in Login: ", error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: 'Profile pic is required' });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId, { profilePic: uploadResponse.secure_url }, { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {

  }
}

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);

  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}