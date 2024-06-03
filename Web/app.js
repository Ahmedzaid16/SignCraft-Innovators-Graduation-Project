const port = 4000;
const firebase = require("firebase");
const nodemailer = require("nodemailer");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const axios = require("axios");
const Typo = require("typo-js");
// const bodyParser1 = require("body-parser");
const serviceAccount = require("./signlanguage-users-firebase-adminsdk-dr983-e842fc39df.json");
const livereload = require("livereload");
const multer = require("multer");
const Storage = multer.memoryStorage();
const upload = multer({
  storage: Storage,
});
const User = require("./public/js/config");
const session = require("express-session");
const ffmpeg = require("ffmpeg");
const path = require("path");
const fs = require("fs");
const http = require("http");
const cookieParser = require("cookie-parser");
const i18n = require("./models/i18n");
const secretKey = require("./models/secretKey");
const { v4: uuidv4 } = require("uuid");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://signlanguage-users.appspot.com",
});
const {
  getUserByEmail,
  updatePassword,
  signInWithEmailAndPassword,
} = require("firebase/auth");
const { auth } = require("firebase");
const storage = admin.storage();
const bucket = storage.bucket();
const db = admin.firestore();
const dictionary = new Typo("en_US");
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(i18n.init);
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Auto refresh livereload for All Files ===> there is script in package.json
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));

const connectLivereload = require("connect-livereload");
app.use(connectLivereload());

liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
//////////////////////////////////////////////////////////////////////////////

// fection to send Email
async function sendEmail(userEmail) {
  // Step 3: Generate the email verification link
  const verificationLink = await admin
    .auth()
    .generateEmailVerificationLink(userEmail);

  // Step 4: Send the email verification link using Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: "signlanguage568@gmail.com",
      pass: "revg gkmi visi kdet",
    },
  });

  const mailOptions = {
    from: "signlanguage568@gmail.com",
    to: userEmail,
    subject: "Email Verification",
    html: `<p>Please click on the following link to verify your email address:</p>
     <a href="${verificationLink}">Email Verification</a>`,
  };
  await transporter.sendMail(mailOptions);
}

app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Set to true if in production
      httpOnly: true, // Helps prevent cross-site scripting (XSS) attacks
      sameSite: "strict", // Helps prevent CSRF attacks
    },
  })
);
////////////////////////////////////////////////////////////////////////////
// Render home page and handle the token and avatarUrl if available
app.get("/", (req, res) => {
  const user = req.session.userData;
  const alertMessage = req.session.alertMessage;
  const Message = req.session.message;
  if (alertMessage) {
    delete req.session.alertMessage;
    res.render("index", { user: user, alertMessage: alertMessage });
  } else if (Message) {
    delete req.session.message;
    res.render("index", { user: user, message: Message });
  } else {
    res.render("index", { user: user });
  }
});

app.get("/translate", async (req, res) => {
  const user = req.session.userData;
  res.render("translate", { user: user });
});

app.get("/courses", async (req, res) => {
  const user = req.session.userData;

  if (user) {
    try {
      // Get the user record from Firebase Auth
      const userRecord = await admin.auth().getUser(user.userId);

      if (userRecord.emailVerified) {
        res.render("courses", { user: user });
      } else {
        // Send email verification
        await sendEmail(userRecord.email);

        req.session.alertMessage =
          "Please Verify your Email to Access the Courses.";
        res.redirect("/");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(400).send({ msg: "Error fetching user data" });
    }
  } else {
    res.redirect("/");
  }
});

app.get("/courses/course_info", async (req, res) => {
  res.render("course-info");
});

app.get("/courses/course_info/course_lessons", async (req, res) => {
  res.render("course-lessons");
});

app.get("/signIn", async (req, res) => {
  const msg = req.session.msg;
  delete req.session.msg;
  res.render("signIn", { msg: msg });
});

app.get("/signUp", async (req, res) => {
  res.render("signUp");
});

app.get("/profile", async (req, res) => {
  const user = req.session.userData;
  const PassMsg = req.session.PassMsg;
  if (PassMsg) {
    delete req.session.PassMsg;
    res.render("profile", { user: user, PassMsg: PassMsg });
  } else if (user) {
    res.render("profile", { user: user });
  } else {
    res.redirect("/");
  }
});

app.get("/reset", async (req, res) => {
  res.render("reset");
});

// GET /reset/reset_password endpoint
app.get("/reset/reset_password", async (req, res) => {
  const userId = req.query.userId;
  res.render("reset-password", { userId: userId });
});

app.get("/support", async (req, res) => {
  res.render("courses");
});

app.get("/logout", (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).send("Error logging out");
    } else {
      res.redirect("/");
    }
  });
});

