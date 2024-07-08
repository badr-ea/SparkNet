import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { setPostComments } from "../state";
import Comment from "./Comment";

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const postComments = useSelector((state) => state.postComments);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const getPostComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/v1/comments/${postId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getPostComments();
  }, []);
  return (
    <>
      {comments.map(({ id, userId, content, username, picturePath }) => {
        return (
          <Comment
            key={id}
            userId={userId}
            username={username}
            content={content}
            picturePath={picturePath}
          />
        );
      })}
    </>
  );
};

export default Comments;
