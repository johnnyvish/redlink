"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [listening, setListening] = useState(false);
  const [audioData, setAudioData] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  useEffect(() => {
    if (listening) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const newMediaRecorder = new MediaRecorder(stream);
          setMediaRecorder(newMediaRecorder);
          let chunks = [];
          newMediaRecorder.ondataavailable = (event) => chunks.push(event.data);
          newMediaRecorder.onstop = () => {
            const newAudioData = new Blob(chunks, {
              type: "audio/mp3",
            });
            setAudioData(newAudioData);
            playAudio(newAudioData);
          };
          newMediaRecorder.start();
        })
        .catch((error) => console.error("Audio recording error:", error));
    } else if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
  }, [listening]);

  const playAudio = (audioBlob) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play().catch((e) => {
      console.error("Error playing audio:", e);
    });
  };

  return (
    <main className="flex justify-center items-center h-screen bg-gradient-to-t from-rose-600 via-red-500 to-red-600">
      <div className="flex flex-col justify-center items-center space-y-12">
        <div
          className={`rounded-full w-[180px] h-[180px] bg-white ${
            listening ? "animation-listening" : ""
          }`}
          onClick={() => setListening(!listening)}
        ></div>
        <h2
          className={`text-4xl font-bold text-white ${
            listening ? "visible" : "invisible"
          }`}
        >
          Listening...
        </h2>
      </div>
    </main>
  );
}
