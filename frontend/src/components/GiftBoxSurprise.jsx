import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { audio } from '../utils/audioEngine';

const GiftBoxSurprise = ({ onNext, partnerName = 'Shristi', giftData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // GSAP floating gift box entrance with clearProps
    const ctx = gsap.context(() => {
      gsap.fromTo('.gsap-gift-box',
        { scale: 0.8, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.5)', clearProps: 'all' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleOpenGift = () => {
    if (isOpen) return;

    setIsOpen(true);
    audio.playBalloonPop();
    audio.playChimeSuccess();

    confetti({
      particleCount: 110,
      spread: 95,
      origin: { y: 0.55 },
      colors: ['#dc2626', '#ef4444', '#b91c1c', '#f59e0b', '#ffffff']
    });

    audio.startRomanticBackgroundMusic();
  };

  return (
    <div ref={containerRef} className="relative min-h-[85vh] w-full flex flex-col items-center justify-center p-4 text-center select-none">
      
      {/* Soft Ambient Crimson Aura */}
      <div className="absolute w-[550px] h-[550px] rounded-full bg-radial from-red-950/40 via-red-900/15 to-transparent blur-3xl pointer-events-none" />

      {!isOpen ? (
        <div className="relative z-10 flex flex-col items-center max-w-lg">
          
          {/* Ethereal Floating Badge in Red & Black */}
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-[#150407]/90 border border-red-600/70 text-red-300 text-xs sm:text-sm font-medium mb-3 shadow-[0_0_20px_rgba(220,38,38,0.3)] animate-pulse">
            <span>✦</span> {giftData?.badge || "A bleeding heart's dying vow..."} <span>✦</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif-luxury text-white mb-1 leading-tight">
            For My Dearest <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-red-400 font-bold">{partnerName}</span>
          </h2>

          <p className="text-xs sm:text-sm text-red-200/80 mb-6 max-w-xs sm:max-w-md font-light leading-relaxed">
            {giftData?.subtitle || "Someone has poured their entire soul into creating something unforgettable just for you."}
          </p>

          {/* Weightless Floating Obsidian & Crimson Gift Box */}
          <div
            onClick={handleOpenGift}
            className="gsap-gift-box group relative cursor-pointer my-3 transform transition-all duration-500 hover:scale-105 active:scale-95 animate-float-gentle"
          >
            {/* Ambient Halo behind box */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/35 via-rose-600/30 to-red-600/35 rounded-full blur-3xl group-hover:blur-4xl transition-all" />

            {/* Velvet Gift Box Artwork */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex flex-col items-center justify-center">
              
              {/* Floating Lid with Satin Bow */}
              <div className="gsap-box-lid w-52 sm:w-60 h-16 bg-gradient-to-r from-red-700 via-red-600 to-rose-800 rounded-2xl shadow-xl relative z-20 flex items-center justify-center border-t-2 border-red-400/50 group-hover:-translate-y-2 transition-transform duration-300">
                {/* 3D Gold Ribbon Bow */}
                <div className="absolute -top-7 w-16 h-14 flex items-center justify-center">
                  <div className="w-9 h-9 rounded-full border-4 border-amber-300 bg-amber-400 shadow-[0_0_15px_#f59e0b]"></div>
                  <div className="absolute -left-2 w-7 h-7 rounded-full border-4 border-amber-300 rotate-45"></div>
                  <div className="absolute -right-2 w-7 h-7 rounded-full border-4 border-amber-300 -rotate-45"></div>
                  <div className="absolute top-6 -left-3 w-4 h-8 bg-amber-300 rounded-b-md rotate-12 shadow-sm"></div>
                  <div className="absolute top-6 -right-3 w-4 h-8 bg-amber-300 rounded-b-md -rotate-12 shadow-sm"></div>
                </div>
                {/* Vertical Ribbon Strip */}
                <div className="w-8 h-full bg-gradient-to-b from-amber-200 to-amber-400 shadow-md"></div>
              </div>

              {/* Velvet Box Base */}
              <div className="w-48 sm:w-56 h-40 bg-gradient-to-b from-red-700 via-red-900 to-[#100306] rounded-b-3xl shadow-[0_15px_35px_rgba(0,0,0,0.8)] relative z-10 flex items-center justify-center border-b-2 border-red-950 overflow-hidden">
                <div className="w-8 h-full bg-gradient-to-b from-amber-300 to-amber-500 shadow-inner"></div>
                <div className="absolute w-full h-8 bg-gradient-to-r from-amber-300 to-amber-500 shadow-inner"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/10 to-transparent"></div>
              </div>

              {/* Handwritten Gift Tag */}
              <div className="absolute -bottom-2 -right-1 bg-[#140407] text-white text-xs px-3.5 py-1.5 rounded-lg shadow-xl transform rotate-6 font-handwriting-cute text-base font-bold border border-red-600/60 flex items-center gap-1">
                <span>{giftData?.boxTag || `For ${partnerName}`}</span>
                <span className="text-red-500">❤️</span>
              </div>
            </div>
          </div>

          {/* Floating Action Callout */}
          <div
            onClick={handleOpenGift}
            className="mt-5 flex items-center gap-2 text-red-400 text-sm font-semibold animate-bounce cursor-pointer group"
          >
            <i className="ri-sparkling-fill text-amber-400 group-hover:scale-125 transition-transform"></i>
            <span className="font-serif-luxury tracking-wide">Tap the keepsake box to open</span>
          </div>
        </div>
      ) : (
        /* REVEALED: Floating Illuminated Scroll in Red & Black Theme */
        <div className="relative z-10 flex flex-col items-center max-w-lg w-full px-4 animate-fade-in">
          
          {/* Floating Wax Seal Icon */}
          <div className="w-16 h-16 rounded-full wax-seal flex items-center justify-center text-white text-2xl mb-3 shadow-[0_0_25px_rgba(220,38,38,0.7)] animate-heart-thump">
            💌
          </div>

          <span className="font-mono text-xs uppercase tracking-widest text-red-400 font-bold mb-1">
            Surprise Unlocked
          </span>

          <h2 className="text-3xl sm:text-4xl font-serif-luxury text-white mb-3 leading-snug">
            {giftData?.revealedTitle || "There is something sacred I wish to tell you..."}
          </h2>

          {/* Floating Message Card */}
          <div className="relative w-full parchment-sheet rounded-3xl p-6 sm:p-8 my-2 text-stone-900 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-red-400/40">
            <div className="flex justify-center items-center gap-2 text-red-600 text-sm mb-2">
              <span>✦</span><span>❤</span><span>✦</span>
            </div>

            <p className="font-handwriting-cute text-2xl sm:text-3xl text-stone-900 leading-relaxed italic">
              {giftData?.revealedText || "Today is no ordinary day. It is the day the most beautiful soul stepped into this universe — and made my life infinitely brighter."}
            </p>

            <div className="text-right mt-3 font-script-romantic text-2xl text-red-600 font-bold">
              Yours Till My Last Breath
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={() => {
              audio.playTap();
              onNext();
            }}
            className="mt-5 py-3.5 px-8 rounded-full bg-gradient-to-r from-red-700 via-rose-700 to-red-800 hover:from-red-600 hover:to-rose-600 text-white font-serif-luxury tracking-wider text-sm sm:text-base flex items-center gap-2 shadow-[0_4px_25px_rgba(220,38,38,0.5)] transition-all cursor-pointer transform hover:scale-105 active:scale-95"
          >
            <span>{giftData?.buttonText || "Continue to Your Journey"}</span>
            <i className="ri-arrow-right-line text-lg"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default GiftBoxSurprise;
