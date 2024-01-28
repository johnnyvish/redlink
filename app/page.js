"use client"

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [recording, setRecording] = useState(false);
  const [showLoadingDots, setShowLoadingDots] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImages, setShowImages] = useState(false);
  const prevLoadingState = useRef(showLoadingDots);
  const firstClickRef = useRef(true);
  const imageDisplayTimeoutRef = useRef(null);
  const [isPlayingPartTwo, setIsPlayingPartTwo] = useState(false);

  
  const audioList = [
    '/1.mp3',
    '/2.mp3',
    '/3.mp3',
    '/4.mp3',
    '/5.mp3',
    '/6.mp3',
  ];
  const imageList = [
    '/image1.jpg',
    '/image2.jpg',
    '/image3.jpg',
  ];

  function toggleRecording() {
    if (firstClickRef.current) {
      new Audio(audioList[0]).play();
      firstClickRef.current = false;
      setCurrentAudioIndex(1);
    } else {
      setRecording(!recording);
      setShowImages(false); // Hide images when recording starts
      if (recording) {
        setShowLoadingDots(true);
        const randomTime = Math.random() * (4000 - 3000) + 3000;
        setTimeout(() => setShowLoadingDots(false), randomTime);
      }
    }
  }  

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === ' ') {
        event.preventDefault();
        toggleRecording();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [recording]);

  useEffect(() => {
    if (prevLoadingState.current && !showLoadingDots && !firstClickRef.current && !isPlayingPartTwo) {
      const audio = new Audio(audioList[currentAudioIndex]);
      audio.play();

      if (currentAudioIndex === 2) {
        audio.onended = () => {
          setShowLoadingDots(true);
          setIsPlayingPartTwo(true);

          setTimeout(() => {
            const nextAudio = new Audio('/3_part_2.mp3');
            nextAudio.play();
            nextAudio.onended = () => {
              setIsPlayingPartTwo(false);
            };

            setShowLoadingDots(false);
            setShowImages(true);
            setCurrentImageIndex(0);
          }, 5000);
        };
      } else {
        setShowImages(false);
      }

      if (!isPlayingPartTwo) {
        const nextIndex = (currentAudioIndex + 1) % audioList.length;
        setCurrentAudioIndex(nextIndex);
      }
    }
    prevLoadingState.current = showLoadingDots;
  }, [showLoadingDots, currentAudioIndex, isPlayingPartTwo]);

  useEffect(() => {
    let imageRotationInterval = null;
  
    if (showImages) {
      imageRotationInterval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageList.length);
      }, 7000); // Rotate images every 5 seconds
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
          className={`h-[160px] w-[160px] rounded-full shadow-2xl bg-white ${recording ? 'agent-circle' : ''}`}
          onClick={toggleRecording}>
        </button>
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
          <img className="w-[200px] rounded-2xl floating"src={imageList[currentImageIndex]} alt="Displayed Image" />
        )}
      </div>
    </main>
  );
}