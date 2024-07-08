const User = require("../models/User");
const Post = require("../models/Post");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError(`No user with id: ${id}`);
    }
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(error.statusCode).json({ message: error.message });
  }
};

const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, username, location, picturepath, occupation }) => {
        _id, username, location, picturepath, occupation;
      }
    );
    res.status(StatusCodes.OK).json({ user_friends: formattedFriends });
  } catch (error) {
    throw new NotFoundError(error.message);
  }
};

const sendFriendRequest = async (req, res) => {
  try {
    const { userId, friendId } = req.params;
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user) {
      throw new NotFoundError(`No user with id ${userId}`);
    }

    if (!friend) {
      throw new NotFoundError(`No friend with id ${friendId}`);
    }

    if (
      friend.friendRequestRecieved.includes(userId) ||
      user.friendRequestSent.includes(friendId)
    ) {
      throw new BadRequestError("Friend request already sent");
    }

    user.friendRequestSent.push(friendId);
    friend.friendRequestRecieved.push(userId);

    await user.save();
    await friend.save();

    res
      .status(StatusCodes.OK)
      .json({ message: "Friend request sent successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const { userId, friendId } = req.params;
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user) {
      throw new NotFoundError(`No user with id ${userId}`);
    }

    if (!friend) {
      throw new NotFoundError(`No friend with id ${friendId}`);
    }
    if (
      !user.friendRequestRecieved.includes(friendId) ||
      !friend.friendRequestSent.includes(userId)
    ) {
      throw new BadRequestError("No friend request to accept");
    }
    user.friends.push(friendId);
    friend.friends.push(userId);

    user.friendRequestRecieved = user.friendRequestRecieved.filter(
      (id) => id !== friendId
    );
    friend.friendRequestSent = friend.friendRequestSent.filter(
      (id) => id !== userId
    );

    await user.save();
    await friend.save();

    res.status(StatusCodes.OK).json({ message: "Friend request accepted" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  console.log(req.body);
  try {
    const {
      userId,
      username,
      location,
      occupation,
      profileFilename,
      dashboardFilename,
    } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError(`No user with id: ${userId}`);
    }

    if (req.files) {
      if (profileFilename) user.picturePath = profileFilename;
      if (dashboardFilename) user.dashboardPicturePath = dashboardFilename;
    }

    if (username) user.username = username;

    user.location = location;
    user.occupation = occupation;

    await Post.updateMany(
      { userId },
      {
        $set: {
          username,
          location,
          userPicturePath: user.picturePath,
        },
      }
    );

    const updatedUser = await user.save();
    res.status(StatusCodes.OK).json(updatedUser);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error updating user profile", details: error.message });
  }
};

module.exports = {
  getUser,
  getUserFriends,
  sendFriendRequest,
  acceptFriendRequest,
  updateUserProfile,
};
