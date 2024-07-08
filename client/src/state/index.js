import { createSlice } from "@reduxjs/toolkit";

const intialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  postComments: {},
};

export const authSlice = createSlice({
  name: "auth",
  intialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent");
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post_id) return post;
      });
      state.posts = updatedPosts;
    },
    setPostComments: (state, action) => {
      const { post_id, comments } = action.payload;
      state.postComments[post_id] = comments;
    },
  },
});

export const {
  setMode,
  setLogin,
  setUser,
  setLogout,
  setFriends,
  setPosts,
  setPost,
  setPostComments,
} = authSlice.actions;
export default authSlice.reducer;