app.get("/control", async (req, res) => {
  res.render("controlCourses");
});

app.get("/control/controlCoursesView", async (req, res) => {
  res.render("controlCoursesView");
});

app.get("/control/controlCoursesAccount", async (req, res) => {
  res.render("controlCoursesAccount");
});

app.post("/signIn", upload.none(), async (req, res) => {
  const user = req.body;
  try {
    // Step 1: Authenticate the user
    const userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password);
    const userId = userCredential.user.uid;

    // Step 2: Retrieve additional user data from Firestore
    const userDoc = await db.collection("Users").doc(userId).get();
    if (!userDoc.exists) {
      throw new Error("User data not found");
    }
    const userData = userDoc.data();

    // Store user data in session
    req.session.userData = {
      userId: userId,
      username: userData.username,
      gender: userData.gender,
      avatarUrl: userData.avatarUrl,
      isSignLanguageSpeaker: userData.isSignLanguageSpeaker,
      email: user.email,
      emailVerified: userCredential.user.emailVerified,
    };

    // Step 3: Redirect to the home page
    res.redirect("/");
  } catch (error) {
    req.session.msg = "Wrong Email or password";
    res.redirect("/signIn");
  }
});

app.post("/signUp", upload.none(), async (req, res) => {
  try {
    const user = req.body;
    console.log("Received user data:", user);

    // Step 1: Create the user in Firebase Authentication
    const userCredential = await admin.auth().createUser({
      email: user.email,
      password: user.password,
    });

    const userId = userCredential.uid;

    // Step 2: Create user document in Firestore
    const avatarUrl = "./images/dark-avatar.jpg"; // Use the provided avatar URL
    await db.collection("Users").doc(userId).set({
      username: user.username,
      gender: user.gender,
      avatarUrl: avatarUrl,
      isSignLanguageSpeaker: user.isSignLanguageSpeaker,
    });

    //step 3: Send Email
    sendEmail(user.email);

    // Step 4: Redirect to the signIn page
    res.redirect("/signIn");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ msg: "Error adding user" });
  }
});

app.post("/reset", upload.none(), async (req, res) => {
  const userEmail = req.body.email;
  // Construct the base URL from the request object
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  try {
    const user = await admin.auth().getUserByEmail(userEmail);
    const userId = user.uid;
    if (user) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
          user: "signlanguage568@gmail.com",
          pass: "revg gkmi visi kdet",
        },
      });

      const mailOptions = {
        from: "signlanguage568@gmail.com",
        to: userEmail,
        subject: "ResetPassword",
        html: `<p>Please click on the following link to reset your password:</p>
          <a href="${baseUrl}/reset/reset_password?userId=${userId}">ResetPassword</a>`,
      };
      await transporter.sendMail(mailOptions);
      req.session.message = "We Will Send you an Email if your Account Exist";
      res.redirect("/");
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

app.post("/reset/reset_password", upload.none(), async (req, res) => {
  const userId = req.body.userId;
  const newPassword = req.body.password;

  try {
    // Update user properties, including password
    await admin.auth().updateUser(userId, {
      password: newPassword,
    });

    res.redirect("/signIn");
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).send("An error occurred while updating password");
  }
});

app.post("/Upload_Avatar", upload.single("avatar"), async (req, res) => {
  console.log(req.file);
  const file = req.file;

  if (!file) {
    return res.status(400).send({ msg: "No file uploaded." });
  }

  try {
    // Upload the image to Firebase Storage
    const fileName = `avatars/${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);
    const stream = fileUpload.createWriteStream();

    stream.on("error", (error) => {
      console.error("Error uploading image to Firebase Storage:", error);
      res.status(500).send({ msg: "Error uploading image" });
    });

    stream.on("finish", async () => {
      try {
        // Set the image URL in the user data
        const userId = req.session.userData.userId;
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURIComponent(fileName)}?alt=media`;

        // Update the user's data in the Firestore database with the new avatar URL
        await db
          .collection("Users")
          .doc(userId)
          .update({ avatarUrl: imageUrl });
        req.session.userData.avatarUrl = imageUrl;
        res.redirect("/profile");
      } catch (updateError) {
        console.error("Error updating user data:", updateError);
        res.status(500).json({ msg: "Error updating user data" });
      }
    });

    // Pipe the file stream to Firebase Storage
    stream.end(file.buffer);
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ msg: "Error uploading image" });
  }
});

