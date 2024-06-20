const port = process.env.PORT || 4000;
const firebase = require("firebase");
const nodemailer = require("nodemailer");
const express = require("express");
const cors = require("cors");
const admin = require("./models/admin");
const axios = require("axios");
const Typo = require("typo-js");
const multer = require("multer");
const Storage = multer.memoryStorage();
const upload = multer({
  storage: Storage,
});
const User = require("./config");
const session = require("express-session");
const { createClient } = require("redis");
const RedisStore = require("connect-redis").default;
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
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Auto refresh livereload for All Files ===> there is script in package.json
if (process.env.NODE_ENV === 'development') {
  const livereload = require("livereload");
  const connectLivereload = require("connect-livereload");

  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch(path.join(__dirname, "public"));

  app.use(connectLivereload());

  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });
}
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

async function getCourses(lang) {
  // Assuming the language field in the courses document is named 'language'
  const coursesSnapshot = await db
    .collection("courses")
    .where("language", "==", lang)
    .get();
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

function getEmailVerificationMessage(lang) {
  if (lang === "en") {
    return "Please Verify your Email to Access the Courses Page.";
  } else {
    return "الرجاء التحقق من بريدك الإلكتروني للوصول إلى صفحة الدورات.";
  }
}

function getSignInMessage(lang) {
  if (lang === "en") {
    return "Please Sign In To Enter The Courses Page.";
  } else {
    return "الرجاء تسجيل الدخول للوصول إلى صفحة الدورات.";
  }
}

function getSignUpErrorMessage(error, lang) {
  let errorMessage = "An error occurred during sign up.";

  if (lang === "en") {
    if (error.code === "auth/email-already-exists") {
      errorMessage = "The email address is already in use by another account.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "The email address is invalid.";
    } else if (error.code === "auth/network-request-failed") {
      errorMessage =
        "There is a network issue. Please check your internet connection and try again.";
    } else if (error.code && error.code.includes("Network Error")) {
      errorMessage =
        "There was a problem connecting to the server. Please check your internet connection and try again.";
    } else if (error.message && error.message.includes("Network Error")) {
      errorMessage =
        "There was a problem connecting to the server. Please check your internet connection and try again.";
    }
  } else {
    // Assuming "ar" for Arabic
    if (error.code === "auth/email-already-exists") {
      errorMessage = "عنوان البريد الإلكتروني مستخدم بالفعل من قبل حساب آخر.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "عنوان البريد الإلكتروني غير صالح.";
    } else if (error.code === "auth/network-request-failed") {
      errorMessage =
        "هناك مشكلة في الشبكة. الرجاء التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.";
    } else if (error.code && error.code.includes("Network Error")) {
      errorMessage =
        "كان هناك مشكلة في الاتصال بالخادم. الرجاء التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.";
    } else if (error.message && error.message.includes("Network Error")) {
      errorMessage =
        "كان هناك مشكلة في الاتصال بالخادم. الرجاء التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.";
    }
  }

  return errorMessage;
}

setAdmin("sherefalex34@gmail.com");
setAdmin("omaradmin@gmail.com");
//////////////////////////////////////////////////////////////////////////////

const redisClient = createClient({
  password: "eVLuzcezIri8rpauQcx0ThNE2TkrUInE",
  socket: {
    host: "redis-17305.c11.us-east-1-2.ec2.redns.redis-cloud.com",
    port: 17305,
  },
});

redisClient.connect().catch(console.error);

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      sameSite: "strict",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
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

app.get("/unity", async (req, res) => {
  res.render("unity");
});

app.get("/courses", async (req, res) => {
  const user = req.session.userData;
  const lang = req.query.lang || req.cookies.lang || "en";

  if (user) {
    try {
      // Get the user record from Firebase Auth
      const userRecord = await admin.auth().getUser(user.userId);

      if (userRecord.emailVerified) {
        const language = lang === "ar" ? "arabic" : "english";
        const courses = await getCourses(language);
        res.render("courses", { user: user, courses: courses });
      } else {
        // Send email verification
        await sendEmail(userRecord.email);
        req.session.alertMessage = getEmailVerificationMessage(lang);
        res.redirect("/");
      }
    } catch (error) {
      if (lang === "en") {
        req.session.alertMessage = "The User Not Found";
      } else {
        req.session.alertMessage = "هذا المستخدم غير موجود";
      }
      res.redirect("/");
    }
  } else {
    req.session.msg = getSignInMessage(lang);
    res.redirect("/signIn");
  }
});

app.get("/courses/course_info", async (req, res) => {
  const user = req.session.userData;
  const lang = req.query.lang || req.cookies.lang || "en";
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
          if (lang === "en") {
            req.session.message = "Course not found";
          } else {
            req.session.message = "الدورة غير موجودة";
          }
          return res.redirect("/");
        }

        // Extract the course data
        const courseData = courseDoc.data();

        req.session.course = {
          Lessondescription: courseData.Lessondescription,
          listvideoUrl: courseData.listvideoUrl,
          language: courseData.language,
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

        req.session.alertMessage = getEmailVerificationMessage(lang);

        return res.redirect("/");
      }
    } catch (error) {
      console.error("Error finding course:", error);
      if (lang === "en") {
        req.session.message = "An error occurred while finding the course.";
      } else {
        req.session.message = "حدث خطأ أثناء البحث عن الدورة.";
      }
      return res.redirect("/");
    }
  } else {
    req.session.msg = getSignInMessage(lang);
    return res.redirect("/signIn");
  }
});

