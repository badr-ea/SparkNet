require("dotenv").config();
require("express-async-errors");

const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();
const path = require("path");
const {
  uploadPost,
  upload,
  uploadMem,
  saveFileToDisk,
} = require("./multerConfig");
const verifyToken = require("./middleware/auth");
//
const connectDB = require("./db/connect");
// routes
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const { createPost } = require("./controllers/posts");
const { updateUserProfile } = require("./controllers/users");

app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());
app.use(xss());

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/comments", commentsRouter);

app.post(
  "/api/v1/posts",
  verifyToken,
  uploadPost.single("picture"),
  createPost
);

app.post(
  "/api/v1/profile",
  verifyToken,
  uploadMem.fields([{ name: "profile" }, { name: "dashboard" }]),
  async (req, res, next) => {
    console.log(req.body);
    try {
      if (req.files) {
        console.log("start");
        if (req.files["profile"]) {
          const profileFile = req.files["profile"][0];
          req.body.profileBuffer = profileFile.buffer;
          const profileFilename = await saveFileToDisk(profileFile);
          req.body.profileFilename = profileFilename;
          if (req.files["dashboard"]) {
            const dashboardFile = req.files["dashboard"][0];

            req.body.dashboardBuffer = dashboardFile.buffer;

            console.log(req.body);

            const dashboardFilename = await saveFileToDisk(dashboardFile);

            req.body.dashboardFilename = dashboardFilename;
          }
        }
      }

      next();
    } catch (error) {
      // Handle any errors
      console.log("Image already exists:");
      next();
    }
  },
  updateUserProfile
);

const PORT = process.env.PORT || 3001;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, console.log(`Server is listening on port ${PORT}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
