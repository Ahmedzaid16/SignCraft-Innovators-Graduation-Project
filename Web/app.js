const port = 4000;
const firebase = require("firebase");
const nodemailer = require("nodemailer");
const express = require("express");
const cors = require("cors");
const admin = require("./models/admin");
const axios = require("axios");
const Typo = require("typo-js");
const livereload = require("livereload");
const multer = require("multer");
const Storage = multer.memoryStorage();
const upload = multer({
  storage: Storage,
});
const User = require("./config");
const session = require("express-session");
const ffmpeg = require("ffmpeg");
const path = require("path");
const fs = require("fs");
const http = require("http");
const cookieParser = require("cookie-parser");
const i18n = require("./models/i18n");
const secretKey = require("./models/secretKey");
const { v4: uuidv4 } = require("uuid");
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

const setAdmin = async (email) => {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`Successfully set ${email} as an admin.`);
  } catch (error) {
    console.error("Error setting custom claims:", error);
  }
};

async function getCourses() {
  const coursesSnapshot = await db.collection("courses").get();
  const courses = [];
  coursesSnapshot.forEach((doc) => {
    courses.push({ id: doc.id, ...doc.data() });
  });
  return courses;
}

async function getUsers() {
  const snapshot = await db.collection("Users").get();
  const Users = [];

  // Use Promise.all to ensure all promises resolve before returning Users
  await Promise.all(
    snapshot.docs.map(async (doc) => {
      const userData = doc.data();

      try {
        const userRecord = await admin.auth().getUser(doc.id);
        userData.email = userRecord.email;
        userData.emailVerified = userRecord.emailVerified;
      } catch (error) {
        console.error("Error fetching user authentication details:", error);
      }

      Users.push({ id: doc.id, ...userData });
    })
  );

  return Users;
}

setAdmin("sherefalex34@gmail.com");
setAdmin("omaradmin@gmail.com");
//////////////////////////////////////////////////////////////////////////////

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
  const admin = req.session.adminData;
  const alertMessage = req.session.alertMessage;
  const Message = req.session.message;
  if (alertMessage) {
    delete req.session.alertMessage;
    res.render("index", { user: user, alertMessage: alertMessage });
  } else if (Message) {
    delete req.session.message;
    res.render("index", { user: user, message: Message });
  } else if (admin) {
    res.redirect("/control");
  } else if (user) {
    res.render("index", { user: user });
  } else {
    res.render("index");
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
        const courses = await getCourses();
        res.render("courses", { user: user, courses: courses });
      } else {
        // Send email verification
        await sendEmail(userRecord.email);

        req.session.alertMessage =
          "Please Verify your Email to Access the Courses Page.";
        res.redirect("/");
      }
    } catch (error) {
      req.session.alertMessage =
        "Please Verify your Email to Access the Courses Page.";
      res.redirect("/");
    }
  } else {
    req.session.msg = "Please Sign In To Enter The Courses Page.";
    res.redirect("/signIn");
  }
});

app.get("/courses/course_info", async (req, res) => {
  const user = req.session.userData;
  if (user) {
    const courseId = req.query.course;

    try {
      // Get the user record from Firebase Auth
      const userRecord = await admin.auth().getUser(user.userId);

      if (userRecord.emailVerified) {
        // Query the database to find the course with the provided courseId
        const courseDoc = await db.collection("courses").doc(courseId).get();

        if (!courseDoc.exists) {
          // If no course found with the provided courseId, return an error
          req.session.message = "Course not found with the provided course ID.";
          return res.redirect("/");
        }

        // Extract the course data
        const courseData = courseDoc.data();

        req.session.course = {
          Lessondescription: courseData.Lessondescription,
          listvideoUrl: courseData.listvideoUrl,
          name: courseData.name,
          duration: courseData.duration,
        };

        // Return the course data in the response
        return res.render("course-info", {
          user: user,
          courseData: courseData,
          courseId: courseId,
        });
      } else {
        // Send email verification
        await sendEmail(userRecord.email);

        req.session.alertMessage =
          "Please Verify your Email to Access the Courses.";
        return res.redirect("/");
      }
    } catch (error) {
      console.error("Error finding course:", error);
      req.session.message = "An error occurred while finding the course.";
      return res.redirect("/");
    }
  } else {
    req.session.msg = "Please Sign In To Enter The Courses Page.";
    return res.redirect("/signIn");
  }
});

