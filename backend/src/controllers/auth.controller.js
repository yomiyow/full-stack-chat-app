import User from "../models/user.model";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (password < 6) {
      return res.status(400).json({
        message: 'Password must be atleast 6 characters'
      });
    }

    const user = await User;
  } catch (error) {

  }

};

export const login = (req, res) => {
  res.send('Login Page');
};

export const logout = (req, res) => {
  res.send('Logout Page');
};