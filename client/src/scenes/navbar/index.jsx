import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "../../state";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { picturePath } = user;

  return (
    <div className="navbar-container">
      <div className="search-bar-container">
        <span
          className="app-name desktop-headline-medium"
          onClick={() => navigate("/home")}
        >
          SparkNet
        </span>
        <div className="search-bar">
          <img className="search-icon" src="/assets/Search.svg"></img>
          <input
            type="text"
            className="search-input body-medium"
            placeholder="Search..."
          ></input>
        </div>
      </div>
      <div className="interactions-container">
        <img src="/assets/LightMode.svg" alt="" />
        <img src="/assets/ChatAlt2.svg" alt="" />
        <img src="/assets/BellOutline.svg" alt="" />
        <div className="profile-container">
          <div className="navbar-picture">
            <img
              src={
                picturePath
                  ? `http://localhost:3001/images/users/profile-pictures/${picturePath}`
                  : "/assets/default-user-picture.jpg"
              }
              alt=""
            />
          </div>
          <span className="navbar-username body-medium">{user.username}</span>
          <div className="profile-dropdown">
            <ul>
              <div>
                <li
                  onClick={() => {
                    navigate(`/profile/${user._id}`);
                    window.location.reload();
                  }}
                >
                  View profile
                </li>
              </div>
              <div>
                <li>Settings</li>
              </div>
              <div onClick={() => dispatch(setLogout())}>
                <li>Log out</li>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