app.get("/courses/course_info/course_lessons", async (req, res) => {
  const user = req.session.userData;
  if (user) {
    // Get the user record from Firebase Auth
    const userRecord = await admin.auth().getUser(user.userId);

    if (userRecord.emailVerified) {
      const course = req.session.course;

      // Check if user exists, if not, create user document
      const userRef = admin.firestore().collection("Users").doc(user.userId);

      // Check if progress data exists
      const progressRef = userRef.collection("progress");
      const progressSnapshot = await progressRef.get();
      let progressData = progressSnapshot.docs.map((doc) => doc.data());

      if (progressData.length === 0) {
        // If progress data doesn't exist, create it for each video with initial values
        const initialProgressData = course.listvideoUrl.map((videoUrl) => ({
          videoUrl: videoUrl,
          currentTime: 0, // Initial current time
          duration: 0, // Initial duration
          progress: 0, // Initial progress
        }));

        // Save each video's progress data in Firestore
        const batch = admin.firestore().batch();
        initialProgressData.forEach((data) => {
          const progressDocRef = progressRef.doc(
            encodeURIComponent(data.videoUrl)
          );
          batch.set(progressDocRef, data);
        });
        await batch.commit();

        // Use the newly created progress data
        progressData = initialProgressData;
        console.log(progressData);
      }

      res.render("course-lessons", {
        course: course,
        user: user,
        progress: progressData,
      });
    } else {
      // Send email verification if progress data exists
      await sendEmail(userRecord.email);

      req.session.alertMessage =
        "Please Verify your Email to Access the Courses.";
      res.redirect("/");
    }
  } else {
    req.session.msg = "Please Sign In To Enter The Courses Page.";
    res.redirect("/signIn");
  }
});

app.get("/signIn", async (req, res) => {
  const user = req.session.userData;
  const admin = req.session.adminData;
  const msg = req.session.msg;
  if (msg) {
    delete req.session.msg;
    res.render("signIn", { msg: msg });
  } else if (user) {
    res.redirect("/");
  } else if (admin) {
    res.redirect("/control");
  } else {
    res.render("signIn");
  }
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
  const user = req.session.adminData;
  const msgAdmin = req.session.msgAdmin;
  try {
    const idTokenResult = await admin.auth().verifyIdToken(user.idToken);

    if (idTokenResult.admin) {
      if (msgAdmin) {
        delete req.session.msgAdmin;
        res.render("controlCourses", { msgAdmin: msgAdmin });
      } else {
        res.render("controlCourses");
      }
    } else {
      req.session.message = "Access denied. Admins only.";
      res.redirect("/");
    }
  } catch (error) {
    req.session.msg = "Access denied. Admins only.";
    res.redirect("/signIn");
  }
});

app.get("/control/controlCoursesView", async (req, res) => {
  const user = req.session.adminData;
  const msgAdmin = req.session.msgAdmin;
  try {
    const idTokenResult = await admin.auth().verifyIdToken(user.idToken);

    if (idTokenResult.admin) {
      const courses = await getCourses();
      if (msgAdmin) {
        delete req.session.msgAdmin;
        res.render("controlCoursesView", {
          courses: courses,
          msgAdmin: msgAdmin,
        });
      } else {
        res.render("controlCoursesView", { courses: courses });
      }
    } else {
      req.session.message = "Access denied. Admins only.";
      res.redirect("/");
    }
  } catch (error) {
    req.session.msg = "Access denied. Admins only.";
    res.redirect("/signIn");
  }
});

app.get("/control/controlCoursesAccount", async (req, res) => {
  const user = req.session.adminData;
  const msgAdmin = req.session.msgAdmin;
  try {
    const idTokenResult = await admin.auth().verifyIdToken(user.idToken);

    if (idTokenResult.admin) {
      const users = await getUsers();
      if (msgAdmin) {
        delete req.session.msgAdmin;
        res.render("controlCoursesAccount", {
          users: users,
          msgAdmin: msgAdmin,
        });
      } else {
        res.render("controlCoursesAccount", { users: users });
      }
    } else {
      req.session.message = "Access denied. Admins only.";
      res.redirect("/");
    }
  } catch (error) {
    req.session.msg = "Access denied. Admins only.";
    res.redirect("/signIn");
  }
});

