const express = require("express");
const router = express.Router();
const {
  createComment,
  getPostComments,
  modifyComment,
  deleteComment,
} = require("../controllers/comments");
const verifyToken = require("../middleware/auth");

router.post("/:postId", verifyToken, createComment);
router.get("/:postId", verifyToken, getPostComments);
router.patch("/:id", verifyToken, modifyComment);
router.delete("/:id", verifyToken, deleteComment);

module.exports = router;
