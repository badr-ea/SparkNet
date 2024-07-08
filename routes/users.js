const express = require("express");
const router = express.Router();
const {
  getUser,
  getUserFriends,
  sendFriendRequest,
  acceptFriendRequest,
} = require("../controllers/users");

const verifyToken = require("../middleware/auth");

router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.patch("/:userId/:friendId/send", verifyToken, sendFriendRequest);
router.patch("/:userId/:friendId/accept", verifyToken, acceptFriendRequest);

module.exports = router;
