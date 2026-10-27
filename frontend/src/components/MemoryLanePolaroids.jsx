import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { audio } from '../utils/audioEngine';

const MemoryLanePolaroids = ({ onNext, partnerName = 'Shristi', memoriesData = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState('spotlight'); // 'spotlight' | 'grid'
  const [zoomedImg, setZoomedImg] = useState(null);
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
            <span>All {memories.length} Keepsakes 🖼️</span>
          </button>
        </div>
      </div>

      {/* ===================== VIEW MODE 1: SPOTLIGHT FRAME ===================== */}
      {viewMode === 'spotlight' && (
        <div className="relative z-10 w-full max-w-xl flex flex-col items-center my-2">
          
          {/* 3D Flappable Hero Polaroid */}
          <div
            ref={cardRef}
            className="gsap-hero-polaroid relative w-full max-w-[340px] sm:max-w-[400px] min-h-[480px] sm:min-h-[520px] perspective-1200"
          >
            <div
              className={`w-full h-full relative transition-transform duration-700 transform-style-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT OF POLAROID */}
              <div
                onClick={!isFlipped ? handleFlip : undefined}
                className={`w-full bg-[#fffbfd] p-3.5 sm:p-5 pb-5 sm:pb-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col items-center border-2 border-red-900/60 backface-hidden relative transition-opacity duration-300 ${
                  isFlipped ? 'pointer-events-none opacity-0 select-none' : 'pointer-events-auto opacity-100 cursor-pointer'
                }`}
              >
                {/* Washi Tape Sticker in Crimson */}
                <div className="absolute -top-3 w-32 h-6 bg-gradient-to-r from-red-800 via-rose-700 to-red-800 rounded-xs shadow-xs rotate-1 border-t border-b border-red-400/50 flex items-center justify-center">
                  <span className="text-[10px] text-white font-mono tracking-wider font-bold">♥ MEMORY #{currentIndex + 1} ♥</span>
                </div>

                {/* Photo Display - Uncropped with Ambient Backdrop */}
                <div className="w-full h-72 sm:h-88 bg-stone-950/95 rounded-2xl overflow-hidden relative shadow-inner mt-2 border border-red-950/80 flex items-center justify-center group/photo">
                  {/* Ambient Blurred Aura to fill backdrop seamlessly with exact photo hues */}
                  <img
                    src={current.img}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-35 pointer-events-none"
                  />
                  {/* Complete 100% Uncropped Main Photo */}
                  <img
                    src={current.img}
                    alt={current.title}
                    className="relative z-10 max-w-full max-h-full object-contain transition-transform duration-500 group-hover/photo:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-20" />

                  {/* Expand Fullscreen Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      audio.playTap();
                      setZoomedImg(current);
                    }}
                    className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-red-700 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-md hover:scale-110 active:scale-95"
                    title="View Full Uncropped Photo"
                  >
                    <i className="ri-fullscreen-line text-sm"></i>
                  </button>
                </div>

                {/* Caption & Date */}
                <div className="w-full mt-3 px-1 text-center flex flex-col items-center justify-center">
                  <p className="font-handwriting-cute text-2xl sm:text-3xl text-stone-950 font-bold leading-snug">
                    {current.caption}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap justify-center">
                    <span className="text-[10px] font-mono text-red-700 font-bold uppercase tracking-wider bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                      {current.date}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFlip();
                      }}
                      className="text-[11px] text-red-600 hover:text-red-700 font-bold flex items-center gap-1 bg-red-50 hover:bg-red-100 px-2.5 py-0.5 rounded-full border border-red-200 transition-colors cursor-pointer active:scale-95"
                    >
                      <span>Read Secret Note 💌 ↺</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* BACK OF POLAROID (Secret Love Postcard) */}
              <div
                onClick={isFlipped ? handleFlip : undefined}
                className={`absolute inset-0 w-full h-full bg-[#fff9fa] p-4 sm:p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col justify-between border-2 border-red-600/70 backface-hidden rotate-y-180 transition-opacity duration-300 ${
                  isFlipped ? 'pointer-events-auto opacity-100 z-30 cursor-pointer' : 'pointer-events-none opacity-0 z-0 select-none'
                }`}
              >
                {/* Postcard Top Section */}
                <div className="flex justify-between items-center border-b border-red-200/80 pb-2.5 shrink-0">
                  <div className="flex items-center gap-2 text-left">
                    <div className="w-8 h-8 rounded-full bg-red-600/15 text-red-600 flex items-center justify-center text-sm font-bold shrink-0">
                      💌
                    </div>
                    <div>
                      <span className="font-serif-luxury text-xs sm:text-sm font-bold text-stone-950 block leading-tight">
                        A Dying Heart's Vow for {partnerName}
                      </span>
                      <span className="text-[10px] text-red-600 font-mono">
                        Memory #{currentIndex + 1} • {current.date}
                      </span>
                    </div>
                  </div>

                  {/* Postage Stamp */}
                  <div className="w-10 h-12 sm:w-11 sm:h-14 border-2 border-dashed border-red-600 rounded-sm flex flex-col items-center justify-center text-[8px] sm:text-[9px] text-red-700 font-mono font-bold bg-white shrink-0 shadow-2xs">
                    <span>DIE</span>
                    <span className="text-xs text-red-600 leading-none">❤</span>
                    <span>HEART</span>
                  </div>
                </div>

                {/* Secret Note Body (Responsive with Smooth Scrolling for Long Notes) */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="my-auto py-2.5 sm:py-3.5 text-left overflow-y-auto max-h-[250px] sm:max-h-[300px] pr-1.5 custom-scrollbar cursor-text"
                >
                  <p className="font-handwriting-cute text-xl sm:text-2xl md:text-3xl text-stone-900 font-bold leading-relaxed italic">
                    "{current.secretNote}"
                  </p>
                </div>

                {/* Postcard Sign-off */}
                <div className="border-t border-red-200/80 pt-2.5 sm:pt-3 flex justify-between items-center text-xs shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFlip();
                    }}
                    className="font-mono text-[10px] sm:text-[11px] text-stone-700 hover:text-red-700 font-bold flex items-center gap-1.5 bg-stone-100 hover:bg-red-100/70 px-3 py-1.5 rounded-full border border-stone-300 transition-colors cursor-pointer shadow-xs active:scale-95"
                  >
                    <i className="ri-refresh-line text-sm text-red-600"></i>
                    <span>View Photo ↺</span>
                  </button>
                  <span className="font-script-romantic text-xl sm:text-2xl text-red-600 font-bold">
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
              <span>📷 {memories.length} Moments in Time</span>
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
                  <div className="w-full h-11 sm:h-14 bg-stone-950 rounded-lg overflow-hidden flex items-center justify-center">
                    <img src={m.img} alt={m.caption} className="w-full h-full object-cover object-top" />
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

      {/* ===================== VIEW MODE 2: ALL KEEPSAKES GRID ===================== */}
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

                  {/* Photo Display - Uncropped with Ambient Aura */}
                  <div className="w-full h-64 sm:h-72 bg-stone-950/95 rounded-xl overflow-hidden mt-1 shadow-inner relative flex items-center justify-center border border-red-950/40 group/gridphoto">
                    {/* Ambient Blurred Aura */}
                    <img
                      src={m.img}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover blur-sm scale-110 opacity-30 pointer-events-none"
                    />
                    {/* 100% Uncropped Photo */}
                    <img
                      src={m.img}
                      alt={m.caption}
                      className="relative z-10 max-w-full max-h-full object-contain transition-transform duration-300 group-hover/gridphoto:scale-[1.03]"
                    />
                    
                    {/* Quick Expand Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        audio.playTap();
                        setZoomedImg(m);
                      }}
                      className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-black/60 hover:bg-red-700 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer opacity-80 hover:opacity-100 shadow-md"
                      title="View Full Uncropped Photo"
                    >
                      <i className="ri-fullscreen-line text-xs"></i>
                    </button>
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

      {/* ===================== FULLSCREEN LIGHTBOX MODAL (100% UNCROPPED) ===================== */}
      {zoomedImg && (
        <div
          onClick={() => setZoomedImg(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-3 sm:p-6 animate-fade-in cursor-pointer"
        >
          {/* Close Button */}
          <button
            onClick={() => setZoomedImg(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-red-700 hover:bg-red-600 text-white flex items-center justify-center text-2xl transition-all shadow-xl cursor-pointer z-50 border border-red-400/50 hover:scale-110"
            title="Close Lightbox"
          >
            <i className="ri-close-line"></i>
          </button>

          {/* Modal Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center cursor-default bg-[#120306] p-4 sm:p-6 rounded-3xl border border-red-800/80 shadow-[0_0_80px_rgba(220,38,38,0.4)]"
          >
            <div className="relative max-h-[72vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black">
              <img
                src={zoomedImg.img}
                alt={zoomedImg.title}
                className="max-w-full max-h-[72vh] object-contain rounded-2xl shadow-2xl"
              />
            </div>
            
            <div className="mt-4 text-center">
              <h4 className="text-white font-serif-luxury text-lg sm:text-xl font-bold tracking-wide">
                {zoomedImg.title}
              </h4>
              <p className="text-red-300 font-handwriting-cute text-2xl sm:text-3xl mt-1 font-bold">
                "{zoomedImg.caption}"
              </p>
              <span className="inline-block mt-2 text-[11px] font-mono text-red-400 font-bold uppercase tracking-wider bg-red-950/80 px-3 py-1 rounded-full border border-red-800/50">
                {zoomedImg.date}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryLanePolaroids;
