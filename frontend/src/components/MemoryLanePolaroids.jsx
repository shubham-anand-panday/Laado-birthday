import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { audio } from '../utils/audioEngine';

const MemoryLanePolaroids = ({ onNext, partnerName = 'Shristi', memoriesData = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState('spotlight'); // 'spotlight' | 'grid'
  const cardRef = useRef(null);
  const ribbonRef = useRef(null);
  const containerRef = useRef(null);

  const memories = memoriesData && memoriesData.length > 0 ? memoriesData : [
    { id: 1, img: '/P1.jpeg', title: 'Precious Smile', caption: 'Your gentle laugh warms my soul ✨', secretNote: 'Every memory with you is carved into my heart.', date: 'Timeless Memory' }
  ];

  const current = memories[currentIndex] || memories[0];

  useEffect(() => {
    // GSAP entrance on hero polaroid with clearProps
    const ctx = gsap.context(() => {
      gsap.fromTo('.gsap-hero-polaroid',
        { scale: 0.9, y: 25, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.4)', clearProps: 'all' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleFlip = () => {
    audio.playTap();
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    audio.playTap();
    setIsFlipped(false);
    const nextIdx = (currentIndex + 1) % memories.length;
    setCurrentIndex(nextIdx);
    scrollRibbon(nextIdx);
  };

  const handlePrev = () => {
    audio.playTap();
    setIsFlipped(false);
    const prevIdx = (currentIndex - 1 + memories.length) % memories.length;
    setCurrentIndex(prevIdx);
    scrollRibbon(prevIdx);
  };

  const handleSelectPhoto = (idx) => {
    audio.playTap();
    setIsFlipped(false);
    setCurrentIndex(idx);
    scrollRibbon(idx);
  };

  const scrollRibbon = (index) => {
    if (ribbonRef.current) {
      const items = ribbonRef.current.children;
      if (items[index]) {
        items[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-[85vh] w-full flex flex-col items-center justify-center p-3 sm:p-5 text-center select-none">
      
      {/* Soft Ambient Crimson Atmosphere */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-radial from-red-950/40 via-red-900/15 to-transparent blur-3xl pointer-events-none" />

      {/* Floating Header */}
      <div className="relative z-10 flex flex-col items-center mb-3 max-w-lg">
        <span className="font-mono text-xs uppercase tracking-widest text-red-400 font-bold mb-1">
          ✦ Memory Keepsakes ✦
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif-luxury text-white leading-tight">
          A Walk Down Memory Lane
        </h2>
        <p className="text-xs sm:text-sm text-red-200/80 font-light mt-1 max-w-md leading-relaxed">
          Every moment with <span className="font-bold text-red-400">{partnerName}</span> is a treasure. Tap the card to read the handwritten letter on the back 💌
        </p>

        {/* View Mode Switcher Pill in Red & Black */}
        <div className="flex items-center gap-2 mt-3 bg-[#140407]/90 border border-red-800 p-1 rounded-full shadow-sm">
          <button
            onClick={() => setViewMode('spotlight')}
            className={`px-4 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'spotlight'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-red-300 hover:text-white'
            }`}
          >
            <span>Spotlight Frame 📷</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-red-300 hover:text-white'
            }`}
          >
            <span>All 10 Keepsakes 🖼️</span>
          </button>
        </div>
      </div>

      {/* ===================== VIEW MODE 1: SPOTLIGHT FRAME ===================== */}
      {viewMode === 'spotlight' && (
        <div className="relative z-10 w-full max-w-xl flex flex-col items-center my-2">
          
          {/* 3D Flappable Hero Polaroid */}
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
              <div className="w-full h-full bg-[#fffbfd] p-4 sm:p-5 pb-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col items-center border-2 border-red-900/60 [backface-visibility:hidden] relative">
                
                {/* Washi Tape Sticker in Crimson */}
                <div className="absolute -top-3 w-32 h-6 bg-gradient-to-r from-red-800 via-rose-700 to-red-800 rounded-xs shadow-xs rotate-1 border-t border-b border-red-400/50 flex items-center justify-center">
                  <span className="text-[10px] text-white font-mono tracking-wider font-bold">♥ MEMORY #{currentIndex + 1} ♥</span>
                </div>

                {/* Photo Display */}
                <div className="w-full h-72 sm:h-80 bg-stone-900 rounded-2xl overflow-hidden relative shadow-inner mt-2 border border-red-950">
                  <img
                    src={current.img}
                    alt={current.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Caption & Date */}
                <div className="w-full mt-3.5 px-2 text-center flex flex-col items-center justify-center">
                  <p className="font-handwriting-cute text-2xl sm:text-3xl text-stone-950 font-bold leading-snug">
                    {current.caption}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-red-700 font-bold uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                      {current.date}
                    </span>
                    <span className="text-[11px] text-red-600 font-medium">
                      Tap card to turn over ↺
                    </span>
                  </div>
                </div>
              </div>

              {/* BACK OF POLAROID (Secret Love Postcard) */}
              <div className="absolute inset-0 w-full h-full bg-[#fff9fa] p-6 sm:p-7 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col justify-between border-2 border-red-600/70 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                
                {/* Postcard Top Section */}
                <div className="flex justify-between items-start border-b border-red-200 pb-3">
                  <div className="flex items-center gap-2 text-left">
                    <div className="w-8 h-8 rounded-full bg-red-600/15 text-red-600 flex items-center justify-center text-sm font-bold">
                      💌
                    </div>
                    <div>
                      <span className="font-serif-luxury text-sm font-bold text-stone-950 block">
                        A Dying Heart's Vow for {partnerName}
                      </span>
                      <span className="text-[10px] text-red-600 font-mono">
                        Memory #{currentIndex + 1}
                      </span>
                    </div>
                  </div>

                  {/* Postage Stamp */}
                  <div className="w-11 h-14 border-2 border-dashed border-red-600 rounded-sm flex flex-col items-center justify-center text-[9px] text-red-700 font-mono font-bold bg-white">
                    <span>DIE</span>
                    <span className="text-xs text-red-600">❤</span>
                    <span>HEART</span>
                  </div>
                </div>

                {/* Secret Note Body */}
                <div className="my-auto py-3 text-left">
                  <p className="font-handwriting-cute text-2xl sm:text-3xl text-stone-900 font-bold leading-relaxed italic">
                    "{current.secretNote}"
                  </p>
                </div>

                {/* Postcard Sign-off */}
                <div className="border-t border-red-200 pt-3 flex justify-between items-center text-xs">
                  <span className="font-mono text-[10px] text-stone-600 font-medium">
                    Tap to view photo ↺
                  </span>
                  <span className="font-script-romantic text-2xl text-red-600 font-bold">
                    Yours Forever Shubham ❤️
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Arrows & Quick Flip Button */}
          <div className="flex items-center justify-between w-full max-w-sm mt-3 px-2">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-[#150407] hover:bg-[#24060e] border-2 border-red-600/70 text-red-200 flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-sm"
              title="Previous Photo"
            >
              <i className="ri-arrow-left-s-line text-2xl"></i>
            </button>

            <button
              onClick={handleFlip}
              className="py-1.5 px-4 rounded-full bg-[#150407] hover:bg-[#24060e] border border-red-600/70 text-xs font-semibold text-red-200 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <i className="ri-repeat-line text-sm"></i>
              <span>{isFlipped ? "Show Photo" : "Read Secret Note"}</span>
            </button>

            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-[#150407] hover:bg-[#24060e] border-2 border-red-600/70 text-red-200 flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 shadow-sm"
              title="Next Photo"
            >
              <i className="ri-arrow-right-s-line text-2xl"></i>
            </button>
          </div>

          {/* Horizontal Filmstrip Ribbon in Red & Black Theme */}
          <div className="w-full max-w-2xl mt-4 px-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-red-400 font-bold mb-2 flex items-center justify-between">
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
                  className={`relative shrink-0 w-16 h-20 sm:w-20 sm:h-24 p-1.5 bg-[#140407] rounded-xl cursor-pointer transition-all border-2 ${
                    currentIndex === idx
                      ? 'border-red-500 scale-105 shadow-[0_0_15px_rgba(220,38,38,0.6)] ring-2 ring-red-400'
                      : 'border-red-950 hover:border-red-700 opacity-75 hover:opacity-100 hover:scale-102'
                  }`}
                  title={`Photo #${idx + 1}: ${m.caption}`}
                >
                  <div className="w-full h-11 sm:h-14 bg-stone-900 rounded-lg overflow-hidden">
                    <img src={m.img} alt={m.caption} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-[9px] font-mono font-bold text-red-200 mt-1 truncate">
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
                  className={`bg-[#fffbfd] p-3.5 pb-4 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.8)] border-2 border-red-900/60 hover:border-red-500 transition-all cursor-pointer transform hover:scale-105 hover:z-20 ${tilt}`}
                >
                  {/* Tape */}
                  <div className="w-16 h-4 mx-auto -mt-5 bg-red-800 rounded-xs shadow-2xs border-t border-b border-red-400/50" />

                  {/* Photo */}
                  <div className="w-full h-48 bg-stone-900 rounded-xl overflow-hidden mt-1 shadow-inner">
                    <img src={m.img} alt={m.caption} className="w-full h-full object-cover" />
                  </div>

                  {/* Caption & Date */}
                  <div className="mt-2.5 text-center">
                    <p className="font-handwriting-cute text-xl text-stone-950 font-bold leading-tight">
                      "{m.caption}"
                    </p>
                    <div className="flex items-center justify-between mt-1 px-1 text-[10px] font-mono text-red-700 font-bold">
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
        className="relative z-10 mt-6 py-3.5 px-8 rounded-full bg-gradient-to-r from-red-700 via-rose-700 to-red-800 hover:from-red-600 hover:to-rose-600 text-white font-serif-luxury tracking-wide text-sm flex items-center gap-2 shadow-[0_4px_25px_rgba(220,38,38,0.5)] transition-all cursor-pointer transform hover:scale-105 active:scale-95"
      >
        <span>The Unbreakable Promise Ticket ✨</span>
        <i className="ri-arrow-right-line text-lg"></i>
      </button>
    </div>
  );
};

export default MemoryLanePolaroids;
