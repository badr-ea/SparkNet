import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setPost } from "../state";
import Comments from "./Comments";

const Post = ({
  postId,
  userId,
  username,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const picture = useSelector((state) => state.user.picturePath);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const commentCount = comments.length;
  const navigate = useNavigate();
  const pictureUrl = "http://localhost:3001/images/users/profile-pictures/";

  const createComment = async () => {
    try {
      if (!comment) {
        throw new Error("Empty comment");
      }
      const values = {
        userId: loggedInUserId,
        content: comment,
      };
      console.log(loggedInUserId, comment);
      // console.log(formData);
      const response = await fetch(
        `http://localhost:3001/api/v1/comments/${postId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  const patchLike = async () => {
    const response = await fetch(
      `http://localhost:3001/api/v1/posts/${postId}/like`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      }
    );
    const updatedPost = await response.json();
    dispatch(setPost({ updatedPost }));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      createComment();
      setComment("");
    }
  };

  return (
    <div className="post-container">
      <div className="post-user">
        <div className="post-user-picture">
          <img
            src={
              userPicturePath
                ? `http://localhost:3001/images/users/profile-pictures/${userPicturePath}`
                : "/assets/default-user-picture.jpg"
            }
            alt=""
          />
        </div>
        <div className="post-user-info">
          <div
            className="post-username body-large"
            onClick={() => {
              navigate(`/profile/${userId}`);
              window.location.reload();
            }}
          >
            {username}
          </div>
          <div className="subtitles body-small">{location}</div>
        </div>
      </div>
      <span className="post-description body-medium">{description}</span>
      <div className="post-image-container">
        <img
          src={`http://localhost:3001/images/posts/${picturePath}`}
          alt=""
          className="post-image"
        />
      </div>
      <div className="post-interactions">
        <div className="post-likes">
          <img src="/assets/Like.svg" alt="" onClick={patchLike} />
          <span className="likes-text body-small">{likeCount} Likes</span>
        </div>
        <div
          className="post-comments"
          onClick={() => setIsComments(!isComments)}
        >
          <img src="/assets/Comment.svg" alt="" />
          <span className="comments-text body-small">
            {commentCount} Comments
          </span>
        </div>
      </div>
      {isComments && (
        <section>
          <div className="post-input-container">
            <div className="post-user-picture">
              <img
                src={
                  picture
                    ? `${pictureUrl}${picture}`
                    : "/assets/default-user-picture.jpg"
                }
                alt=""
              />
            </div>
            <div className="post-input">
              <input
                type="text"
                className="search-input body-medium"
                placeholder="Write a comment..."
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={handleKeyDown}
                value={comment}
              ></input>
            </div>
          </div>
          <Comments postId={postId} />
        </section>
      )}
    </div>
  );
};

export default Post;
