import User from "../models/user.model.js";
import Message from '../models/message.model.js';
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId }
    }).select('-password');

    res.status(200).json(filteredUsers);

  } catch (error) {
    console.error('Error in getUserForSideBar: ', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const userToChatId = req.params.id;
    const senderId = req.user._id;

    // Query to database
    const message = await Message.find({
      $or: [
        {
          senderId: senderId,
          receiverId: userToChatId
        },
        {
          senderId: userToChatId,
          receiverId: senderId
        }
      ]
    });

    res.status(200).json(message);

  } catch (error) {
    console.error('Error in getMessage: ', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body; // message that the user send
    const receiverId = req.params.id; // save message receiver
    const senderId = req.user._id; // save message sender

    // when the user upload an image
    // save it in cloudinary
    let imageUrl = null;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage);
    }

    res.status(200).json(newMessage);

  } catch (error) {
    console.error('Error in sendMessage: ', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};