app.get("/getProgress", async (req, res) => {
  const userId = req.session.userData.userId;
  const videoUrl = req.query.videoUrl;
  try {
    const encodedVideoUrl = encodeURIComponent(videoUrl);
    const userRef = admin.firestore().collection("Users").doc(userId);
    const progressRef = userRef.collection("progress").doc(encodedVideoUrl);

    const progressSnapshot = await progressRef.get();
    const progressData = progressSnapshot.data();

    if (progressData) {
      res.status(200).json(progressData);
    } else {
      res.status(200).json({ currentTime: 0, progress: 0 });
    }
  } catch (error) {
    console.error("Error fetching progress:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/play", (req, res) => {
  const video = req.query.video;
  res.render("play", { video: video });
});

app.post("/signIn", upload.none(), async (req, res) => {
  const user = req.body;
  try {
    // Step 1: Authenticate the user
    const userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password);
    const idToken = await userCredential.user.getIdToken();
    const idTokenResult = await userCredential.user.getIdTokenResult();

    if (idTokenResult.claims.admin) {
      // User is an admin
      req.session.adminData = {
        idToken: idToken,
      };
      res.redirect("/control");
    } else {
      const userId = userCredential.user.uid;

      // Step 2: Retrieve additional user data from Firestore
      const userDoc = await db.collection("Users").doc(userId).get();
      if (!userDoc.exists) {
        throw new Error("User data not found");
      }
      const userData = userDoc.data();

      // Store user data in session
      req.session.userData = {
        idToken: idToken,
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
    }
  } catch (error) {
    req.session.msg = "Wrong Email or password";
    res.redirect("/signIn");
  }
});

app.post("/signUp", upload.none(), async (req, res) => {
  try {
    const user = req.body;

    // Step 1: Create the user in Firebase Authentication
    const userCredential = await admin.auth().createUser({
      email: user.email,
      password: user.password,
    });

    const userId = userCredential.uid;

    // Step 2: Create user document in Firestore
    const avatarUrl = "/images/dark-avatar.jpg"; // Use the provided avatar URL
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
    req.session.msg = "The Email Address is Already in Use by Another Account";
    res.redirect("/signIn");
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

app.post("/updateProgress", async (req, res) => {
  const userId = req.session.userData.userId;
  const { videoUrl, currentTime, duration, progress } = req.body;
  try {
    const encodedVideoUrl = encodeURIComponent(videoUrl);
    const userRef = admin.firestore().collection("Users").doc(userId);
    const progressRef = userRef.collection("progress").doc(encodedVideoUrl);

    const progressSnapshot = await progressRef.get();
    const progressData = progressSnapshot.data();

    if (!progressData || progressData.progress < progress) {
      await progressRef.set({
        videoUrl: videoUrl,
        currentTime: currentTime,
        duration: duration,
        progress: progress,
      });

      res.status(200).json({ message: "Progress updated successfully" });
    } else {
      res.status(200).json({
        message: "Progress not updated as it's less than existing progress",
      });
    }
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post(
  "/create-course",
  upload.fields([
    { name: "imageUrl", maxCount: 1 },
    { name: "videoUrl", maxCount: 1 },
    { name: "listvideoUrl" },
  ]),
  async (req, res) => {
    try {
      const course = req.body;
      const files = req.files;
      const playlistName = course.name;

      const imageUrlFile = files["imageUrl"][0];
      const videoUrlFile = files["videoUrl"][0];
      const listvideoUrlFiles = files["listvideoUrl"];

      if (!imageUrlFile || !videoUrlFile || !listvideoUrlFiles) {
        return res
          .status(400)
          .send("Thumbnails, Course Intro video, or Playlist not uploaded.");
      }

      // Check if course with provided code already exists
      const courseSnapshot = await admin
        .firestore()
        .collection("courses")
        .where("code", "==", course.code)
        .get();

      if (!courseSnapshot.empty) {
        req.session.msgAdmin = "Course with the provided code already exists";
        return res.redirect("/control");
      }

      const uploadFile = async (file, fileNamePrefix, name) => {
        const fileName = name
          ? `${fileNamePrefix}/${name}/${Date.now()}-${file.originalname}`
          : `${fileNamePrefix}/${Date.now()}-${file.originalname}`;
        const fileUpload = bucket.file(fileName);
        const stream = fileUpload.createWriteStream({
          metadata: { contentType: file.mimetype },
        });

        return await new Promise((resolve, reject) => {
          stream.on("error", reject);
          stream.on("finish", async () => {
            const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${
              bucket.name
            }/o/${encodeURIComponent(fileName)}?alt=media`;
            resolve(fileUrl);
          });
          stream.end(file.buffer);
        });
      };

      const [imageUrl, videoUrl, listvideoUrl] = await Promise.all([
        uploadFile(imageUrlFile, "thumbnails"),
        uploadFile(videoUrlFile, "intros"),
        Promise.all(
          listvideoUrlFiles.map((file) =>
            uploadFile(file, "playlists", playlistName)
          )
        ),
      ]);

      course.imageUrl = imageUrl;
      course.videoUrl = videoUrl;
      course.listvideoUrl = listvideoUrl;

      course.Lessondescription = course.Lessondescription.split(/\r?\n/);

      // Create a new document in the 'courses' collection
      await admin.firestore().collection("courses").add({
        code: course.code,
        name: course.name,
        duration: course.duration,
        lesson: course.lesson,
        Lessondescription: course.Lessondescription,
        categories: course.categories,
        description: course.description,
        imageUrl: course.imageUrl,
        videoUrl: course.videoUrl,
        listvideoUrl: course.listvideoUrl,
      });
      req.session.msgAdmin = "Course Create Successfully";
      res.redirect("/control");
    } catch (error) {
      req.session.msgAdmin = "Error creating course";
      res.redirect("/control");
    }
  }
);

app.post("/deleteCourse", upload.none(), async (req, res) => {
  const password = req.body.password;
  const courseId = req.body.courseId;
  const user = req.session.adminData;

  try {
    // Verify the ID token
    const idTokenResult = await admin.auth().verifyIdToken(user.idToken);

    // Get the user's email from the token
    const userEmail = idTokenResult.email;

    // Sign in the user with email and password
    await firebase.auth().signInWithEmailAndPassword(userEmail, password);

    // Retrieve the course document to get the URLs
    const courseDoc = await db.collection("courses").doc(courseId).get();
    if (!courseDoc.exists) {
      throw new Error("Course not found");
    }
    const courseData = courseDoc.data();

    // Helper function to delete a file from Firebase Storage
    const deleteFile = async (fileUrl) => {
      if (fileUrl && fileUrl.startsWith("https://")) {
        const fileName = decodeURIComponent(
          fileUrl.split("/o/")[1].split("?alt=media")[0]
        );
        await bucket.file(fileName).delete();
      }
    };

    // Delete associated files
    await Promise.all([
      deleteFile(courseData.imageUrl),
      deleteFile(courseData.videoUrl),
      ...(courseData.listvideoUrl || []).map(async (url) => {
        if (url !== "Video Deleted") {
          await deleteFile(url);
        }
      }),
    ]);

    // Delete the course document from Firestore
    await db.collection("courses").doc(courseId).delete();

    req.session.msgAdmin = "Course Deleted Successfully";
    res.redirect("/control/controlCoursesView");
  } catch (error) {
    console.error("Error deleting course:", error);
    req.session.msgAdmin = "Wrong Password Or Error Deleting Course";
    res.redirect("/control/controlCoursesView");
  }
});

app.post("/deleteUser", upload.none(), async (req, res) => {
  const password = req.body.password;
  const userId = req.body.userId;
  const user = req.session.adminData;

  try {
    // Verify the ID token
    const idTokenResult = await admin.auth().verifyIdToken(user.idToken);

    // Get the user's email from the token
    const userEmail = idTokenResult.email;

    // Sign in the user with email and password
    await firebase.auth().signInWithEmailAndPassword(userEmail, password);

    // Get the user's avatar URL from the database
    const userDoc = await db.collection("Users").doc(userId).get();
    const userData = userDoc.data();
    const avatarUrl = userData.avatarUrl;

    // Check if the avatar URL is not the default dark avatar
    if (avatarUrl !== "/images/dark-avatar.jpg") {
      // Decode the file name from the avatar URL
      const fileName = decodeURIComponent(
        avatarUrl.split("/o/")[1].split("?alt=media")[0]
      );

      // Delete the file from Firebase Storage
      await bucket.file(fileName).delete();
    }

    // Delete user data from Firestore
    await db.collection("Users").doc(userId).delete();

    // Delete user authentication
    await admin.auth().deleteUser(userId);

    req.session.msgAdmin = "User Deleted Successfully";
    res.redirect("/control/controlCoursesAccount");
  } catch (error) {
    req.session.msgAdmin = "Wrong Password Or Error Deleting User";
    res.redirect("/control/controlCoursesAccount");
  }
});

app.post(
  "/updateCourse",
  upload.fields([
    { name: "imageUrl", maxCount: 1 },
    { name: "videoUrl", maxCount: 1 },
    { name: "listvideoUrl" },
  ]),
  async (req, res) => {
    try {
      const course = req.body;
      const files = req.files;
      const courseId = course.courseId;

      const playlistName = course.name || "default_playlist_name";

      const courseDoc = await db.collection("courses").doc(courseId).get();
      const currentCourseData = courseDoc.data();

      const deleteOldFile = async (fileUrl) => {
        if (fileUrl) {
          const fileName = decodeURIComponent(
            fileUrl.split("/o/")[1].split("?alt=media")[0]
          );
          await bucket.file(fileName).delete();
        }
      };

      // Check and delete the old image if a new one is uploaded
      if (files["imageUrl"]?.[0]) {
        await deleteOldFile(currentCourseData.imageUrl);
      }

      // Check and delete the old video if a new one is uploaded
      if (files["videoUrl"]?.[0]) {
        await deleteOldFile(currentCourseData.videoUrl);
      }

      const uploadFile = async (file, fileNamePrefix, name) => {
        if (!file) return null; // Skip upload if file is not provided

        const fileName = name
          ? `${fileNamePrefix}/${name}/${Date.now()}-${file.originalname}`
          : `${fileNamePrefix}/${Date.now()}-${file.originalname}`;
        const fileUpload = bucket.file(fileName);
        const stream = fileUpload.createWriteStream({
          metadata: { contentType: file.mimetype },
        });

        return await new Promise((resolve, reject) => {
          stream.on("error", reject);
          stream.on("finish", async () => {
            const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${
              bucket.name
            }/o/${encodeURIComponent(fileName)}?alt=media`;
            resolve(fileUrl);
          });
          stream.end(file.buffer);
        });
      };

      const [imageUrl, videoUrl, newListvideoUrls] = await Promise.all([
        uploadFile(files["imageUrl"]?.[0], "thumbnails"),
        uploadFile(files["videoUrl"]?.[0], "intros"),
        files["listvideoUrl"]
          ? Promise.all(
              files["listvideoUrl"].map((file) =>
                uploadFile(file, "playlists", playlistName)
              )
            )
          : [],
      ]);

      if (imageUrl) course.imageUrl = imageUrl;
      if (videoUrl) course.videoUrl = videoUrl;

      // Append new video URLs to the existing list
      const existingListvideoUrls = currentCourseData.listvideoUrl || [];
      course.listvideoUrl = [...existingListvideoUrls, ...newListvideoUrls];

      if (course.Lessondescription) {
        course.Lessondescription = course.Lessondescription.split(/\r?\n/);
      }

      delete course.courseId; // Remove courseId from the course object
      delete course.choose;

      // Remove empty fields from the course object
      Object.keys(course).forEach((key) => {
        if (course[key] === "" || course[key] == null) {
          delete course[key];
        }
      });

      await db.collection("courses").doc(courseId).update(course);

      req.session.msgAdmin = "Course Updated Successfully";
      res.redirect("/control/controlCoursesView");
    } catch (error) {
      console.error("Error updating course:", error);
      req.session.msgAdmin = "Error Updating Course";
      res.redirect("/control/controlCoursesView");
    }
  }
);

app.post("/deleteVideo", upload.none(), async (req, res) => {
  const password = req.body.password;
  const courseId = req.body.courseId;
  const videoUrl = req.body.videoUrl;
  const user = req.session.adminData;

  try {
    // Verify the ID token
    const idTokenResult = await admin.auth().verifyIdToken(user.idToken);

    // Get the user's email from the token
    const userEmail = idTokenResult.email;

    // Sign in the user with email and password
    await firebase.auth().signInWithEmailAndPassword(userEmail, password);

    // Extract the file name from the video URL
    const fileName = decodeURIComponent(
      videoUrl.split("/o/")[1].split("?alt=media")[0]
    );

    // Delete the file from Firebase Storage
    await bucket.file(fileName).delete();

    const courseDoc = await db.collection("courses").doc(courseId).get();

    const courseData = courseDoc.data();
    const updatedListvideoUrl = courseData.listvideoUrl.slice(); // create a copy of the array

    // Find the index of the video URL and replace it with Video Deleted
    const index = updatedListvideoUrl.indexOf(videoUrl);
    if (index !== -1) {
      updatedListvideoUrl[index] = "Video Deleted";
    }

    await db
      .collection("courses")
      .doc(courseId)
      .update({ listvideoUrl: updatedListvideoUrl });

    req.session.msgAdmin = "Video Deleted Successfully";
    res.redirect("/control/controlCoursesView");
  } catch (error) {
    console.log(error);
    req.session.msgAdmin = "Wrong Password Or Error Deleting Video";
    res.redirect("/control/controlCoursesView");
  }
});

app.post("/editVideo", upload.single("newVideo"), async (req, res) => {
  const courseId = req.body.courseId;
  const oldVideoUrl = req.body.videoUrl;
  const playList = req.body.playList;

  try {
    const newVideo = req.file;
    let newFileName;

    if (oldVideoUrl !== "Video Deleted" && oldVideoUrl !== "") {
      // Extract the file name from the old video URL
      const oldFileName = decodeURIComponent(
        oldVideoUrl.split("/o/")[1].split("?alt=media")[0]
      );

      // Extract the default playlist name
      const playlistName = oldFileName.split("/")[1];

      // Delete the old file from Firebase Storage
      await bucket.file(oldFileName).delete();

      // Construct the new file name using the extracted playlist name
      newFileName = `playlists/${playlistName}/${Date.now()}-${
        newVideo.originalname
      }`;
    } else {
      newFileName = `playlists/${playList}/${Date.now()}-${
        newVideo.originalname
      }`;
    }

    const fileUpload = bucket.file(newFileName);
    const stream = fileUpload.createWriteStream({
      metadata: { contentType: newVideo.mimetype },
    });

    const newVideoUrl = await new Promise((resolve, reject) => {
      stream.on("error", reject);
      stream.on("finish", async () => {
        const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURIComponent(newFileName)}?alt=media`;
        resolve(fileUrl);
      });
      stream.end(newVideo.buffer);
    });

    // Update the Firestore document to replace the old video URL with the new one
    const courseDoc = await db.collection("courses").doc(courseId).get();

    const courseData = courseDoc.data();
    const updatedListvideoUrl = courseData.listvideoUrl.slice(); // create a copy of the array

    // Find the index of the old video URL and replace it with the new one
    const index = updatedListvideoUrl.indexOf(oldVideoUrl);
    if (index !== -1) {
      updatedListvideoUrl[index] = newVideoUrl;
    } else {
      // If the old video URL is not found, add the new video URL to the end of the list
      updatedListvideoUrl.push(newVideoUrl);
    }

    await db
      .collection("courses")
      .doc(courseId)
      .update({ listvideoUrl: updatedListvideoUrl });

    req.session.msgAdmin = "Video Edit Successfully";
    res.redirect("/control/controlCoursesView");
  } catch (error) {
    console.log(error);
    req.session.msgAdmin = "Wrong Password Or Error Editing Video";
    res.redirect("/control/controlCoursesView");
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

//*********************************** Models ***************************************** //
/////////////////////////////////////////////////////////////////////////////////////////////////
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

/////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});
