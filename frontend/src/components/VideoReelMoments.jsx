import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { audio } from '../utils/audioEngine';

const VideoReelMoments = ({ onNext, partnerName = 'Shristi', videosData = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [aspectMode, setAspectMode] = useState('reel'); // 'reel' (9:16) | 'cinema' (16:9)
  const [floatingHearts, setFloatingHearts] = useState([]);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const stageCardRef = useRef(null);
  const heartIdRef = useRef(0);

  const moments = videosData && videosData.length > 0 ? videosData : [
    {
      id: 1,
      title: "Sparklers in the Night",
      caption: "You brought light into my darkest corners ✨",
      quote: "Loving you is my religion.",
      img: "/V1.mp4",
      tag: "Spark of Us",
      icon: "✨",
      ambient: "Golden Starlight"
    }
  ];

  const current = moments[currentIndex] || moments[0];
  const isVideo = current.img.endsWith('.mp4') || current.img.endsWith('.webm');

  // Ensure video voice is permanently removed / muted on every moment change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.volume = 0;
    }
  }, [currentIndex]);

  useEffect(() => {
    // GSAP entrance on video stage with clearProps
    const ctx = gsap.context(() => {
      gsap.fromTo('.gsap-cinema-stage',
        { scale: 0.92, y: 20, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', clearProps: 'all' }
      );
      gsap.fromTo('.gsap-cinema-header',
        { y: -15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', clearProps: 'all' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSelectMoment = (index) => {
    audio.playTap();
    setCurrentIndex(index);
    setProgress(0);
    setIsPlaying(true);

    if (stageCardRef.current) {
      gsap.fromTo(stageCardRef.current,
        { opacity: 0.4, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out', clearProps: 'all' }
      );
    }
  };

  const handleNextMoment = () => {
    handleSelectMoment((currentIndex + 1) % moments.length);
  };

  const handlePrevMoment = () => {
    handleSelectMoment((currentIndex - 1 + moments.length) % moments.length);
  };

  const togglePlayPause = () => {
    audio.playTap();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const handleVideoEnded = () => {
    handleNextMoment();
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = percentage * videoRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  const handleSendLove = (e) => {
    audio.playTap();
    heartIdRef.current += 1;
    const currentId = heartIdRef.current;
    const emojis = ['🌹', '🥀', '❤️', '✨', '🥰'];
    const chosenEmoji = emojis[currentId % emojis.length];

    let clientX = window.innerWidth / 2;
    let clientY = window.innerHeight / 2;
    if (e?.clientX) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const newHeart = {
      id: currentId,
      x: clientX + (Math.random() * 40 - 20),
      y: clientY - 30,
      emoji: chosenEmoji
    };

    setFloatingHearts((prev) => [...prev.slice(-10), newHeart]);
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-[85vh] w-full flex flex-col items-center justify-center p-3 sm:p-5 text-center select-none"
    >
      {/* Soft Ambient Crimson Atmosphere */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-radial from-red-950/40 via-red-900/15 to-transparent blur-3xl pointer-events-none" />

      {/* Floating Kisses / Heart Emojis on Click */}
      {floatingHearts.map((heart) => (
        <span
          key={heart.id}
          className="fixed z-50 pointer-events-none text-3xl animate-fade-in"
          style={{
            left: heart.x,
            top: heart.y,
            transform: 'translate(-50%, -50%)',
            animation: 'floatPetal 1.6s ease-out forwards'
          }}
        >
          {heart.emoji}
        </span>
      ))}

      {/* Floating Header in Red & Black Theme */}
      <div className="gsap-cinema-header relative z-10 flex flex-col items-center mb-3 max-w-lg px-2">
        <span className="font-mono text-xs uppercase tracking-widest text-red-400 font-bold mb-1">
          ✦ Living Video Keepsakes • {moments.length} Chapters of Devotion ✦
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif-luxury text-white leading-tight">
          Moments That Breathe & Live
        </h2>
        <p className="text-xs sm:text-sm text-red-200/80 font-light mt-1 max-w-md">
          {moments.length} moving chapters carved into the stars, forever dedicated to <span className="font-bold text-red-400">{partnerName}</span>:
        </p>

        {/* View Aspect Ratio Switcher */}
        <div className="flex items-center gap-2 mt-2.5 bg-[#140407]/90 border border-red-800 p-1 rounded-full shadow-xs">
          <button
            onClick={() => setAspectMode('reel')}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              aspectMode === 'reel'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-red-300 hover:text-white'
            }`}
          >
            <span>📱 Reel Mode</span>
          </button>
          <button
            onClick={() => setAspectMode('cinema')}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              aspectMode === 'cinema'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-red-300 hover:text-white'
            }`}
          >
            <span>🎬 Cinema Mode</span>
          </button>
        </div>
      </div>

      {/* ===================== CINEMATIC SHOWCASE STAGE ===================== */}
      <div
        ref={stageCardRef}
        className="gsap-cinema-stage relative z-10 w-full flex flex-col items-center my-1"
      >
        {/* Main Cinematic Visual Frame */}
        <div
          className={`relative w-full rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(220,38,38,0.3)] border-2 border-red-600/70 bg-black group transition-all duration-300 ${
            aspectMode === 'reel'
              ? 'max-w-[340px] sm:max-w-[380px] aspect-[9/16] min-h-[500px] max-h-[75vh]'
              : 'max-w-2xl aspect-[16/10] sm:aspect-video min-h-[320px]'
          }`}
        >
          {/* Video or Image Frame (100% Crisp & Clean, Zero Blur) */}
          <div className="absolute inset-0 overflow-hidden cursor-pointer bg-black flex items-center justify-center" onClick={togglePlayPause}>
            {isVideo ? (
              <video
                ref={videoRef}
                key={current.img}
                src={current.img}
                className="w-full h-full object-contain relative z-10"
                autoPlay
                loop
                playsInline
                muted={true}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnded}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            ) : (
              <img
                src={current.img}
                alt={current.title}
                className="w-full h-full object-contain"
              />
            )}

            {/* Center Play/Pause Overlay Indicator on Pause */}
            {!isPlaying && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-red-600/90 backdrop-blur-md text-white flex items-center justify-center shadow-xl transform scale-110 animate-pulse border border-red-400/50">
                  <i className="ri-play-fill text-3xl ml-1"></i>
                </div>
              </div>
            )}
          </div>

          {/* Top Bar: Chapter Tag, Sound Toggle, and Send Love Button */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-30 pointer-events-auto">
            {/* Chapter Tag */}
            <div className="px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] font-mono uppercase tracking-wider border border-red-700/60 flex items-center gap-1.5 shadow-sm">
              <span>{current.icon}</span>
              <span className="font-bold whitespace-nowrap">{current.tag}</span>
              <span className="text-red-400">#{currentIndex + 1}/{moments.length}</span>
            </div>

            {/* Controls: Play/Pause, Heart Shower */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={togglePlayPause}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/70 backdrop-blur-md text-white/90 flex items-center justify-center border border-white/20 hover:bg-black/90 transition-transform active:scale-90 cursor-pointer"
                title={isPlaying ? "Pause" : "Play"}
              >
                <i className={`text-xs sm:text-sm ${isPlaying ? 'ri-pause-line' : 'ri-play-line'}`}></i>
              </button>

              <button
                onClick={handleSendLove}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-90 shadow-md cursor-pointer border border-red-400"
                title="Send Love!"
              >
                <i className="ri-heart-fill text-xs sm:text-sm"></i>
              </button>
            </div>
          </div>

          {/* Quick Nav Arrows on Side */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevMoment();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-sm text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer border border-red-900/60 opacity-80 hover:opacity-100"
            title="Previous Chapter"
          >
            <i className="ri-arrow-left-s-line text-lg"></i>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextMoment();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-sm text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer border border-red-900/60 opacity-80 hover:opacity-100"
            title="Next Chapter"
          >
            <i className="ri-arrow-right-s-line text-lg"></i>
          </button>

          {/* Bottom Calligraphy & Romantic Poetry - Compact & Elegant Typography */}
          <div className="absolute bottom-2 left-2 right-2 sm:left-3 sm:right-3 z-20 text-left text-white pointer-events-none bg-gradient-to-t from-black/85 via-black/35 to-transparent pt-4 pb-1.5 px-2.5 sm:px-3.5 rounded-b-2xl">
            <h3 className="font-serif-luxury text-xs sm:text-base font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-white mb-0.5 leading-tight">
              {current.title}
            </h3>
            <p className="font-handwriting-cute text-sm sm:text-lg text-red-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] leading-snug mb-0.5">
              "{current.quote}"
            </p>
            <p className="text-[10px] sm:text-[11px] text-red-200/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-mono tracking-wide leading-tight">
              {current.caption}
            </p>
          </div>

          {/* Video Timeline Scrubber / Progress Bar */}
          <div
            onClick={handleSeek}
            className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 hover:h-2.5 transition-all cursor-pointer z-30"
            title="Click to seek"
          >
            <div
              className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-300 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-xs" />
            </div>
          </div>
        </div>

        {/* Dynamic Filmstrip Selector Ribbon in Red & Black Theme */}
        <div className="w-full max-w-xl mt-4 px-2">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-red-400 font-bold mb-2">
            <span>🎞️ {moments.length} Living Chapters</span>
            <span className="text-[10px] text-red-500 font-normal">Tap to jump to chapter</span>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap">
            {moments.map((m, idx) => (
              <button
                key={m.id || idx}
                onClick={() => handleSelectMoment(idx)}
                className={`p-2 rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center text-center border-2 min-w-[62px] sm:min-w-[80px] ${
                  currentIndex === idx
                    ? 'bg-[#20050d] border-red-500 shadow-[0_4px_15px_rgba(220,38,38,0.5)] scale-105 ring-2 ring-red-400'
                    : 'bg-[#140407] hover:bg-[#1c060f] border-red-950 opacity-75 hover:opacity-100 hover:scale-102 shadow-xs'
                }`}
                title={m.title}
              >
                <span className="text-sm sm:text-base mb-0.5">{m.icon}</span>
                <span className="text-[10px] font-mono font-bold text-white whitespace-nowrap">
                  #{idx + 1}
                </span>
                <span className="text-[9px] font-serif-luxury text-red-300/90 leading-tight font-semibold break-words max-w-[75px] sm:max-w-[90px]">
                  {m.tag}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Continue Button to Finale */}
        <button
          onClick={() => {
            audio.playTap();
            onNext();
          }}
          className="mt-6 py-3.5 px-8 rounded-full bg-gradient-to-r from-red-700 via-rose-700 to-red-800 hover:from-red-600 hover:to-rose-600 text-white font-serif-luxury tracking-wide text-sm flex items-center gap-2 shadow-[0_4px_25px_rgba(220,38,38,0.5)] transition-all cursor-pointer transform hover:scale-105 active:scale-95"
        >
          <span>Grand Birthday Finale 🎆</span>
          <i className="ri-arrow-right-line text-lg"></i>
        </button>
      </div>
    </div>
  );
};

export default VideoReelMoments;
