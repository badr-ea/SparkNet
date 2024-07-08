import { useNavigate } from "react-router-dom";

const Comment = ({ content, username, picturePath, userId }) => {
  const pictureUrl = "http://localhost:3001/images/users/profile-pictures/";
  const navigate = useNavigate();

  return (
    <div className="post-comment-container">
      <div className="post-user-picture">
        <img
          src={
            picturePath
              ? `${pictureUrl}${picturePath}`
              : "/assets/default-user-picture.jpg"
          }
          alt=""
        />
      </div>
      <div className="post-comment">
        <span
          className="body-small"
          onClick={() => navigate(`/profile/${userId}`)}
        >
          {username}
        </span>
        <div className="comment-content">{content}</div>
      </div>
    </div>
  );
};

export default Comment;
