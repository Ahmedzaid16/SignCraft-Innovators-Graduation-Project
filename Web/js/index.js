const firebase = require("firebase");
const nodemailer = require("nodemailer");
const express = require("express");
const cors = require("cors");
const User = require("./config");
const admin = require("firebase-admin");
const bodyParser1 = require("body-parser");
const serviceAccount = require("../signlanguage-users-firebase-adminsdk-dr983-e842fc39df.json");
const multer = require("multer");
const ffmpeg = require ('ffmpeg');
const fs = require ('fs');
const http = require ('http');
const upload = multer(); // You can pass options to configure multer if needed
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
const app = express();
app.use(bodyParser1.json({ limit: "50mb" }));
app.use(bodyParser1.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  const snapshot = await User.get();
  const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.send(list);
});

app.post("/create", async (req, res) => {
  const data = req.body;
  try {
    // Step 1: Authenticate the user
    const userCredential = await admin.auth().createUser({
      email: data.email,
      password: data.password,
    });

    const userId = userCredential.uid;

    // Step 2: Create user document in Firestore
    const result = await User.doc(userId).set({
      username: data.username,
      gender: data.gender,
      isSignLanguageSpeaker: data.isSignLanguageSpeaker,
      emailVerified: false,
    });

    // Step 3: Send email verification
    // Send the link using nodemailer
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
      to: data.email,
      subject: "Email Verification",
      html:
        "<p>Please click on the following link to verify your email address:</p>" +
        '<a href="http://127.0.0.1:5501/verify.html' +
        '">Email Verification' +
        "</a>",
    };

    await transporter.sendMail(mailOptions);

    res.send({ userId: userId });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ msg: "Error adding user" });
  }
});

app.post("/sendemail", async (req, res) => {
  const userEmail = req.body.email; // Change variable name here

  try {
    const user = await admin.auth().getUserByEmail(userEmail); // Change variable name here
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
        to: userEmail, // Use the correct variable name here
        subject: "ResetPassword",
        html: `<p>Please click on the following link to reset your password:</p>
          <a href="http://127.0.0.1:5501/reset-password.html?email=${userEmail}">ResetPassword</a>`,
      };
      await transporter.sendMail(mailOptions);
      res.send({ userEmail: userEmail });
      // Rest of your code for sending the email
    } else {
      res.status(404).json({ msg: "User email not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

app.post("/upload", upload.single("avatar"), async (req, res) => {
  const file = req.file;

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
        const userId = req.body.userId; // Assuming you include the user ID in the request body
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURIComponent(fileName)}?alt=media`;

        // Update the user's data in the Firestore database with the new avatar URL
        await User.doc(userId).update({ avatarUrl: imageUrl });

        res.status(200).json({ msg: "Image uploaded successfully", imageUrl });
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

app.post("/signin", async (req, res) => {
  // Extract email and password from the request body
  const email = req.body.email;
  const password = req.body.password;

  try {
    // Step 1: Authenticate the user
    const userCredential = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);

    const userId = userCredential.user.uid;

    // Step 2: Retrieve additional user data from Firestore
    const userDoc = await User.doc(userId).get();

    if (userDoc.exists) {
      // User found, respond with user data
      const userData = userDoc.data();
      res.send({ userId: userId });
    } else {
      res.status(404).send({ msg: "User not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(401).send({ msg: "Invalid email or password" });
  }
});

app.post("/getemail", async (req, res) => {
  const userId = req.body.userId;

  try {
    const userRecord = await admin.auth().getUser(userId);

    // If the user email is found, send it in the response
    if (userRecord.email) {
      const email = userRecord.email;
      res.json({ email });
    } else {
      // If the user email is not found, send a 404 status
      res.status(404).json({ msg: "User email not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

app.post("/uploadAvatar", async (req, res) => {
  // Change to POST
  try {
    const userId = req.body.id;

    const userDoc = await admin
      .firestore()
      .collection("Users")
      .doc(userId)
      .get();

    if (userDoc.exists) {
      // Check if document exists
      const avatarUrl = userDoc.data().avatarUrl; // Access data property

      if (avatarUrl) {
        res.json({ avatarUrl: avatarUrl });
      } else {
        res.json({ avatarUrl: "images/dark-avatar.jpg" });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/update", async (req, res) => {
  const id = req.body.id;
  const updatedData = req.body.data; // Access the updated data property
  await User.doc(id).update(updatedData);
  res.send({ msg: "Updated" });
});

app.post("/verifyEmail", async (req, res) => {
  try {
    const userId = req.body.userId;
    await User.doc(userId).update({ emailVerified: true });
    res.send({ msg: "Email Varified" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Can not Verify your Email" });
  }
});

app.post("/check", async (req, res) => {
  try {
    const userId = req.body.userId;
    const userDoc = await User.doc(userId).get();
    if (userDoc.exists) {
      // Check if document exists
      const check = userDoc.data().emailVerified;
      res.send({ check });
    } else {
      res.send({ msg: userId });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "while check" });
  }
});

app.post("/updatePass", async (req, res) => {
  const id = req.body.id;
  const email = req.body.email;
  const newPassword = req.body.newPassword;
  const currentPassword = req.body.currentPassword;

  try {
    const credentials = await firebase
      .auth()
      .signInWithEmailAndPassword(email, currentPassword);
    // If authentication is successful, update the password
    await credentials.user.updatePassword(newPassword);

    res.send({ msg: "Password updated successfully!" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).send({ msg: "An error occurred while updating password" });
  }
});

app.post("/resetPass", async (req, res) => {
  const userEmail = req.body.email;
  const newPassword = req.body.newPassword;

  try {
    const user = await admin.auth().getUserByEmail(userEmail);

    // Update user properties, including password
    await admin.auth().updateUser(user.uid, {
      password: newPassword,
    });

    res.send({ msg: "Password updated successfully!" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).send({ msg: "An error occurred while updating password" });
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.id;
  await User.doc(id).delete();
  res.send({ msg: "Deleted" });
});

const Typo = require("typo-js");
// Create a dictionary for the English language
const dictionary = new Typo("en_US");

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

const bodyParser = require("body-parser");
const { spawn } = require("child_process");

app.post("/correct", async (req, res) => {
  var inputText = req.body.text;
  console.log(inputText);

  // Execute the Python script
  const pythonProcess = spawn("python", ["js/spell_correction.py", inputText]);

  let correctedText = "";

  // Collect data from the Python process
  pythonProcess.stdout.on("data", (data) => {
    correctedText += data;
  });

  // Handle errors
  pythonProcess.stderr.on("data", (data) => {
    console.error(`Error: ${data}`);
  });

  // When the process exits
  pythonProcess.on("close", (code) => {
    console.log(`Python process exited with code ${code}`);
    console.log(correctedText);
    res.json(correctedText); // Send the corrected text back to the client
  });
});

// ----------------------- admin section -------------------------------

const { v4: uuidv4 } = require("uuid");

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

const db = admin.firestore();
// Endpoint to fetch course data from Firebase Firestore
app.get("/courses", async (req, res) => {
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

app.use(express.urlencoded({ extended: true }));
// Update course info endpoint
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

app.listen(4000, () => console.log("Up & Running *4000"));
