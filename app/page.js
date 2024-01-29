"use client";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [recording, setRecording] = useState(false);
  const [showLoadingDots, setShowLoadingDots] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [subtitle, setSubtitle] = useState("");
  const firstClickRef = useRef(true);

  const audioList = ["/1.mp3", "/2.mp3"];
  const subtitles = [
    "Did you eat any leafy greens today? And did you eat any fruits or vegetables?",
    "Well, that’s ok. Let’s aim small and try to eat 100 grams berries once this week to start building a habit. Why don’t we take a look at your sleep data?",
  ];
  const imageList = ["/image1.jpg", "/image2.jpg", "/image3.jpg"];

  function toggleRecording() {
    if (firstClickRef.current) {
      // Play the first audio clip on the first click
      new Audio(audioList[0]).play();
      setSubtitle(subtitles[0]);
      firstClickRef.current = false;
    } else {
      // Toggle recording state
      setRecording(!recording);

      if (recording) {
        // Simulate thinking phase
        setShowLoadingDots(true);
        setTimeout(() => {
          setShowLoadingDots(false);
          // Play the second audio clip after the thinking phase
          new Audio(audioList[1]).play();
          setSubtitle(subtitles[1]);

          // Start showing images 5 seconds after the 2nd clip starts
          setTimeout(() => {
            setShowImages(true);
          }, 10000);
        }, 2000); // Loading dots displayed for 2 seconds
      } else {
        // Hide images and subtitles when recording starts
        setShowImages(false);
        setSubtitle("");
      }
    }
  }

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === " ") {
        event.preventDefault();
        toggleRecording();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [recording]);

  useEffect(() => {
    let imageRotationInterval = null;

    if (showImages) {
      imageRotationInterval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageList.length);
      }, 5000); // Rotate images every 7 seconds
    }

    return () => {
      if (imageRotationInterval) {
        clearInterval(imageRotationInterval);
      }
    };
  }, [showImages, imageList.length]);

  return (
    <main className="flex h-screen flex-col items-center bg-gradient-to-t from-rose-600 via-red-500 to-red-600 text-white">
      <div className="flex flex-col items-center justify-center space-y-12 mt-[240px]">
        <button
          className={`h-[160px] w-[160px] rounded-full shadow-2xl bg-white ${
            recording ? "agent-circle" : ""
          }`}
          onClick={toggleRecording}
        ></button>
        {subtitle && (
          <p className="text-center text-lg max-w-md mx-auto">{subtitle}</p>
        )}
        {recording && (
          <div className="flex justify-center items-center space-x-4">
            <p className="text-4xl text-white font-bold">Listening...</p>
          </div>
        )}
        {showLoadingDots && (
          <div className="loading-dots flex justify-center items-center">
            <div></div>
            <div></div>
            <div></div>
          </div>
        )}
        {showImages && (
          <img
            className="w-[200px] rounded-2xl floating"
            src={imageList[currentImageIndex]}
            alt="Displayed Image"
          />
        )}
      </div>
    </main>
  );
}
