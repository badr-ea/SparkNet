const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comments");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");

const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath, location } = req.body;
    const user = await User.findById(userId);
    if (!picturePath && !description) {
      throw new Error("No content provided");
    }
    const newPost = new Post({
      userId,
      username: user.username,
      description,
      location,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });

    await newPost.save();

    const posts = await Post.find();

    res.status(StatusCodes.CREATED).json(posts);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(StatusCodes.OK).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId });
    res.status(StatusCodes.OK).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(StatusCodes.OK).json(updatedPost);
  } catch (error) {
    throw new NotFoundError("No posts");
  }
};

module.exports = {
  createPost,
  getFeedPosts,
  getUserPosts,
  likePost,
};