app.get("/courses/course_info/course_lessons", async (req, res) => {
  const user = req.session.userData;
  const courseId = req.query.course;
  const lang = req.query.lang || req.cookies.lang || "en";
  req.session.courseId = courseId;
  if (user) {
    // Get the user record from Firebase Auth
    const userRecord = await admin.auth().getUser(user.userId);

    if (userRecord.emailVerified) {
      const course = req.session.course;

      // Check if user exists, if not, create user document
      const userRef = admin.firestore().collection("Users").doc(user.userId);

      // Check if progress data exists for this course
      const courseProgressRef = userRef.collection("progress").doc(courseId);
      const courseProgressSnapshot = await courseProgressRef.get();
      let progressData;

      if (courseProgressSnapshot.exists) {
        // If progress data exists for this course, retrieve it
        progressData = courseProgressSnapshot.data().progress;
      } else {
        // If progress data doesn't exist for this course, create it for each video with initial values
        const initialProgressData = course.listvideoUrl.map((videoUrl) => ({
          videoUrl: videoUrl,
          currentTime: 0, // Initial current time
          duration: 0, // Initial duration
          progress: 0, // Initial progress
        }));

        // Save each video's progress data for this course in Firestore
        await courseProgressRef.set({ progress: initialProgressData });

        // Use the newly created progress data
        progressData = initialProgressData;
      }

      res.render("course-lessons", {
        course: course,
        user: user,
        courseId: courseId,
        progress: progressData,
      });
    } else {
      // Send email verification if progress data exists
      await sendEmail(userRecord.email);

      req.session.alertMessage = getEmailVerificationMessage(lang);

      res.redirect("/");
    }
  } else {
    req.session.msg = getSignInMessage(lang);
    res.redirect("/signIn");
  }
});

app.get("/courses/course_info/course_lessons/exercise", async (req, res) => {
  const user = req.session.userData;
  const lang = req.query.lang || req.cookies.lang || "en";
  if (user) {
    res.render("exercise");
  } else {
    if (lang === "en") {
      req.session.msg = "Please Sign in To Enter the Exercise";
    } else {
      req.session.msg = "يرجى تسجيل الدخول للدخول إلى التمرين";
    }
    res.redirect("/signIn");
  }
});

