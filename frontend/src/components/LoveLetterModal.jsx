import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { audio } from '../utils/audioEngine';

const LoveLetterModal = ({ onNext, partnerName = 'Ananya', senderName = 'Forever Yours', letterData }) => {
  // 'sealed' | 'opening' | 'opened'
  const [stage, setStage] = useState('sealed');
  const containerRef = useRef(null);
  const letterContentRef = useRef(null);

  useEffect(() => {
    // Initial entrance on envelope
    const ctx = gsap.context(() => {
      gsap.fromTo('.gsap-envelope',
        { scale: 0.85, y: 25, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.4)', clearProps: 'all' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleOpenEnvelope = (e) => {
    if (stage !== 'sealed') return;

    audio.playTap();
    setStage('opening');

    // Confetti burst on wax seal crack
    let x = 0.5;
    let y = 0.5;
    if (e?.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      x = (rect.left + rect.width / 2) / window.innerWidth;
      y = (rect.top + rect.height / 2) / window.innerHeight;
    }

    confetti({
      particleCount: 45,
      spread: 60,
      origin: { x, y },
      colors: ['#f43f5e', '#ec4899', '#fbbf24', '#ffffff']
    });

    // After flap opens and letter slides out (1.1s), transition to full manuscript
    setTimeout(() => {
      setStage('opened');
      audio.playChimeSuccess();

      // GSAP animate unfolded parchment content
      setTimeout(() => {
        if (letterContentRef.current) {
          gsap.fromTo('.gsap-letter-paragraph',
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, stagger: 0.18, duration: 0.6, ease: 'power2.out', clearProps: 'all' }
          );
          gsap.fromTo('.gsap-letter-signoff',
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.5, delay: 0.6, ease: 'back.out(1.4)', clearProps: 'all' }
          );
        }
      }, 50);
    }, 1100);
  };

  const handleFoldBack = () => {
    audio.playTap();
    setStage('sealed');
  };

  const paragraphs = letterData?.paragraphs || [
    "I don't think I tell you this enough, but having you in my life has been one of the greatest gifts the universe has ever given me.",
    "Thank you for being patient with me, for making me laugh until my cheeks hurt, for listening to my endless stories, and for loving me even on the days I am difficult to love.",
    "No matter how busy the world gets, I hope you always remember one simple truth: you will forever and always be my favorite person in the entire world."
  ];

  return (
    <div ref={containerRef} className="relative min-h-[85vh] w-full flex flex-col items-center justify-center p-3 sm:p-6 text-center select-none overflow-hidden">
      
      {/* Soft Ambient Light Pink Atmosphere */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-radial from-rose-300/25 via-pink-200/20 to-transparent blur-3xl pointer-events-none" />

      {/* Floating Header */}
      <div className="relative z-10 flex flex-col items-center mb-3 max-w-lg">
        <span className="font-mono text-xs uppercase tracking-widest text-rose-700 font-bold mb-1">
          ✦ {letterData?.badge || "Words From The Heart"} ✦
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif-luxury text-rose-950 leading-tight">
          A Letter Written Just For You
        </h2>
        <p className="text-xs sm:text-sm text-rose-900/90 font-medium mt-1 max-w-md">
          {stage === 'sealed'
            ? "Tap the wax seal to break it open and watch the letter unfold ✉"
            : `Written with infinite love for ${partnerName} 🌸`}
        </p>
      </div>

      {/* ===================== ENVELOPE OPENING CEREMONY ===================== */}
      <div className="relative z-10 w-full max-w-xl my-2 flex flex-col items-center">
        {stage !== 'opened' ? (
          <div
            onClick={handleOpenEnvelope}
            className={`gsap-envelope relative cursor-pointer my-4 transition-all duration-300 ${
              stage === 'sealed' ? 'hover:scale-105 active:scale-95' : ''
            }`}
            title="Tap the wax seal to open the letter"
          >
            {/* Ambient Back Glow */}
            <div className="absolute -inset-4 bg-radial from-rose-400/30 to-transparent blur-2xl pointer-events-none" />

            {/* Envelope Perspective Container */}
            <div className="relative w-80 sm:w-96 h-52 sm:h-56 perspective-[1000px]">
              
              {/* Envelope Back Body */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#fde2ea] via-[#fff0f5] to-[#f8bbd0] rounded-3xl shadow-[0_20px_45px_rgba(244,63,94,0.22)] border-2 border-rose-300/80 overflow-hidden">
                
                {/* Envelope Interior Lining Pattern (Pink Floral Watermark) */}
                <div className="absolute inset-2 rounded-2xl bg-[#fff5f8] opacity-60 border border-dashed border-rose-300 flex items-center justify-center">
                  <span className="text-3xl opacity-20">🌸 💕 🌸</span>
                </div>
              </div>

              {/* Folded Letter Peeking / Sliding Out */}
              <div
                className={`absolute left-5 right-5 h-44 bg-white rounded-2xl shadow-md border-2 border-rose-200/90 p-4 text-left overflow-hidden transition-all ${
                  stage === 'opening'
                    ? 'animate-letter-slide z-30'
                    : 'top-3 opacity-90 scale-95 z-10'
                }`}
              >
                {/* Letter Header Peek */}
                <div className="flex items-center justify-between border-b border-rose-200 pb-1.5 mb-2">
                  <span className="font-script-romantic text-lg text-rose-700 font-bold">
                    My Dearest {partnerName}...
                  </span>
                  <span className="text-xs">🌹</span>
                </div>
                {/* Lined Watermark Lines */}
                <div className="space-y-2 opacity-50">
                  <div className="h-2 bg-rose-200 rounded-full w-3/4"></div>
                  <div className="h-2 bg-rose-200 rounded-full w-full"></div>
                  <div className="h-2 bg-rose-200 rounded-full w-5/6"></div>
                </div>
              </div>

              {/* Envelope Pocket Front (Triangles that create pocket depth) */}
              <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#f8bbd0] to-[#fce4ec] rounded-b-3xl shadow-[inset_0_4px_10px_rgba(0,0,0,0.04)] border-t border-white z-20 overflow-hidden">
                {/* Diagonal Left Pocket Fold */}
                <div className="absolute inset-0 [clip-path:polygon(0_0,100%_100%,0_100%)] bg-[#f8bbd0]/60" />
                {/* Diagonal Right Pocket Fold */}
                <div className="absolute inset-0 [clip-path:polygon(100%_0,100%_100%,0_100%)] bg-[#f48fb1]/40" />
              </div>

              {/* Top Triangular Flap (Flips open 180° in 3D) */}
              <div
                className={`absolute top-0 left-0 right-0 h-32 [clip-path:polygon(0_0,100%_0,50%_100%)] bg-gradient-to-b from-[#fce4ec] to-[#f8bbd0] border-t-2 border-white/80 shadow-md ${
                  stage === 'opening'
                    ? 'animate-flap-open'
                    : 'z-25'
                }`}
              />

              {/* Crimson Wax Seal (Cracks and dissolves on opening) */}
              {stage === 'sealed' && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full wax-seal flex items-center justify-center text-white text-2xl shadow-[0_4px_25px_rgba(244,63,94,0.5)] animate-pulse hover:scale-110 transition-transform">
                    ❤
                  </div>
                  <span className="mt-2 font-handwriting-cute text-rose-950 text-lg font-bold tracking-wide drop-shadow-xs">
                    Tap to Break Seal ✉
                  </span>
                </div>
              )}

              {/* Animated Wax Crack during opening stage */}
              {stage === 'opening' && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 pointer-events-none animate-wax-crack">
                  <div className="w-14 h-14 rounded-full wax-seal flex items-center justify-center text-white text-2xl">
                    💥
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ===================== REVEALED UNROLLED PARCHMENT ===================== */
          <div
            ref={letterContentRef}
            className="relative w-full bg-white/95 rounded-3xl p-6 sm:p-10 text-stone-900 shadow-[0_20px_50px_rgba(244,63,94,0.18)] border-2 border-rose-300 text-left animate-in fade-in zoom-in-95 duration-500"
          >
            {/* Top Rose Silk Ribbon Header */}
            <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-rose-500 via-pink-400 to-amber-300 rounded-t-3xl shadow-sm" />

            {/* Dried Rose Motif Stamp */}
            <div className="absolute top-5 right-6 text-3xl text-rose-500 animate-gentle-drift">
              🌹
            </div>

            {/* Salutation */}
            <div className="gsap-letter-paragraph mb-5">
              <span className="font-script-romantic text-4xl sm:text-6xl text-rose-700 font-bold block leading-tight">
                My Dearest {partnerName},
              </span>
              <span className="font-serif-luxury text-xs uppercase tracking-widest text-rose-800 font-bold block mt-1">
                On this sacred celebration of your 20th year ❤️
              </span>
            </div>

            {/* Letter Body Paragraphs */}
            <div className="space-y-4 font-handwriting-cute text-2xl sm:text-3xl text-stone-900 leading-relaxed">
              {paragraphs.map((p, idx) => (
                <p key={idx} className="gsap-letter-paragraph">
                  {p}
                </p>
              ))}
            </div>

            {/* Sign-off */}
            <div className="gsap-letter-signoff mt-8 pt-5 border-t border-rose-200 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-stone-600 block font-semibold">
                  With all my heart & soul,
                </span>
                <span className="font-script-romantic text-3xl sm:text-5xl text-rose-600 block mt-1 font-bold">
                  {senderName}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleFoldBack}
                  className="py-1.5 px-3.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-300 shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  title="Fold letter back into envelope"
                >
                  <i className="ri-mail-close-line text-sm"></i>
                  <span>Re-seal Envelope</span>
                </button>
                <span className="font-mono text-[10px] text-stone-500 font-bold">
                  Forever & Always
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Continue Button to Video Reel Moments */}
        <button
          onClick={() => {
            audio.playTap();
            onNext();
          }}
          className="mt-6 py-3.5 px-8 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-400 text-white font-serif-luxury tracking-wide text-sm flex items-center gap-2 shadow-[0_4px_25px_rgba(244,63,94,0.3)] transition-all cursor-pointer transform hover:scale-105 active:scale-95"
        >
          <span>{letterData?.buttonNext || "Watch Our Love Cinema (6 Videos) 🎬"}</span>
          <i className="ri-arrow-right-line text-lg"></i>
        </button>
      </div>
    </div>
  );
};

export default LoveLetterModal;