app.post("/Update_User", upload.none(), async (req, res) => {
  try {
    const { username, gender } = req.body;
    const userId = req.session.userData.userId;

    // Update the user data in the database
    await db.collection("Users").doc(userId).update({ username, gender });
    req.session.userData.username = username;
    req.session.userData.gender = gender;
    // Redirect back to the profile page
    res.redirect("/profile");
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/Update_Password", upload.none(), async (req, res) => {
  const email = req.body.email;
  const newPassword = req.body.NewPassword;
  const currentPassword = req.body.CurrentPassword;

  try {
    const credentials = await firebase
      .auth()
      .signInWithEmailAndPassword(email, currentPassword);
    // If authentication is successful, update the password
    await credentials.user.updatePassword(newPassword);

    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        res.status(500).send("Error logging out");
      } else {
        res.redirect("/signIn");
      }
    });
  } catch (error) {
    req.session.PassMsg = "Wrong Password Try Again";
    res.redirect("/profile");
  }
});

//***********************************Change Language***************************************** //
/////////////////////////////////////////////////////////////////////////////////////////////////
// Middleware to set language based on user preference
app.use((req, res, next) => {
  const lang = req.query.lang || req.cookies.lang || "en";
  i18n.setLocale(req, lang);
  res.cookie("lang", lang, { maxAge: 900000, httpOnly: true });
  console.log(`Locale set to: ${lang}`);
  next();
});

app.get("/translations", (req, res) => {
  // Get the language from the query parameter or default to "en"
  const lang = req.query.lang || "en";
  // Get all keys and values for the specified language
  const translations = i18n.getCatalog(lang);
  // Send the translations as JSON response
  res.json(translations);
});

/////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/delete", async (req, res) => {
  const id = req.body.id;
  await db.collection("Users").doc(id).delete();
  res.send({ msg: "Deleted" });
});

app.post("/search", async (req, res) => {
  const inputText = req.body.text;
  // Split the input text into words
  const words = inputText.split(/\s+/);

  // Correct each word using the dictionary
  const correctedWords = words.map(
    (word) => dictionary.suggest(word)[0] || word
  );

  // Join the corrected words back into a string
  const correctedText = correctedWords.join(" ");

  res.json({ correctedText });
});

