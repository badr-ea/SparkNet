import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../state";
import "../index.css";

const CreatePost = () => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState("");
  const [image, setImage] = useState(null);
  const [post, setPost] = useState("");
  const { picturePath } = useSelector((state) => state.user);
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const pictureUrl = "http://localhost:3001/images/users/profile-pictures/";

  const handlePost = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("description", post);
      if (image) {
        formData.append("picture", image);
      }
      if (!image && !post) {
        throw new Error("No content provided");
      }
      const response = await fetch("http://localhost:3001/api/v1/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (response.status === 201) {
        const posts = await response.json();
        console.log(posts);
        dispatch(setPosts({ posts }));
        setImage(null);
        setPost("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="post-wrapper">
      <div className="post-input-container">
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
        <div className="post-input">
          <input
            type="text"
            className="search-input body-medium"
            placeholder="What's on your mind?"
            onChange={(e) => setPost(e.target.value)}
            value={post}
          ></input>
        </div>
      </div>
      <hr />
      {isImage && (
        <div>
          <input
            type="file"
            name="picture"
            id=""
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
      )}
      <div className="create-wrapper">
        <div className="create-image">
          <img
            src="/assets/Picture.svg"
            alt=""
            onClick={() => setIsImage(!isImage)}
          />
          <span onClick={() => setIsImage(!isImage)}>Images</span>
        </div>
        <div className="create-post-button" onClick={handlePost}>
          POST
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
