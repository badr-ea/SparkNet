const express = require("express");
const router = express.Router();
const {
  getFeedPosts,
  getUserPosts,
  likePost,
} = require("../controllers/posts");
const verifyToken = require("../middleware/auth");

router.get("/", verifyToken, getFeedPosts);
router.get("/:userId", verifyToken, getUserPosts);
router.patch("/:id/like", verifyToken, likePost);

module.exports = router;
