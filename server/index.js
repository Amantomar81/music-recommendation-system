const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const Song = require("./models/song");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const multer = require("multer");
require("dotenv").config();
const { runEmotionDetection } = require('./temp.js');

const { spawn } = require("child_process");
const childPython = spawn("python", ["algo.py"]);

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("DB connected");
  })
  .catch((e) => {
    console.log(e);
  });

// const upload = multer({
//   dest: "./uploads/",
// });

app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); //Destination folder for storing images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Renaming the file to include timestamp
  },
});

// Initialize multer middleware
const upload = multer({ storage });

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    // Check if image data is present in the request
    if (!req.body.image) {
      return res.status(400).send("No image data provided");
    }

    const image = req.body.image;

    // Remove the data URI prefix from the image data
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    // Create a buffer from the base64 data
    const dataBuffer = Buffer.from(base64Data, "base64");

    // Ensure the directory for uploads exists
    fs.mkdirSync("./uploads", { recursive: true });

    // Define the filename for the uploaded image
    const filename = "image.jpg"; // You can modify this as needed

    // Define the path to save the image
    const filePath = path.join("./uploads", filename);

    // Write the image data to the file
    fs.writeFile(filePath, dataBuffer, async (err) => {
      if (err) {
        console.error("Error saving image:", err);
        return res.status(500).send("Error saving image");
      }

      console.log("Image saved successfully.");

      try {
        // Call runEmotion and wait for the result
        console.log("1");
         const result = await runEmotionDetection();
         console.log("Emotion detected:",result);
         console.log("2");
        // Fetch songs from the database based on the detected emotion
        // const resss = result.trim();
        const songs = await Song.find({emotion:result});
        // console.log(JSON.stringify(214));
       // const songs = await processEmotionAndFetchSongs();
        console.log("Songs fetched based on emotion:", songs);
        // Send the response with the fetched songs
        res.send(songs);
      } catch (error) {
        console.error("Error detecting emotion:", error);
        res.status(500).send("Error detecting emotion");
      }
    });
  } catch (error) {
    console.error("Error:", error);
    // Handle error if necessary
    res.status(500).send("Internal Server Error");
  }
});


app.listen(process.env.PORT, () => {
  console.log(`server is running at port ${process.env.PORT}`);
});




runEmotionDetection()
    .then((result) => {
        // Use the result here
        result = result.trim();
        console.log("Emotion detection result:", `"${result}"`);
        console.log("3");
    })
    .catch((error) => {
        // Handle errors here
        console.error("Error:", error);
    });