app.post("/proxy-correct", async (req, res) => {
  try {
    const response = await axios.post(
      "http://shifo2001.pythonanywhere.com/correct",
      req.body
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error correcting spelling");
  }
});

// ----------------------- admin section -------------------------------

app.post("/create-course", async (req, res) => {
  const data = req.body;
  const imageBase64 = data.image;

  try {
    // Generate a unique filename for the image
    const imageName = uuidv4() + ".jpg";

    // Upload image to Firebase Storage
    const storageRef = admin
      .storage()
      .bucket()
      .file("images/" + imageName);
    const base64EncodedImage = imageBase64.replace(
      /^data:image\/\w+;base64,/,
      ""
    );
    const imageBuffer = Buffer.from(base64EncodedImage, "base64");

    await storageRef.save(imageBuffer, {
      metadata: {
        contentType: "image/jpeg",
      },
    });

    // Get the URL of the uploaded image
    const imageUrlArray = await storageRef.getSignedUrl({
      action: "read",
      expires: "03-09-2491", // Set an expiration date or duration
    });

    const imageUrl = imageUrlArray[0];

    // Create a new document in the 'courses' collection
    await admin.firestore().collection("courses").add({
      code: data.code,
      name: data.name,
      lesson: data.lesson,
      categories: data.categories,
      description: data.description,
      imageUrl: imageUrl,
    });

    res.status(200).json({ msg: "Course created successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ msg: "Error creating course" });
  }
});

// Endpoint to fetch course data from Firebase Firestore
app.get("/course", async (req, res) => {
  try {
    const coursesSnapshot = await db.collection("courses").get();
    const courses = [];
    coursesSnapshot.forEach((doc) => {
      courses.push({ ...doc.data() });
    });
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Error fetching courses" });
  }
});

app.get("/Users", async (req, res) => {
  try {
    const snapshot = await db.collection("Users").get();
    const Users = [];
    snapshot.forEach((doc) => {
      Users.push({ ...doc.data() });
    });
    res.json(Users);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Define the findcourse endpoint
app.post("/findcourse", async (req, res) => {
  const coursecode = req.body.code;

  try {
    // Query the database to find the course with the provided courseLink
    const courseSnapshot = await db
      .collection("courses")
      .where("code", "==", coursecode)
      .get();

    if (courseSnapshot.empty) {
      // If no course found with the provided courseLink, return an error
      res
        .status(404)
        .json({ msg: "Course not found with the provided coursecode." });
      return;
    }

    // Extract the course data
    const courseData = courseSnapshot.docs[0].data();

    // Return the course data in the response
    res.json(courseData);
  } catch (error) {
    console.error("Error finding course:", error);
    res.status(500).json({ msg: "An error occurred while finding course." });
  }
});

app.post("/updateCourse", async (req, res) => {
  const code = req.body.code; // Extract the course code from the request body
  const updatedData = req.body.updatedData; // Extract the updated course data
  const imageBase64 = req.body.imageBase64; // Extract the base64-encoded image data

  try {
    // Search for the course with the provided code
    const courseSnapshot = await db
      .collection("courses")
      .where("code", "==", code)
      .get();

    if (courseSnapshot.empty) {
      // If no course found with the provided code, return an error
      res.status(404).json({ msg: "Course not found with the provided code." });
      return;
    }

    // Generate a unique filename for the image
    const imageName = uuidv4() + ".jpg";

    // Upload image to Firebase Storage
    const storageRef = admin
      .storage()
      .bucket()
      .file("images/" + imageName);
    const base64EncodedImage = imageBase64.replace(
      /^data:image\/\w+;base64,/,
      ""
    );
    const imageBuffer = Buffer.from(base64EncodedImage, "base64");

    await storageRef.save(imageBuffer, {
      metadata: {
        contentType: "image/jpeg",
      },
    });

    // Get the URL of the uploaded image
    const imageUrlArray = await storageRef.getSignedUrl({
      action: "read",
      expires: "03-09-2491", // Set an expiration date or duration
    });

    const imageUrl = imageUrlArray[0];

    // Add imageUrl to the updatedData
    updatedData.imageUrl = imageUrl;

    // Update the course information
    const courseId = courseSnapshot.docs[0].id; // Assuming only one course is found
    await db.collection("courses").doc(courseId).update(updatedData);

    res.status(200).json({ msg: "Course updated successfully." });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ msg: "An error occurred while updating course." });
  }
});

// Update course info endpoint
app.post("/updateCourseinfo", upload.single("video"), async (req, res) => {
  // Extract course data from the request body
  const { duration, Lessondescription, code } = req.body;
  const video = req.file;

  try {
    // Search for the course with the provided code
    const courseSnapshot = await db
      .collection("courses")
      .where("code", "==", code)
      .get();

    if (courseSnapshot.empty) {
      // If no course found with the provided code, return an error
      return res
        .status(404)
        .json({ msg: "Course not found with the provided code." });
    }

    // Convert the Lessondescription back to an array
    const lessonDescriptionArray = JSON.parse(Lessondescription);
    // Generate a unique filename for the video
    const videoName = uuidv4() + ".mp4";

    // Upload video to Firebase Storage
    const storageRef = admin
      .storage()
      .bucket()
      .file("courseVideos/" + videoName);
    const videoBuffer = video.buffer;
    await storageRef.save(videoBuffer, {
      metadata: {
        contentType: "video/mp4",
      },
    });

    // Get the URL of the uploaded video
    const videoUrlArray = await storageRef.getSignedUrl({
      action: "read",
      expires: "03-09-2491", // Set an expiration date or duration
    });

    const videoUrl = videoUrlArray[0];

    // Update the course information
    const courseId = courseSnapshot.docs[0].id; // Assuming only one course is found
    await db.collection("courses").doc(courseId).update({
      duration,
      Lessondescription: lessonDescriptionArray,
      videoUrl,
    });

    return res.status(200).json({ msg: "Course updated successfully." });
  } catch (error) {
    console.error("Error updating course:", error);
    return res
      .status(500)
      .json({ msg: "An error occurred while updating course." });
  }
});

app.post("/updateCourseVideos", upload.array("videos"), async (req, res) => {
  // Extract course code from the request body
  const code = req.body.code;
  // Extract course videos from the request
  const videos = req.files;

  try {
    // Search for the course with the provided code
    const courseSnapshot = await db
      .collection("courses")
      .where("code", "==", code)
      .get();

    if (courseSnapshot.empty) {
      // If no course found with the provided code, return an error
      return res
        .status(404)
        .json({ msg: "Course not found with the provided code." });
    }

    // Array to store video URLs
    const videoUrls = [];

    // Loop through each uploaded video
    for (const video of videos) {
      // Generate a unique filename for the video
      const videoName = uuidv4() + ".mp4";

      // Upload video to Firebase Storage
      const storageRef = admin
        .storage()
        .bucket()
        .file("courseVideos/" + videoName);
      const videoBuffer = video.buffer;
      await storageRef.save(videoBuffer, {
        metadata: {
          contentType: "video/mp4",
        },
      });

      // Get the URL of the uploaded video
      const videoUrl = await storageRef.getSignedUrl({
        action: "read",
        expires: "03-09-2491", // Set an expiration date or duration
      });

      // Push the video URL to the array
      videoUrls.push(videoUrl[0]);
    }

    // Update the course information to add the new video URLs to the array
    const courseId = courseSnapshot.docs[0].id; // Assuming only one course is found
    const courseData = courseSnapshot.docs[0].data();

    // Check if the course already has a list of videos
    const existingVideos = courseData.listvideoUrl || [];
    // Concatenate the new video URLs with the existing array
    const updatedVideos = existingVideos.concat(videoUrls);

    await db.collection("courses").doc(courseId).update({
      listvideoUrl: updatedVideos,
    });

    return res.status(200).json({ msg: "Course updated successfully." });
  } catch (error) {
    console.error("Error updating course:", error);
    return res
      .status(500)
      .json({ msg: "An error occurred while updating course." });
  }
});

app.post("/deleteCourse", async (req, res) => {
  const code = req.body.code; // Extract the course code from the request body

  try {
    // Search for the course with the provided code
    const courseSnapshot = await db
      .collection("courses")
      .where("code", "==", code)
      .get();

    if (courseSnapshot.empty) {
      // If no course found with the provided code, return an error
      res.status(404).json({ msg: "Course not found with the provided code." });
      return;
    }

    // Delete the course
    const courseId = courseSnapshot.docs[0].id; // Assuming only one course is found
    await db.collection("courses").doc(courseId).delete();

    res.status(200).json({ msg: "Course deleted successfully." });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ msg: "An error occurred while deleting course." });
  }
});

app.post("/updateProgress", async (req, res) => {
  const { userId, videoUrl, currentTime, duration, progress } = req.body;
  try {
    // Encode the video URL to create a valid document ID
    const encodedVideoUrl = encodeURIComponent(videoUrl);
    // Check if user exists, if not, create user document
    const userRef = admin.firestore().collection("Users").doc(userId);
    // Check if progress data exists
    const progressSnapshot = await userRef
      .collection("progress")
      .doc(encodedVideoUrl)
      .get();

    let progressData = progressSnapshot.data();
    if (progressData.progress < progress) {
      // Store progress data in Firebase Firestore
      await db
        .collection("Users")
        .doc(userId)
        .collection("progress")
        .doc(encodedVideoUrl) // Use encoded URL
        .set({
          currentTime: currentTime,
          duration: duration,
          progress: progress,
        });

      res.status(200).json({ message: "Progress updated successfully" });
    }
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ error: error.message }); // Specific error message
  }
});

app.post("/getProgress", async (req, res) => {
  const { userId, videoUrl } = req.body;

  try {
    const encodedVideoUrl = encodeURIComponent(videoUrl);
    // Check if user exists, if not, create user document
    const userRef = admin.firestore().collection("Users").doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      await userRef.set({});
    }

    // Check if progress data exists
    const progressSnapshot = await userRef
      .collection("progress")
      .doc(encodedVideoUrl)
      .get();
    let progressData = progressSnapshot.data();

    if (!progressData) {
      // If progress data doesn't exist, create it with initial values
      const initialProgressData = {
        currentTime: 0, // Initial current time
        duration: 0, // Initial duration
        progress: 0, // Initial progress
      };

      await userRef
        .collection("progress")
        .doc(encodedVideoUrl)
        .set(initialProgressData);

      // Retrieve the newly created progress data
      progressData = initialProgressData;
    }

    // Send progress data to the client
    res.status(200).json(progressData);
  } catch (error) {
    console.error("Error retrieving or creating progress data:", error);
    res.status(500).json({ error: "An error occurred" }); // Sending generic error message to client
  }
});

app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});
