const Comment = require("../models/Comments");
const Post = require("../models/Post");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");

const createComment = async (req, res) => {
  try {
    const { userId, content } = req.body;
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
      throw new NotFoundError("Post not found");
    }
    const newComment = await Comment.create({
      userId,
      postId,
      content,
    });
    post.comments.push(newComment._id);
    await post.save();
    res.status(StatusCodes.CREATED).json(newComment);
  } catch (error) {
    console.log(error.message);
    res.status(error.statusCode).json({ message: error.message });
  }
};

const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) {
      throw new NotFoundError("Post not found");
    }

    const commentPromises = post.comments.map((commentId) => {
      return Comment.findById(commentId)
        .populate("userId", "_id username picturePath")
        .then((comment) => ({
          id: comment._id,
          userId: comment.userId._id,
          content: comment.content,
          username: comment.userId.username,
          picturePath: comment.userId.picturePath,
        }));
    });

    const comments = await Promise.all(commentPromises);

    res.status(StatusCodes.OK).json(comments);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const modifyComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(id);
    if (!comment) {
      throw new NotFoundError("Comment not found");
    }
    comment.content = content;
    await comment.save();

    res.status(StatusCodes.OK).json(comment);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findOneAndDelete({ _id: id });
    if (!comment) {
      throw new NotFoundError("Comment not found");
    }
    const post = await Post.findById(comment.postId);
    post.comments = post.comments.filter(
      (commentId) => id !== commentId.toString()
    );

    res.status(StatusCodes.OK).json(post);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

module.exports = {
  createComment,
  getPostComments,
  modifyComment,
  deleteComment,
};
