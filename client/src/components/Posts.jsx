import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setPosts } from "../state";
import Post from "./Post";

const Posts = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  console.log(token);
  console.log(posts);
  const getPosts = async () => {
    console.log("start");
    try {
      const response = await fetch("http://localhost:3001/api/v1/posts/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data);
      dispatch(setPosts({ posts: data }));
    } catch (error) {}
  };
  const getUserPosts = async () => {
    try {
      console.log("test");
      const response = await fetch(
        `http://localhost:3001/api/v1/posts/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!isProfile) {
      getPosts();
    } else getUserPosts();
  }, []);

  return (
    <>
      {Array.isArray(posts) &&
        posts.map(
          ({
            _id,
            userId,
            username,
            description,
            location,
            picturePath,
            userPicturePath,
            likes,
            comments,
          }) => (
            <Post
              key={_id}
              postId={_id}
              userId={userId}
              username={username}
              description={description}
              location={location}
              picturePath={picturePath}
              userPicturePath={userPicturePath}
              likes={likes}
              comments={comments}
            />
          )
        )}
    </>
  );
};

export default Posts;