app.get("/courses/course_info/course_lessons/quiz", async (req, res) => {
  const user = req.session.userData;
  const lang = req.query.lang || req.cookies.lang || "en";
  if (user) {
    res.render("quiz");
  } else {
    if (lang === "en") {
      req.session.msg = "Please Sign in To Enter the Quiz";
    } else {
      req.session.msg = "يرجى تسجيل الدخول للدخول إلى الاختبار";
    }
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
  const user = req.session.userData;
  if (user) {
    res.redirect("/");
  } else {
    res.render("signUp");
  }
});

app.get("/profile", async (req, res) => {
  const user = req.session.userData;
  const PassMsg = req.session.PassMsg;

  if (user) {
    // Get user's progress data
    const userRef = admin.firestore().collection("Users").doc(user.userId);
    const progressSnapshot = await userRef.collection("progress").get();

    let courses = [];
    let courseProgressMap = new Map();

    // Iterate over progress documents to get course IDs and progress data
    const promises = progressSnapshot.docs.map(async (doc) => {
      const courseId = doc.id; // Assuming document ID is the course ID
      const progressArray = doc.data().progress;

      // Initialize progress data for the course if not already initialized
      if (!courseProgressMap.has(courseId)) {
        courseProgressMap.set(courseId, {
          totalProgress: 0,
          numProgressItems: 0,
        });
      }

      // Iterate over progress array to calculate total progress and count progress items
      progressArray.forEach((progressItem) => {
        let courseProgress = courseProgressMap.get(courseId);
        courseProgress.totalProgress += progressItem.progress;
        courseProgress.numProgressItems++;
      });

      // Fetch course details
      const courseDoc = await admin
        .firestore()
        .collection("courses")
        .doc(courseId)
        .get();

      if (courseDoc.exists) {
        const { imageUrl, name } = courseDoc.data();
        const course = {
          id: courseId,
          imageUrl,
          name,
        }; // Include progress data with course details
        courses.push(course);
      } else {
        console.log(`Course with ID ${courseId} not found.`);
      }
    });

    await Promise.all(promises);

    // Calculate average progress for each course
    courses = courses.map((course) => {
      const progressData = courseProgressMap.get(course.id);
      const averageProgress =
        progressData.numProgressItems !== 0
          ? progressData.totalProgress / progressData.numProgressItems
          : 0;
      return { ...course, averageProgress: averageProgress };
    });

    if (PassMsg) {
      delete req.session.PassMsg;
      res.render("profile", {
        user: user,
        courses: courses,
        PassMsg: PassMsg,
      });
    } else {
      res.render("profile", {
        user: user,
        courses: courses,
      });
    }
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
      const coursesSnapshot = await db.collection("courses").get();
      const courses = [];
      coursesSnapshot.forEach((doc) => {
        courses.push({ id: doc.id, ...doc.data() });
      });
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
  const courseId = req.query.courseId;

  try {
    const userRef = admin.firestore().collection("Users").doc(userId);
    const progressRef = userRef.collection("progress").doc(courseId);

    const progressSnapshot = await progressRef.get();
    const progressData = progressSnapshot.data()?.progress || [];

    // Find the index of the video in the progress array
    const videoIndex = progressData.findIndex(
      (item) => item.videoUrl === videoUrl
    );

    if (videoIndex !== -1) {
      // Video found, return its progress data
      const videoProgress = progressData[videoIndex];
      return res.status(200).json(videoProgress);
    } else {
      // Video not found, return default values
      return res.status(404).json({ currentTime: 0, progress: 0 });
    }
  } catch (error) {
    res.redirect(`/courses/course_info/course_lessons?course=${courseId}`);
  }
});

app.get("/play", (req, res) => {
  const video = req.query.video;
  res.render("play", { video: video });
});

app.post("/signIn", upload.none(), async (req, res) => {
  const user = req.body;
  const lang = req.query.lang || req.cookies.lang || "en";
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
    if (lang === "en") {
      req.session.msg = "Wrong Email or password";
    } else {
      req.session.msg = "خطأ في البريد الإلكتروني أو كلمة المرور";
    }
    res.redirect("/signIn");
  }
});

app.post("/signUp", upload.none(), async (req, res) => {
  const user = req.body;
  const lang = req.query.lang || req.cookies.lang || "en";
  try {
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

    // Step 3: Send Email
    sendEmail(user.email);

    // Step 4: Redirect to the signIn page
    res.redirect("/signIn");
  } catch (error) {
    console.error("Signup error:", error);
    req.session.msg = getSignUpErrorMessage(error, lang);
    res.redirect("/signIn");
  }
});

app.post("/reset", upload.none(), async (req, res) => {
  const userEmail = req.body.email;
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const lang = req.query.lang || req.cookies.lang || "en";

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
      if (lang === "en") {
        req.session.message =
          "We Will Send you an Email if your Account Exists.";
      } else {
        req.session.message =
          "سنرسل لك بريدًا إلكترونيًا إذا كان حسابك موجودًا.";
      }
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
  const lang = req.query.lang || req.cookies.lang || "en";
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
    if (lang === "en") {
      req.session.PassMsg = "Wrong Password Try Again";
    } else {
      req.session.PassMsg = "كلمة مرور خاطئة. الرجاء المحاولة مرة أخرى.";
    }
    res.redirect("/profile");
  }
});

