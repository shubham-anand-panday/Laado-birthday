import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { audio } from '../utils/audioEngine';

const VideoReelMoments = ({ onNext, partnerName = 'Debuu', videosData = [] }) => {
  const [moments] = useState(videosData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [aspectMode, setAspectMode] = useState('reel'); // 'reel' (9:16) | 'cinema' (16:9)
  const [floatingHearts, setFloatingHearts] = useState([]);

  const containerRef = useRef(null);
  const stageCardRef = useRef(null);
  const videoRef = useRef(null);
  const heartIdRef = useRef(0);
  const autoPlayTimerRef = useRef(null);

  const current = moments[currentIndex] || moments[0] || {};
  const isVideo = current.img?.endsWith('.mp4') || current.img?.includes('.mp4') || current.video;

  useEffect(() => {
    // GSAP entrance on mount
    const ctx = gsap.context(() => {
      gsap.fromTo('.gsap-cinema-header',
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', clearProps: 'all' }
      );
      gsap.fromTo('.gsap-cinema-stage',
        { scale: 0.9, opacity: 0, y: 25 },
        { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.4)', clearProps: 'all' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // When changing moment, reset video and progress
  useEffect(() => {
    setProgress(0);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback: mute and play
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, [currentIndex]);

  const handleSelectMoment = (idx) => {
    audio.playTap();
    if (idx === currentIndex) return;
    setCurrentIndex(idx);

    if (stageCardRef.current) {
      gsap.fromTo(stageCardRef.current,
        { opacity: 0.75, scale: 0.98 },
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

  const toggleMute = (e) => {
    e?.stopPropagation();
    audio.playTap();
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);

    // If video has sound unmuted, pause background music so video song is heard clearly!
    if (!nextMuted) {
      audio.pause();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const handleVideoEnded = () => {
    // Automatically advance to next reel on end!
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
    const emojis = ['💖', '💕', '✨', '🌹', '🥰'];
    const chosenEmoji = emojis[currentId % emojis.length];

    let clientX = window.innerWidth / 2;
    let clientY = window.innerHeight / 2;
    if (e?.clientX) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = containerRef.current?.getBoundingClientRect();
    const x = rect ? clientX - rect.left : window.innerWidth / 2;
    const y = rect ? clientY - rect.top : 250;

    const newHeart = {
      id: currentId,
      x,
      y,
      emoji: chosenEmoji
    };

    setFloatingHearts((prev) => [...prev.slice(-6), newHeart]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== currentId));
    }, 1500);

    confetti({
      particleCount: 35,
      spread: 60,
      origin: {
        x: clientX / window.innerWidth,
        y: clientY / window.innerHeight
      },
      colors: ['#f43f5e', '#ec4899', '#fda4af', '#fbbf24']
    });
  };

  return (
    <div ref={containerRef} className="relative min-h-[85vh] w-full flex flex-col items-center justify-center p-3 sm:p-6 text-center select-none overflow-hidden">
      
      {/* Soft Ambient Light Pink Aura */}
      <div className="absolute w-[650px] h-[650px] rounded-full bg-radial from-rose-300/25 via-pink-200/15 to-transparent blur-3xl pointer-events-none" />

      {/* Floating Interactive Hearts on Screen */}
      {floatingHearts.map((heart) => (
        <span
          key={heart.id}
          className="absolute z-50 pointer-events-none text-3xl animate-fade-in"
          style={{
            left: heart.x,
            top: heart.y,
            transform: 'translate(-50%, -50%)',
            animation: 'floatPetal 1.4s ease-out forwards'
          }}
        >
          {heart.emoji}
        </span>
      ))}

      {/* Floating Header */}
      <div className="gsap-cinema-header relative z-10 flex flex-col items-center mb-3 max-w-lg px-2">
        <span className="font-mono text-xs uppercase tracking-widest text-rose-700 font-bold mb-1">
          ✦ Living Video Keepsakes • {moments.length} Chapters of Love ✦
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif-luxury text-rose-950 leading-tight">
          Moments That Breathe & Live
        </h2>
        <p className="text-xs sm:text-sm text-rose-900/90 font-medium mt-1 max-w-md">
          {moments.length} moving chapters carved into the stars, forever dedicated to <span className="font-bold text-rose-700">{partnerName}</span>:
        </p>

        {/* View Aspect Ratio Switcher */}
        <div className="flex items-center gap-2 mt-2.5 bg-white/90 border border-rose-300 p-1 rounded-full shadow-xs">
          <button
            onClick={() => setAspectMode('reel')}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              aspectMode === 'reel'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-rose-700 hover:text-rose-950'
            }`}
          >
            <span>📱 Reel Mode</span>
          </button>
          <button
            onClick={() => setAspectMode('cinema')}
            className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              aspectMode === 'cinema'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-rose-700 hover:text-rose-950'
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
        {/* Main Cinematic Visual Frame with Responsive Height */}
        <div
          className={`relative w-full rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(244,63,94,0.22)] border-2 border-rose-300 bg-black group transition-all duration-300 ${
            aspectMode === 'reel'
              ? 'max-w-[340px] sm:max-w-[380px] aspect-[9/16] min-h-[500px] max-h-[75vh]'
              : 'max-w-2xl aspect-[16/10] sm:aspect-video min-h-[320px]'
          }`}
        >
          {/* Video or Image with Ambient Blurred Backdrop */}
          <div className="absolute inset-0 overflow-hidden cursor-pointer" onClick={togglePlayPause}>
            {isVideo ? (
              <>
                {/* Blurred ambient backdrop so portrait videos have gorgeous glow */}
                <video
                  src={current.img}
                  className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                {/* Main Crystal-Clear Video Player */}
                <video
                  ref={videoRef}
                  key={current.img}
                  src={current.img}
                  className="relative z-10 w-full h-full object-contain"
                  autoPlay
                  loop
                  playsInline
                  muted={isMuted}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleVideoEnded}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              </>
            ) : (
              <img
                src={current.img}
                alt={current.title}
                className="w-full h-full object-cover animate-ken-burns"
              />
            )}

            {/* Ambient Lighting Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/50 pointer-events-none z-10" />

            {/* Center Play/Pause Overlay Indicator on Pause */}
            {!isPlaying && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/35 pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-rose-500/80 backdrop-blur-md text-white flex items-center justify-center shadow-xl transform scale-110 animate-pulse">
                  <i className="ri-play-fill text-3xl ml-1"></i>
                </div>
              </div>
            )}
          </div>

          {/* Top Bar: Chapter Tag, Sound Toggle, and Send Love Button */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-30 pointer-events-auto">
            {/* Chapter Tag */}
            <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-mono uppercase tracking-wider border border-white/20 flex items-center gap-1.5 shadow-sm">
              <span>{current.icon}</span>
              <span className="font-bold truncate max-w-[100px] sm:max-w-none">{current.tag}</span>
              <span className="text-rose-300">#{currentIndex + 1}/{moments.length}</span>
            </div>

            {/* Controls: Audio Unmute, Play/Pause, Heart Shower */}
            <div className="flex items-center gap-1.5">
              {isVideo && (
                <button
                  onClick={toggleMute}
                  className={`px-2.5 py-1 rounded-full backdrop-blur-md text-xs font-mono flex items-center gap-1 border transition-all cursor-pointer shadow-md ${
                    isMuted
                      ? 'bg-black/60 text-white/90 border-white/25 hover:bg-black/80'
                      : 'bg-rose-500/90 text-white border-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.6)] animate-pulse'
                  }`}
                  title={isMuted ? "Unmute Video Song" : "Mute Video"}
                >
                  <i className={`text-xs ${isMuted ? 'ri-volume-mute-fill text-rose-300' : 'ri-volume-up-fill text-yellow-300'}`}></i>
                  <span className="text-[11px] font-semibold">{isMuted ? 'Muted' : 'Sound ON ♫'}</span>
                </button>
              )}

              <button
                onClick={togglePlayPause}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 backdrop-blur-md text-white/90 flex items-center justify-center border border-white/20 hover:bg-black/80 transition-transform active:scale-90 cursor-pointer"
                title={isPlaying ? "Pause" : "Play"}
              >
                <i className={`text-xs sm:text-sm ${isPlaying ? 'ri-pause-line' : 'ri-play-line'}`}></i>
              </button>

              <button
                onClick={handleSendLove}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-90 shadow-md cursor-pointer border border-white/30"
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
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer border border-white/10 opacity-70 hover:opacity-100"
            title="Previous Chapter"
          >
            <i className="ri-arrow-left-s-line text-lg"></i>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextMoment();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer border border-white/10 opacity-70 hover:opacity-100"
            title="Next Chapter"
          >
            <i className="ri-arrow-right-s-line text-lg"></i>
          </button>

          {/* Bottom Calligraphy & Romantic Poetry */}
          <div className="absolute bottom-4 left-3 right-3 sm:left-4 sm:right-4 z-20 text-left text-white pointer-events-none">
            <h3 className="font-serif-luxury text-lg sm:text-2xl font-bold drop-shadow-md text-white mb-0.5 leading-tight">
              {current.title}
            </h3>
            <p className="font-handwriting-cute text-xl sm:text-2xl text-rose-200 drop-shadow-md leading-snug mb-0.5 line-clamp-2">
              "{current.quote}"
            </p>
            <p className="text-[10px] sm:text-xs text-white/80 font-mono tracking-wide drop-shadow-xs line-clamp-1">
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
              className="h-full bg-gradient-to-r from-rose-500 via-pink-400 to-amber-300 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-xs" />
            </div>
          </div>
        </div>

        {/* Dynamic Filmstrip Selector Ribbon */}
        <div className="w-full max-w-xl mt-4 px-2">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-rose-700 font-bold mb-2">
            <span>🎞️ {moments.length} Living Chapters</span>
            <span className="text-[10px] text-rose-500 font-normal">Tap to jump to chapter</span>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap">
            {moments.map((m, idx) => (
              <button
                key={m.id || idx}
                onClick={() => handleSelectMoment(idx)}
                className={`p-2 rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center text-center border-2 min-w-[62px] sm:min-w-[80px] ${
                  currentIndex === idx
                    ? 'bg-white border-rose-500 shadow-[0_4px_15px_rgba(244,63,94,0.3)] scale-105 ring-2 ring-rose-300'
                    : 'bg-white/80 hover:bg-white border-rose-200 opacity-75 hover:opacity-100 hover:scale-102 shadow-xs'
                }`}
                title={m.title}
              >
                <span className="text-sm sm:text-base mb-0.5">{m.icon}</span>
                <span className="text-[10px] font-mono font-bold text-rose-950 truncate max-w-full">
                  #{idx + 1}
                </span>
                <span className="text-[9px] font-serif-luxury text-rose-700/80 truncate max-w-[65px] sm:max-w-none leading-tight font-semibold">
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
          className="mt-6 py-3.5 px-8 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-400 text-white font-serif-luxury tracking-wide text-sm flex items-center gap-2 shadow-[0_4px_25px_rgba(244,63,94,0.35)] transition-all cursor-pointer transform hover:scale-105 active:scale-95"
        >
          <span>Grand Birthday Finale 🎆</span>
          <i className="ri-arrow-right-line text-lg"></i>
        </button>
      </div>
    </div>
  );
};

export default VideoReelMoments;
