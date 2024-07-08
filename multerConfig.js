const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const generateUniqueFilename = (file) => {
  const hash = crypto.createHash("md5");
  const filename = hash.update(file.buffer).digest("hex");
  return filename + path.extname(file.originalname);
};

const fileExists = (destination, filename) => {
  const filePath = path.join(destination, filename);
  return fs.existsSync(filePath);
};

const saveFileToDisk = async (file) => {
  const destination = `public/images/users/${file.fieldname}-pictures`;
  const uniqueFilename = generateUniqueFilename(file);
  const filePath = path.join(destination, uniqueFilename);

  try {
    if (!fileExists(destination, uniqueFilename)) {
      await fs.promises.writeFile(filePath, file.buffer);
    } else {
      console.log("File already exist");
    }
    return uniqueFilename;
  } catch (error) {
    console.error(`Error saving file: ${error.message}`);
    return uniqueFilename;
  }
};

const postStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/posts");
  },
  filename: (req, file, cb) => {
    req.body.picturePath = Date.now() + "-" + file.originalname;
    cb(null, req.body.picturePath);
  },
});

const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fieldname = file.fieldname;
    let destination = "";

    if (fieldname === "profile") {
      destination = "public/images/users/profile-pictures";
    } else if (fieldname === "dashboard") {
      destination = "public/images/users/dashboard-pictures";
    }

    cb(null, destination);
  },
  filename: (req, file, cb) => {
    console.log(req.body);
    const fieldname = file.fieldname;
    let destination = "";
    let buffer;

    if (fieldname === "profile") {
      destination = "public/images/users/profile-pictures";
      buffer = req.body.profileBuffer;
    } else if (fieldname === "dashboard") {
      destination = "public/images/users/dashboard-pictures";
      buffer = req.body.dashboardBuffer;
    }

    let uniqueFilename = generateUniqueFilename(file, buffer);

    if (!fileExists(destination, uniqueFilename)) {
      cb(null, uniqueFilename);
    } else {
      cb(new Error("File already exists"));
    }
  },
});

const memStorage = multer.memoryStorage();
const uploadMem = multer({ storage: memStorage });

const uploadPost = multer({ storage: postStorage });
const upload = multer({ storage: uploadStorage });
module.exports = { uploadPost, upload, uploadMem, saveFileToDisk };
