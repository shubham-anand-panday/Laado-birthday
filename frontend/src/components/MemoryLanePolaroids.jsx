import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { audio } from '../utils/audioEngine';

const MemoryLanePolaroids = ({ onNext, partnerName = 'Ananya', memoriesData = [] }) => {
  const [memories] = useState(memoriesData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState('spotlight'); // 'spotlight' | 'grid'
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const ribbonRef = useRef(null);

  useEffect(() => {
    // GSAP entrance on mount
    const ctx = gsap.context(() => {
      gsap.fromTo('.gsap-lane-header',
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', clearProps: 'all' }
      );
      gsap.fromTo('.gsap-hero-polaroid',
        { scale: 0.9, opacity: 0, y: 25 },
        { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: 'back.out(1.4)', clearProps: 'all' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSelectPhoto = (idx) => {
    if (idx === currentIndex) return;
    audio.playTap();
    setIsFlipped(false);
    setCurrentIndex(idx);

    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { scale: 0.92, opacity: 0.7 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'power2.out', clearProps: 'all' }
      );
    }
  };

  const handleNext = () => {
    handleSelectPhoto((currentIndex + 1) % memories.length);
  };

  const handlePrev = () => {
    handleSelectPhoto((currentIndex - 1 + memories.length) % memories.length);
  };

  const handleFlip = () => {
    audio.playTap();
    setIsFlipped(!isFlipped);
  };

  const current = memories[currentIndex] || memories[0];

  return (
    <div ref={containerRef} className="relative min-h-[85vh] w-full flex flex-col items-center justify-center p-3 sm:p-6 text-center select-none overflow-hidden">
      
      {/* Soft Ambient Light Pink Atmosphere */}
      <div className="absolute w-[650px] h-[650px] rounded-full bg-radial from-rose-300/25 via-pink-200/15 to-transparent blur-3xl pointer-events-none" />

      {/* Floating Romantic Header */}
      <div className="gsap-lane-header relative z-10 flex flex-col items-center mb-3 max-w-xl">
        <span className="font-mono text-xs uppercase tracking-widest text-rose-700 font-bold mb-1">
          ✦ 10 Keepsake Memories • Fairy-Light Keepsake ✦
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif-luxury text-rose-950 leading-tight">
          A Walk Down Memory Lane
        </h2>
        <p className="text-xs sm:text-sm text-rose-900/90 font-medium mt-1 max-w-md leading-relaxed">
          Every moment with <span className="font-bold text-rose-700">{partnerName}</span> is a treasure. Tap the card to read the handwritten letter on the back 💌
        </p>

        {/* View Mode Switcher Pill */}
        <div className="flex items-center gap-2 mt-3 bg-white/90 border border-rose-300/80 p-1 rounded-full shadow-sm">
          <button
            onClick={() => setViewMode('spotlight')}
            className={`px-4 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'spotlight'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-rose-700 hover:text-rose-950'
            }`}
          >
            <span>Spotlight Frame 📷</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-rose-700 hover:text-rose-950'
            }`}
          >
            <span>All 10 Keepsakes 🖼️</span>
          </button>
        </div>
      </div>

      {/* ===================== VIEW MODE 1: SPOTLIGHT FRAME ===================== */}
      {viewMode === 'spotlight' && (
        <div className="relative z-10 w-full max-w-xl flex flex-col items-center my-2">
          
          {/* 3D Flappable Hero Polaroid (Clean, without awkward clothespin vertical line) */}
          <div
            ref={cardRef}
            className="gsap-hero-polaroid relative w-80 sm:w-96 min-h-[460px] perspective-[1200px]"
          >
            <div
              onClick={handleFlip}
              className={`w-full h-full relative transition-transform duration-700 cursor-pointer [transform-style:preserve-3d] ${
                isFlipped ? '[transform:rotateY(180deg)]' : ''
              }`}
            >
              {/* FRONT OF POLAROID */}
              <div className="w-full h-full bg-white p-4 sm:p-5 pb-6 rounded-3xl shadow-[0_20px_50px_rgba(244,63,94,0.18)] flex flex-col items-center border-2 border-rose-200/90 [backface-visibility:hidden] relative">
                
                {/* Cute Washi Tape Sticker */}
                <div className="absolute -top-3 w-28 h-6 bg-gradient-to-r from-rose-200 via-pink-200 to-rose-200 rounded-xs shadow-xs rotate-1 border-t border-b border-rose-300/50 flex items-center justify-center">
                  <span className="text-[10px] text-rose-700 font-mono tracking-wider font-bold">♥ MEMORY #{currentIndex + 1} ♥</span>
                </div>

                {/* Photo Display */}
                <div className="w-full h-72 sm:h-80 bg-stone-100 rounded-2xl overflow-hidden relative shadow-inner mt-2 border border-stone-200">
                  <img
                    src={current.img}
                    alt={current.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Caption & Date */}
                <div className="w-full mt-3.5 px-2 text-center flex flex-col items-center justify-center">
                  <p className="font-handwriting-cute text-2xl sm:text-3xl text-rose-950 font-bold leading-snug">
                    {current.caption}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-rose-700 font-bold uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      {current.date}
                    </span>
                    <span className="text-[11px] text-rose-500 font-medium">
                      Tap card to turn over ↺
                    </span>
                  </div>
                </div>
              </div>

              {/* BACK OF POLAROID (Secret Love Postcard) */}
              <div className="absolute inset-0 w-full h-full bg-[#fff9fa] p-6 sm:p-7 rounded-3xl shadow-[0_20px_50px_rgba(244,63,94,0.18)] flex flex-col justify-between border-2 border-rose-300 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                
                {/* Postcard Top Section */}
                <div className="flex justify-between items-start border-b border-rose-200 pb-3">
                  <div className="flex items-center gap-2 text-left">
                    <div className="w-8 h-8 rounded-full bg-rose-500/15 text-rose-600 flex items-center justify-center text-sm font-bold">
                      💌
                    </div>
                    <div>
                      <span className="font-serif-luxury text-sm font-bold text-rose-950 block">
                        A Note For {partnerName}
                      </span>
                      <span className="text-[10px] text-rose-600 font-mono">
                        Memory #{currentIndex + 1}
                      </span>
                    </div>
                  </div>

                  {/* Postage Stamp */}
                  <div className="w-11 h-14 border-2 border-dashed border-rose-400 rounded-sm flex flex-col items-center justify-center text-[9px] text-rose-600 font-mono font-bold bg-white">
                    <span>LOVE</span>
                    <span className="text-xs">❤</span>
                    <span>POST</span>
                  </div>
                </div>

                {/* Secret Note Body */}
                <div className="my-auto py-3 text-left">
                  <p className="font-handwriting-cute text-2xl sm:text-3xl text-rose-950 font-bold leading-relaxed italic">
                    "{current.secretNote}"
                  </p>
                </div>

                {/* Postcard Sign-off */}
                <div className="border-t border-rose-200 pt-3 flex justify-between items-center text-xs">
                  <span className="font-mono text-[10px] text-rose-700 font-medium">
                    Tap to view photo ↺
                  </span>
                  <span className="font-script-romantic text-2xl text-rose-600 font-bold">
                    Forever Yours ❤️
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Arrows & Quick Flip Button */}
          <div className="flex items-center justify-between w-full max-w-sm mt-3 px-2">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-white hover:bg-rose-50 border-2 border-rose-300 text-rose-700 flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-sm"
              title="Previous Photo"
            >
              <i className="ri-arrow-left-s-line text-2xl"></i>
            </button>

            <button
              onClick={handleFlip}
              className="py-1.5 px-4 rounded-full bg-white hover:bg-rose-50 border border-rose-300 text-xs font-semibold text-rose-700 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <i className="ri-repeat-line text-sm"></i>
              <span>{isFlipped ? "Show Photo" : "Read Secret Note"}</span>
            </button>

            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-white hover:bg-rose-50 border-2 border-rose-300 text-rose-700 flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-sm"
              title="Next Photo"
            >
              <i className="ri-arrow-right-s-line text-2xl"></i>
            </button>
          </div>

          {/* Horizontal Filmstrip Ribbon (All 10 Photos, clean without scrollbar line or add button) */}
          <div className="w-full max-w-2xl mt-4 px-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-rose-700 font-bold mb-2 flex items-center justify-between">
              <span>📷 10 Moments in Time</span>
              <span>Click any photo to view</span>
            </div>

            <div
              ref={ribbonRef}
              className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {memories.map((m, idx) => (
                <div
                  key={m.id || idx}
                  onClick={() => handleSelectPhoto(idx)}
                  className={`relative shrink-0 w-16 h-20 sm:w-20 sm:h-24 p-1.5 bg-white rounded-xl cursor-pointer transition-all border-2 ${
                    currentIndex === idx
                      ? 'border-rose-500 scale-105 shadow-[0_0_15px_rgba(244,63,94,0.4)] ring-2 ring-rose-300'
                      : 'border-rose-200/80 hover:border-rose-400 opacity-75 hover:opacity-100 hover:scale-102'
                  }`}
                  title={`Photo #${idx + 1}: ${m.caption}`}
                >
                  <div className="w-full h-11 sm:h-14 bg-stone-100 rounded-lg overflow-hidden">
                    <img src={m.img} alt={m.caption} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-[9px] font-mono font-bold text-rose-950 mt-1 truncate">
                    #{idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================== VIEW MODE 2: ALL 10 KEEPSAKES GRID ===================== */}
      {viewMode === 'grid' && (
        <div className="relative z-10 w-full max-w-4xl my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 px-2">
            {memories.map((m, idx) => {
              const tiltAngles = ['-rotate-1', 'rotate-2', '-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2'];
              const tilt = tiltAngles[idx % tiltAngles.length];

              return (
                <div
                  key={m.id || idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setViewMode('spotlight');
                  }}
                  className={`bg-white p-3.5 pb-4 rounded-2xl shadow-[0_10px_25px_rgba(244,63,94,0.12)] border-2 border-rose-200 hover:border-rose-400 transition-all cursor-pointer transform hover:scale-105 hover:z-20 ${tilt}`}
                >
                  {/* Tape */}
                  <div className="w-16 h-4 mx-auto -mt-5 bg-rose-200/80 rounded-xs shadow-2xs border-t border-b border-rose-300/60" />

                  {/* Photo */}
                  <div className="w-full h-48 bg-stone-100 rounded-xl overflow-hidden mt-1 shadow-inner">
                    <img src={m.img} alt={m.caption} className="w-full h-full object-cover" />
                  </div>

                  {/* Caption & Date */}
                  <div className="mt-2.5 text-center">
                    <p className="font-handwriting-cute text-xl text-rose-950 font-bold leading-tight">
                      "{m.caption}"
                    </p>
                    <div className="flex items-center justify-between mt-1 px-1 text-[10px] font-mono text-rose-600 font-bold">
                      <span>#{idx + 1}</span>
                      <span>{m.date}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Continue Button */}
      <button
        onClick={() => {
          audio.playTap();
          onNext();
        }}
        className="relative z-10 mt-6 py-3.5 px-8 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-400 text-white font-serif-luxury tracking-wide text-sm flex items-center gap-2 shadow-[0_4px_25px_rgba(244,63,94,0.3)] transition-all cursor-pointer transform hover:scale-105 active:scale-95"
      >
        <span>Scratch Card Surprise ✨</span>
        <i className="ri-arrow-right-line text-lg"></i>
      </button>
    </div>
  );
};

export default MemoryLanePolaroids;
