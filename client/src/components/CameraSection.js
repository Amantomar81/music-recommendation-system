import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import "./cameraSection.css";
import cameraImage from "../assets/camera.jpg";
import SongCard from "../components/SongCard";
import axios from "axios";

const CameraSection = () => {
  const [webCam, setWebCam] = useState(false);
  const [isSongs, setIsSongs] = useState(false);
  const [image, setImage] = useState(null);
  const [songs, setSongs] = useState([]);
  const [emotion, setEmotion] = useState("");
  const webCamRef = useRef(null);

  const handleCapture = async () => {
    const imageSource = webCamRef.current.getScreenshot();

    setImage(imageSource);

    const formData = new FormData();
    formData.append("image", image);

    let headers = new Headers();

    // headers.append("Content-Type", "application/json");
    // headers.append("Accept", "application/json");

    // headers.append("Access-Control-Allow-Origin", "http://localhost:3333");
    // headers.append("Access-Control-Allow-Credentials", "true");

    // headers.append("GET", "POST", "OPTIONS");

    await fetch("/upload", {
      method: "POST",
      // headers: headers,
      body: formData,

    })
      .then((data) => data.json())
      .then((songs) => {
        setSongs(songs);
      })
      .catch((err) => console.log(err));

    // await fetch("/upload", {
    //   method: "POST",
    //   body: formData,
    // })
    //   .then((data) => data.json())
    //   .then((songs) => {
    //     setSongs(songs);
    //   })
    //   .catch((err) => console.log(err));

    // const data = response.json();

    // const response = await axios.post("/upload", imageSource, config);

    console.log(imageSource);
    console.log(songs);
    // setEmotion(songs);

    setWebCam(false);
    setIsSongs(true);
  };

  return (
    <div className="camera-section">
      <div className="container">
        <div className="row pb-5">
          <div className="col-lg-8">
            <div className="section-title">
              <h3
                id="camera"
                className="title"
                style={{
                  fontFamily: "Satisfy",
                  fontSize: "3rem",
                  color: "#ea34ff",
                }}
              >
                Our Music
              </h3>
            </div>
          </div>
          <div
            className="col-lg-4 text-left text-lg-right pt-2"
            style={{
              float: "right",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {/* <button
              className="login-butt px-4 py-1 mt-5 fs-5 rounded"
              style={{
                color: "white",
                textTransform: "uppercase",
                border: "none",
                height: "3rem",
              }}
              onClick={() => setWebCam(!webCam)}
            >
              try it. . .
            </button> */}
          </div>
        </div>
        <div className="row sec">
          <div className="col-lg-6">
            {webCam ? (
              <Webcam
                ref={webCamRef}
                // onClickCapture={handleCapture}
                className="camera"
              ></Webcam>
            ) : (
              // <img src={image} alt="" />
              <img src={cameraImage} alt="camera" className="camera" />
            )}
          </div>
          <div className="col-lg-6">
            <div className="about-text ps-5">
              <h3
                className="title"
                style={{
                  fontFamily: "Satisfy",
                  fontSize: "2.5rem",
                  color: "#ea34ff",
                }}
              >
                Capture facial expressions
              </h3>
              {/* <h1 style={{ fontSize: "3rem", textTransform: "uppercase" }}>
                The electro vibe
              </h1> */}
              <p style={{ fontSize: "18px", float: "left" }}>
                Ready to embark on a personalized music journey? Click on the
                "Try it" button and let MoodBeat's advanced facial expression
                recognition technology transform your music experience. Our
                system will capture your facial expressions, analyze your
                emotions, and curate a playlist tailored to your unique mood.
                Immerse yourself in the power of music and let{" "}
                <b>
                  <i>MoodBeat</i>
                </b>{" "}
                be your guide to a world of personalized melodies.
              </p>
              {webCam ? (
                <button
                  className="login-butt px-4 py-2 mt-3 fs-5 rounded"
                  style={{
                    color: "white",
                    textTransform: "uppercase",
                    border: "none",
                  }}
                  onClick={handleCapture}
                >
                  Capture
                </button>
              ) : (
                <button
                  className="login-butt px-4 py-2 mt-3 fs-5 rounded"
                  style={{
                    color: "white",
                    textTransform: "uppercase",
                    border: "none",
                  }}
                  onClick={() => setWebCam(!webCam)}
                >
                  try it . . .
                </button>
              )}
            </div>
          </div>
        </div>
        {isSongs && (
          <div className="row mt-5">
            {/* <h3 className="py-3">
              Emotion : <em>{emotion}</em>
            </h3> */}
            <ul>
              {songs.map((song) => (
                <SongCard song={song} key={song.name} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraSection;
