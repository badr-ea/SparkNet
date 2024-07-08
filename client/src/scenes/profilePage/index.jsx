import NavBar from "../navbar";
import Posts from "../../components/Posts";
import { Formik, Form, Field } from "formik";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../../state";
import { useParams } from "react-router-dom";

const initialValues = {
  username: "",
  location: "",
  occupation: "",
  profile: null,
  dashboard: null,
};

const ProfilePage = () => {
  const [profile, setProfile] = useState({});
  const user = useSelector((state) => state.user);
  const id = useSelector((state) => state.user._id);
  const { userId } = useParams();
  const { username, location, occupation, picturePath, dashboardPicturePath } =
    userId === id ? user : profile;
  const token = useSelector((state) => state.token);
  const [isEdit, setIsEdit] = useState(false);
  const dispatch = useDispatch();
  console.log(userId);

  const getUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/v1/users/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const user = await response.json();
        setProfile(user);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (userId !== id) {
      getUser();
    }
  }, [profile]);

  const handleProfileUpdate = async (values, { resetForm }) => {
    console.log(values);
    try {
      const formData = new FormData();
      formData.append("userId", id);
      formData.append("username", values.username);
      formData.append("occupation", values.occupation);
      formData.append("location", values.location);
      if (values.profile) {
        formData.append("profile", values.profile);
      }
      if (values.dashboard) {
        formData.append("dashboard", values.dashboard);
      }

      const response = await fetch("http://localhost:3001/api/v1/profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (response.ok) {
        const newUser = await response.json();
        if (userId === id) {
          dispatch(setUser(newUser));
        } else {
          setProfile(newUser);
        }
        resetForm();
      } else {
        console.error("Failed to update profile.");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleFileChange = (event, setFieldValue, fileName) => {
    const file = event.currentTarget.files[0];
    setFieldValue(fileName, file);
  };

  return (
    <div>
      <NavBar />
      <div className="profile-feed">
        <div className="dashboard">
          {isEdit && (
            <Formik
              initialValues={initialValues}
              onSubmit={handleProfileUpdate}
            >
              {({ setFieldValue, values }) => (
                <Form className="profile-edit-container">
                  <div>
                    <label htmlFor="username">Username</label>
                    <Field type="text" name="username" />
                  </div>
                  <div>
                    <label htmlFor="location">Location</label>
                    <Field type="text" name="location" />
                  </div>
                  <div>
                    <label htmlFor="occupation">Occupation</label>
                    <Field type="text" name="occupation" />
                  </div>
                  <div>
                    <label htmlFor="profile">Profile picture</label>
                    <input
                      type="file"
                      name="profile"
                      onChange={(e) =>
                        handleFileChange(e, setFieldValue, "profile")
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="dashboard">Dashboard picture</label>
                    <input
                      type="file"
                      name="dashboard"
                      onChange={(e) =>
                        handleFileChange(e, setFieldValue, "dashboard")
                      }
                    />
                  </div>
                  <button type="submit">Update</button>
                </Form>
              )}
            </Formik>
          )}
          {dashboardPicturePath && (
            <img
              src={`http://localhost:3001/images/users/dashboard-pictures/${dashboardPicturePath}`}
              alt=""
            />
          )}
        </div>
        <div className="profile-dashboard-container">
          <div className="profile-image">
            <img
              src={
                picturePath
                  ? `http://localhost:3001/images/users/profile-pictures/${picturePath}`
                  : "/assets/default-user-picture.jpg"
              }
              alt=""
            />
          </div>
          <div className="profile-info-container">
            <div className="profile-info">
              <div className="profile-name desktop-headline-small">
                {username}
              </div>
              <div className="profile-location">
                <img src="/assets/LocationMarkerOutline.svg" alt="" />
                <span>{location}</span>
              </div>
            </div>
          </div>
          <div className="profile-buttons">
            {id === userId ? (
              <div
                className="profile-edit body-large"
                onClick={() => setIsEdit(!isEdit)}
              >
                <img src="/assets/PencilOutline.svg" alt="" />
                <span>Update profile</span>
              </div>
            ) : (
              <div className="profile-add body-large">Add friend</div>
            )}
          </div>
        </div>
        <div className="posts-wrapper">
          <Posts userId={userId} isProfile={true} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
