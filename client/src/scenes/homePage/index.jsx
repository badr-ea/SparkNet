import NavBar from "../navbar";
import Posts from "../../components/Posts";
import CreatePost from "../../components/CreatePost";
import "../../index.css";
import { useSelector } from "react-redux";

const HomePage = () => {
  const { _id } = useSelector((state) => state.user);
  return (
    <div>
      <NavBar />
      <div className="homepage-feed">
        <CreatePost />
        <Posts userId={_id} />
      </div>
    </div>
  );
};

export default HomePage;