app.post("/updateProgress", async (req, res) => {
  const userId = req.session.userData.userId;
  const { videoUrl, currentTime, duration, progress } = req.body;
  const courseId = req.session.courseId;

  try {
    const userRef = admin.firestore().collection("Users").doc(userId);
    const courseProgressRef = userRef.collection("progress").doc(courseId);

    // Retrieve the progress data for the course
    const courseProgressSnapshot = await courseProgressRef.get();
    let courseProgressData = courseProgressSnapshot.data().progress;

    // Find the index of the video in the progress array
    const videoIndex = courseProgressData.findIndex(
      (item) => item.videoUrl === videoUrl
    );

    if (videoIndex !== -1) {
      // If the video is found in the progress array
      if (progress > courseProgressData[videoIndex].progress) {
        // Update progress only if incoming progress is greater
        courseProgressData[videoIndex] = {
          videoUrl: videoUrl,
          currentTime: currentTime,
          duration: duration,
          progress: progress,
        };

        // Save the updated progress data for the course
        await courseProgressRef.set({ progress: courseProgressData });

        res.status(200).json({ message: "Progress updated successfully" });
      } else {
        res.status(200).json({
          message:
            "Progress not updated as it's less than or equal to existing progress",
        });
      }
    } else {
      res.status(404).json({ error: "Video not found in progress data" });
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
      course.language = course.language.toLowerCase();

      // Create a new document in the 'courses' collection
      await admin.firestore().collection("courses").add({
        code: course.code,
        language: course.language,
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
      console.log(error);
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

      if (course.language) {
        course.language = course.language.toLowerCase();
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
  if (lang !== "en") {
    const translations = i18n.getCatalog(lang);
    // Send the translations as JSON response
    res.json(translations);
  } else {
    const translations = "";
    // Send the translations as JSON response
    res.json(translations);
  }
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

app.post("/proxy-process", async (req, res) => {
  const input_text = req.body;
  console.log(input_text);

  try {
    const response = await axios.post(
      "https://18d8-102-42-140-48.ngrok-free.app/process_text",
      {
        input_text: input_text,
      }
    );
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while sending data to Flask API" });
  }
});

app.post('/uploadAudio', upload.single('audio'), (req, res) => {
  if (req.file) {
      res.json({ message: 'File uploaded successfully', file: req.file });
  } else {
      res.status(400).json({ message: 'File upload failed' });
  }
});
/////////////////////////////////////////////////////////////////////////////////////////////////

app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});
