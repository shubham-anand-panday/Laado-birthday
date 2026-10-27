import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { audio } from '../utils/audioEngine';
import confetti from 'canvas-confetti';

const PasscodeScreen = ({ onUnlock, partnerName = 'Debuu', secretPin = '12042005' }) => {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorPulse, setErrorPulse] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const containerRef = useRef(null);

  const pinLength = secretPin ? secretPin.length : 8;

  useEffect(() => {
    // GSAP entrance with clearProps so elements never get stuck invisible
    const ctx = gsap.context(() => {
      gsap.fromTo('.gsap-locket',
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.5)', clearProps: 'all' }
      );
      gsap.fromTo('.gsap-key-btn',
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.03, duration: 0.5, ease: 'back.out(1.7)', clearProps: 'all', delay: 0.1 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleKeyPress = (num) => {
    audio.playTap();
    if (pin.length < pinLength) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === pinLength) {
        verifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    audio.playTap();
    setPin(prev => prev.slice(0, -1));
  };

  // Keyboard shortcut listener for desktop typing
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isUnlocked) return;
      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, isUnlocked, secretPin, pinLength]);

  const unlockWithCelebration = () => {
    setIsUnlocked(true);
    audio.playHeartbeat();
    audio.playChimeSuccess();

    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#fda4af', '#f43f5e', '#fbbf24', '#ffffff']
    });

    setTimeout(() => {
      onUnlock();
    }, 500);
  };

  const verifyPin = (enteredPin) => {
    if (
      enteredPin === secretPin ||
      enteredPin === '00000000' ||
      enteredPin === '11111111' ||
      enteredPin === '12345678' ||
      enteredPin === '0000' ||
      enteredPin === '1111'
    ) {
      unlockWithCelebration();
    } else {
      setErrorPulse(true);
      setTimeout(() => {
        setErrorPulse(false);
        setPin('');
        setHintVisible(true);
      }, 700);
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-[85vh] w-full flex flex-col items-center justify-center p-4 text-center select-none">
      
      {/* Soft Ambient Light Pink Halo */}
      <div className="absolute w-[520px] h-[520px] rounded-full bg-radial from-rose-300/30 via-pink-200/20 to-transparent blur-3xl pointer-events-none" />

      {/* Floating Header Flourish */}
      <div className="relative z-10 flex flex-col items-center mb-4 max-w-lg">
        <span className="font-script-romantic text-3xl sm:text-4xl text-rose-600 text-glow-rose mb-0.5 font-bold">
          A Celestial Wish for
        </span>
        <h1 className="text-4xl sm:text-6xl font-serif-luxury text-rose-950 tracking-wide font-normal mb-1">
          {partnerName}
        </h1>
        <p className="text-xs sm:text-sm text-rose-800/80 font-light max-w-sm leading-relaxed">
          The stars aligned on your birthday. Enter the {pinLength}-digit key to unlock your secret journey:
        </p>
      </div>

      {/* The Enchanted Golden Heart Locket Centerpiece */}
      <div className={`gsap-locket relative z-10 my-3 transition-transform duration-500 ${isUnlocked ? 'scale-110' : 'scale-100'}`}>
        
        {/* Golden Ornate Locket Frame */}
        <div className="relative w-44 h-44 sm:w-50 sm:h-50 flex items-center justify-center mx-auto">
          
          {/* Pulsing Light Pink Outer Halo */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-300/40 via-amber-200/40 to-pink-300/40 blur-xl animate-pulse" />

          {/* Golden Heart SVG Locket */}
          <div className="relative z-10 w-full h-full flex items-center justify-center filter drop-shadow-[0_10px_20px_rgba(244,63,94,0.25)]">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="goldHeartGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="35%" stopColor="#f59e0b" />
                  <stop offset="65%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="roseVelvetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="50%" stopColor="#e11d48" />
                  <stop offset="100%" stopColor="#9f1239" />
                </linearGradient>
              </defs>

              {/* Heart Silhouette Outer Golden Rim */}
              <path
                d="M 50,88 C 20,68 6,48 6,30 C 6,14 18,6 32,6 C 41,6 47,11 50,17 C 53,11 59,6 68,6 C 82,6 94,14 94,30 C 94,48 80,68 50,88 Z"
                fill="url(#goldHeartGradLight)"
                stroke="#fef08a"
                strokeWidth="1.5"
              />

              {/* Rose Velvet Interior Cushion */}
              <path
                d="M 50,82 C 24,64 12,46 12,31 C 12,18 22,11 33,11 C 41,11 46,15 50,21 C 54,15 59,11 67,11 C 78,11 88,18 88,31 C 88,46 76,64 50,82 Z"
                fill="url(#roseVelvetGrad)"
              />

              {/* Filigree Rose Gold Accents */}
              <path
                d="M 50,32 L 50,65 M 35,45 Q 50,55 65,45"
                stroke="#fef08a"
                strokeWidth="1"
                fill="none"
                opacity="0.8"
              />
            </svg>

            {/* Glowing Golden Keyhole */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <i className="ri-key-fill text-2xl sm:text-3xl text-amber-200 filter drop-shadow-[0_0_8px_#fde047] animate-pulse"></i>
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-100 mt-1 font-semibold">
                Locket of Love
              </span>
            </div>
          </div>
        </div>

        {/* 8 Constellation Starlight Passcode Nodes */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-3.5 flex-wrap max-w-[280px] sm:max-w-none mx-auto">
          {Array.from({ length: pinLength }).map((_, idx) => {
            const isFilled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`relative flex items-center justify-center transition-all duration-300 ${
                  isFilled ? 'scale-115 sm:scale-125' : 'scale-100'
                }`}
              >
                {isFilled ? (
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 shadow-[0_0_12px_#f59e0b] border border-white flex items-center justify-center text-[8px] sm:text-[10px] text-white">
                    ✦
                  </div>
                ) : (
                  <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-rose-300 bg-white/70 shadow-inner" />
                )}
              </div>
            );
          })}
        </div>

        {errorPulse && (
          <p className="text-xs text-rose-600 font-medium mt-2 animate-bounce">
            The locket whispers: Try again, my love ✨
          </p>
        )}
      </div>

      {/* Floating Light Pink Petal Number Buttons (With GSAP Stagger) */}
      <div className="relative z-10 w-full max-w-[280px] my-2">
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="gsap-key-btn w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-white/80 hover:bg-white active:scale-90 border border-rose-200 hover:border-rose-400 text-xl font-medium text-rose-950 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-[0_4px_14px_rgba(244,63,94,0.1)] backdrop-blur-md hover:shadow-[0_6px_20px_rgba(244,63,94,0.2)]"
            >
              <span>{num}</span>
            </button>
          ))}

          {/* Bypass Heart Key */}
          <button
            onClick={unlockWithCelebration}
            title="Unlock with Heart's Touch"
            className="gsap-key-btn w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-rose-500/15 hover:bg-rose-500/30 active:scale-90 border border-rose-300 text-rose-600 flex items-center justify-center transition-all cursor-pointer shadow-[0_2px_10px_rgba(244,63,94,0.15)]"
          >
            <i className="ri-heart-3-fill text-xl text-rose-500"></i>
          </button>

          {/* Zero */}
          <button
            onClick={() => handleKeyPress(0)}
            className="gsap-key-btn w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-white/80 hover:bg-white active:scale-90 border border-rose-200 hover:border-rose-400 text-xl font-medium text-rose-950 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-[0_4px_14px_rgba(244,63,94,0.1)] backdrop-blur-md hover:shadow-[0_6px_20px_rgba(244,63,94,0.2)]"
          >
            <span>0</span>
          </button>

          {/* Backspace */}
          <button
            onClick={handleDelete}
            disabled={pin.length === 0}
            className="gsap-key-btn w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-white/50 hover:bg-white/80 active:scale-90 border border-rose-200 text-rose-600/70 flex items-center justify-center disabled:opacity-20 transition-all cursor-pointer"
          >
            <i className="ri-delete-back-2-line text-lg"></i>
          </button>
        </div>
      </div>

      {/* Romantic Hint Whisper */}
      <div className="relative z-10 mt-2 text-center">
        {hintVisible ? (
          <div className="text-xs text-rose-900 bg-white/90 border border-rose-300 px-4 py-2 rounded-full inline-block backdrop-blur-md animate-fade-in shadow-md">
            ✨ Secret Passcode is <span className="font-mono font-bold text-rose-600">{secretPin}</span> or tap the <span className="text-rose-500">❤</span> button
          </div>
        ) : (
          <button
            onClick={() => setHintVisible(true)}
            className="text-xs text-rose-700/70 hover:text-rose-900 underline underline-offset-4 cursor-pointer font-light transition-colors"
          >
            Whisper of the Stars (Need a hint?)
          </button>
        )}
      </div>
    </div>
  );
};

export default PasscodeScreen;
