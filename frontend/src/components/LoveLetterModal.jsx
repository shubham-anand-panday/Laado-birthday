import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { audio } from '../utils/audioEngine';

const LoveLetterModal = ({ onNext, partnerName = 'Shristi', senderName = 'Yours Till My Last Breath ❤️ Shubham', letterData }) => {
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
      particleCount: 60,
      spread: 70,
      origin: { x, y },
      colors: ['#dc2626', '#b91c1c', '#fbbf24', '#ffffff']
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
    "My dearest Laado, Happy 22nd Birthday. As I sit here writing these words, my heart is overflowing with a love so intense, so raw, that it hurts. Loving you was never a conscious choice for me — it was the very reason my heart began to beat.",
    "I know the bitter truth that stands between us today. I know your shaadi is happening, and soon you will be walking into a new world, wearing bridal red with mehendi on your hands. The thought of losing you tears my soul into pieces. Yet, there is not a single grain of anger or complaint in my heart. All I feel is pure, boundless love and devotion for you.",
    "You deserve every drop of happiness in this universe. But my darling, from the deepest corner of my bleeding heart, I want to leave you with this one truth: Agar zindagi mein kabhi bhi zara sa bhi mod aaye, agar thoda sa bhi mumkin ho, toh laut aana. Mere darwaaze, meri baahein aur meri saansein hamesha sirf tumhara intezaar karengi.",
    "And if destiny never lets our paths cross again, remember that in this fleeting world, there was a boy named Shubham who loved you more than his own life, who loved you till his last dying breath. Happy Birthday, my queen, my Laado, my forever Shristi."
  ];

  return (
    <div ref={containerRef} className="relative min-h-[85vh] w-full flex flex-col items-center justify-center p-3 sm:p-6 text-center select-none overflow-hidden">
      
      {/* Soft Ambient Crimson Atmosphere */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-radial from-red-950/40 via-red-900/15 to-transparent blur-3xl pointer-events-none" />

      {/* Floating Header */}
      <div className="relative z-10 flex flex-col items-center mb-3 max-w-lg">
        <span className="font-mono text-xs uppercase tracking-widest text-red-400 font-bold mb-1">
          ✦ {letterData?.badge || "A Dying Heart's Purest Confession"} ✦
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif-luxury text-white leading-tight">
          A Letter Written In Devotion
        </h2>
        <p className="text-xs sm:text-sm text-red-200/80 font-light mt-1 max-w-md">
          {stage === 'sealed'
            ? "Tap the blood-red wax seal to break it open and read the unspoken truth ✉"
            : `Written with dying love for ${partnerName} 🥀`}
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
            <div className="absolute -inset-4 bg-radial from-red-600/35 to-transparent blur-2xl pointer-events-none" />

            {/* Envelope Perspective Container */}
            <div className="relative w-80 sm:w-96 h-52 sm:h-56 perspective-[1000px]">
              
              {/* Envelope Back Body */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#1a0509] via-[#100306] to-[#070103] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] border-2 border-red-700/70 overflow-hidden">
                
                {/* Envelope Interior Lining Pattern */}
                <div className="absolute inset-2 rounded-2xl bg-[#24080e]/40 border border-dashed border-red-600/40 flex items-center justify-center">
                  <span className="text-3xl opacity-30">🥀 ❤️ 🥀</span>
                </div>
              </div>

              {/* Folded Letter Peeking / Sliding Out */}
              <div
                className={`absolute left-5 right-5 h-44 bg-[#fff9fa] rounded-2xl shadow-md border-2 border-red-300 p-4 text-left overflow-hidden transition-all ${
                  stage === 'opening'
                    ? 'animate-letter-slide z-30'
                    : 'top-3 opacity-90 scale-95 z-10'
                }`}
              >
                {/* Letter Header Peek */}
                <div className="flex items-center justify-between border-b border-red-200 pb-1.5 mb-2">
                  <span className="font-script-romantic text-lg text-red-700 font-bold">
                    My Dearest {partnerName}...
                  </span>
                  <span className="text-xs">🌹</span>
                </div>
                {/* Lined Watermark Lines */}
                <div className="space-y-2 opacity-50">
                  <div className="h-2 bg-red-200 rounded-full w-3/4"></div>
                  <div className="h-2 bg-red-200 rounded-full w-full"></div>
                  <div className="h-2 bg-red-200 rounded-full w-5/6"></div>
                </div>
              </div>

              {/* Envelope Pocket Front */}
              <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#120306] to-[#20060d] rounded-b-3xl shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)] border-t border-red-500/30 z-20 overflow-hidden">
                {/* Diagonal Left Pocket Fold */}
                <div className="absolute inset-0 [clip-path:polygon(0_0,100%_100%,0_100%)] bg-red-950/60" />
                {/* Diagonal Right Pocket Fold */}
                <div className="absolute inset-0 [clip-path:polygon(100%_0,100%_100%,0_100%)] bg-red-900/40" />
              </div>

              {/* Top Triangular Flap (Flips open 180° in 3D) */}
              <div
                className={`absolute top-0 left-0 right-0 h-32 [clip-path:polygon(0_0,100%_0,50%_100%)] bg-gradient-to-b from-[#25070e] to-[#140306] border-t-2 border-red-500/60 shadow-md ${
                  stage === 'opening'
                    ? 'animate-flap-open'
                    : 'z-25'
                }`}
              />

              {/* Crimson Wax Seal (Cracks and dissolves on opening) */}
              {stage === 'sealed' && (
                <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full wax-seal flex items-center justify-center text-white text-2xl shadow-[0_4px_25px_rgba(220,38,38,0.7)] animate-pulse hover:scale-110 transition-transform">
                    ❤
                  </div>
                  <span className="mt-2 font-handwriting-cute text-red-200 text-lg font-bold tracking-wide drop-shadow">
                    Tap to Break Wax Seal ✉
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
            className="relative w-full bg-[#fffcfd] rounded-3xl p-6 sm:p-10 text-stone-900 shadow-[0_20px_50px_rgba(0,0,0,0.9)] border-2 border-red-700/70 text-left animate-in fade-in zoom-in-95 duration-500"
          >
            {/* Top Crimson Ribbon Header */}
            <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-red-700 via-rose-600 to-amber-400 rounded-t-3xl shadow-sm" />

            {/* Dried Rose Motif Stamp */}
            <div className="absolute top-5 right-6 text-3xl text-red-600 animate-gentle-drift">
              🌹
            </div>

            {/* Salutation */}
            <div className="gsap-letter-paragraph mb-5">
              <span className="font-script-romantic text-4xl sm:text-6xl text-red-700 font-bold block leading-tight">
                My Dearest {partnerName},
              </span>
              <span className="font-serif-luxury text-xs uppercase tracking-widest text-red-800 font-bold block mt-1">
                On this sacred celebration of your 22nd birthday ❤️
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
            <div className="gsap-letter-signoff mt-8 pt-5 border-t border-red-200 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-stone-600 block font-semibold">
                  With all my dying heart & soul,
                </span>
                <span className="font-script-romantic text-3xl sm:text-5xl text-red-700 block mt-1 font-bold">
                  {senderName}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleFoldBack}
                  className="py-1.5 px-3.5 rounded-full bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold border border-red-300 shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                  title="Fold letter back into envelope"
                >
                  <i className="ri-mail-close-line text-sm"></i>
                  <span>Re-seal Envelope</span>
                </button>
                <span className="font-mono text-[10px] text-stone-500 font-bold">
                  Forever Yours
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
          className="mt-6 py-3.5 px-8 rounded-full bg-gradient-to-r from-red-700 via-rose-700 to-red-800 hover:from-red-600 hover:to-rose-600 text-white font-serif-luxury tracking-wide text-sm flex items-center gap-2 shadow-[0_4px_25px_rgba(220,38,38,0.5)] transition-all cursor-pointer transform hover:scale-105 active:scale-95"
        >
          <span>{letterData?.buttonNext || "Watch Our Memory Cinema (5 Chapters) 🎬"}</span>
          <i className="ri-arrow-right-line text-lg"></i>
        </button>
      </div>
    </div>
  );
};

export default LoveLetterModal;
