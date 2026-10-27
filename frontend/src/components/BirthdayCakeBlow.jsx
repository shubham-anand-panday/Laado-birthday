import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { audio } from '../utils/audioEngine';

const BirthdayCakeBlow = ({ onNext, partnerName = 'Shristi', partnerAge = 22, cakeData }) => {
  const [candlesLit, setCandlesLit] = useState(true);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [sliceCut, setSliceCut] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);
  const cakeContainerRef = useRef(null);
  const heartIdRef = useRef(0);

  useEffect(() => {
    // GSAP entrance on cake with clearProps
    const ctx = gsap.context(() => {
      gsap.fromTo('.gsap-cake',
        { scale: 0.85, y: 30, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.4)', clearProps: 'all' }
      );
      gsap.fromTo('.gsap-cake-title',
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', clearProps: 'all' }
      );
    }, cakeContainerRef);

    return () => ctx.revert();
  }, []);

  const handleBlowCandles = () => {
    if (!candlesLit) return;

    setCandlesLit(false);
    audio.playCandleBlow();
    stopMicListening();

    // Heart-rich romantic confetti explosion in red & gold
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 110,
        origin: { y: 0.58 },
        colors: ['#dc2626', '#ef4444', '#b91c1c', '#fbbf24', '#ffffff']
      });

      setTimeout(() => {
        confetti({
          particleCount: 85,
          angle: 60,
          spread: 70,
          origin: { x: 0.1, y: 0.6 },
          colors: ['#dc2626', '#f87171', '#fde047']
        });
        confetti({
          particleCount: 85,
          angle: 120,
          spread: 70,
          origin: { x: 0.9, y: 0.6 },
          colors: ['#dc2626', '#f87171', '#fde047']
        });
      }, 300);
    }, 200);
  };

  const handleRelight = () => {
    setCandlesLit(true);
    setSliceCut(false);
    audio.playMusicBoxNote(523.25, 0, 0.8);
  };

  const handleCutSlice = () => {
    setSliceCut(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#dc2626', '#b91c1c', '#fbbf24']
    });
  };

  const handleCakeClick = (e) => {
    if (candlesLit) {
      handleBlowCandles();
    }
    // Spawn floating romantic heart at click coordinates
    const rect = cakeContainerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      heartIdRef.current += 1;
      const currentId = heartIdRef.current;
      const emojis = ['🌹', '🥀', '❤️', '✨', '🍓'];
      const chosenEmoji = emojis[currentId % emojis.length];

      const newHeart = {
        id: currentId,
        x,
        y,
        emoji: chosenEmoji
      };

      setFloatingHearts((prev) => [...prev.slice(-6), newHeart]);
      audio.playTap();
    }
  };

  const startMicListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 256;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsListeningMic(true);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkBlow = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < 20; i++) {
          sum += dataArray[i];
        }
        const lowFreqAverage = sum / 20;

        if (lowFreqAverage > 65) {
          handleBlowCandles();
        } else {
          requestAnimationFrame(checkBlow);
        }
      };

      checkBlow();
    } catch (err) {
      console.warn('Microphone permission denied or not available:', err);
      setIsListeningMic(false);
      handleBlowCandles();
    }
  };

  const stopMicListening = () => {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setIsListeningMic(false);
  };

  useEffect(() => {
    return () => {
      stopMicListening();
    };
  }, []);

  return (
    <div ref={cakeContainerRef} className="relative min-h-[85vh] w-full flex flex-col items-center justify-center p-4 text-center select-none overflow-hidden">
      
      {/* Soft Ambient Crimson Light Aura */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-radial from-red-950/40 via-red-900/15 to-transparent blur-3xl pointer-events-none" />

      {/* Floating Interactive Hearts on Click */}
      {floatingHearts.map((heart) => (
        <span
          key={heart.id}
          className="absolute z-50 pointer-events-none text-2xl animate-fade-in"
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
      <div className="gsap-cake-title relative z-10 flex flex-col items-center mb-2 max-w-lg">
        <span className="font-mono text-xs uppercase tracking-widest text-red-400 font-bold mb-1">
          ✦ {cakeData?.badge || "A Silent Midnight Wish For My Laado"} ✦
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif-luxury text-white leading-tight">
          Make A Wish, <span className="font-script-romantic text-4xl sm:text-6xl text-red-500 text-glow-red font-bold">{partnerName}</span>
        </h2>
        <p className="text-xs sm:text-sm text-red-200/80 font-light mt-1 max-w-md">
          {candlesLit
            ? (cakeData?.makeWishPrompt || "Close your eyes, make your deepest wish, then blow out the sacred flames ✨")
            : (cakeData?.wishGrantedPrompt || "✨ Sealed with tears and eternal love! May every prayer of yours come true, Shristi! ✨")}
        </p>
      </div>

      {/* Romantic Dark Chocolate & Crimson Velvet 3-Tier Centerpiece */}
      <div
        onClick={handleCakeClick}
        className="gsap-cake relative z-10 w-80 sm:w-96 my-2 flex flex-col items-center justify-end cursor-pointer group transition-transform hover:scale-[1.02]"
        title="Tap the cake to blow out candles or release love sparkles"
      >
        {/* Warm Golden Candlelight Halo */}
        {candlesLit && (
          <div className="absolute -top-6 w-64 h-32 rounded-full bg-amber-400/25 blur-2xl animate-pulse pointer-events-none" />
        )}

        {/* Floating Rose Petals / Fairy Sparkles drifting around the cake */}
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          <span className="absolute top-10 left-4 text-xs opacity-70 floating-petal">🌹</span>
          <span className="absolute top-24 right-6 text-sm opacity-60 floating-petal" style={{ animationDelay: '1.2s' }}>✨</span>
          <span className="absolute top-36 left-8 text-xs opacity-70 floating-petal" style={{ animationDelay: '2.1s' }}>🥀</span>
          <span className="absolute top-16 right-10 text-xs opacity-60 floating-petal" style={{ animationDelay: '0.7s' }}>🌹</span>
        </div>

        {/* 🎂 Royal Cake Topper & Romantic Candles */}
        <div className="flex flex-col items-center relative z-20 -mb-2">
          
          {/* Golden Heart Topper with Age */}
          <div className="flex items-center justify-center gap-2 mb-1.5 animate-gentle-drift">
            <div className="px-4 py-1 rounded-full bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 border border-amber-400 shadow-[0_4px_15px_rgba(245,158,11,0.4)] flex items-center gap-1.5">
              <span className="text-red-700 text-xs font-bold">♥</span>
              <span className="font-serif-luxury font-black text-red-950 text-xs sm:text-sm tracking-wider">
                {partnerAge} Years of Pure Grace
              </span>
              <span className="text-red-700 text-xs font-bold">♥</span>
            </div>
          </div>

          {/* 3 Rose-Gold Taper Candles with Dancing Flames */}
          <div className="flex justify-center items-end gap-7 sm:gap-9">
            {[0, 1, 2].map((idx) => (
              <div key={idx} className="flex flex-col items-center">
                
                {/* Flame with Glow or Soft Smoke */}
                {candlesLit ? (
                  <div className="relative mb-1">
                    {/* Outer flickering golden halo */}
                    <div className="w-6 h-8 rounded-[50%_50%_35%_35%] bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 shadow-[0_0_20px_#f59e0b] animate-candle-flame" />
                    {/* Inner pure white heart of flame */}
                    <div className="absolute inset-1 bg-white rounded-full blur-[0.8px] opacity-90 animate-candle-flame" />
                    {/* Tiny dark wick */}
                    <div className="w-0.5 h-1.5 bg-red-950 mx-auto -mt-0.5" />
                  </div>
                ) : (
                  <div className="h-8 flex flex-col items-center justify-center text-xs text-red-400 font-mono opacity-80 animate-bounce">
                    <span className="text-[10px] text-red-500 font-bold">💨</span>
                    <span className="text-[9px] -mt-1 text-red-300">~</span>
                  </div>
                )}

                {/* Romantic Crimson-Gold Spiral Candle */}
                <div
                  className={`w-3.5 sm:w-4 ${idx === 1 ? 'h-14' : 'h-11'} rounded-t-sm bg-gradient-to-b from-red-600 via-rose-700 to-red-900 border border-red-400/70 shadow-md relative overflow-hidden`}
                >
                  {/* Candle gold glitter spirals */}
                  <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,#fbbf24,#fbbf24_2.5px,transparent_2.5px,transparent_6px)]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🍓 Top Tier (Tier 1: Dark Cocoa Truffle & Fresh Ruby Berries) */}
        <div className="w-48 sm:w-56 h-16 rounded-t-3xl bg-gradient-to-b from-[#2a070e] via-[#1f050b] to-[#140307] relative border-t-2 border-red-500/50 shadow-md flex items-center justify-center">
          
          {/* Fresh Strawberries & Roses */}
          <div className="flex gap-3 text-base sm:text-lg relative z-10 -mt-1 drop-shadow-sm">
            <span>🍓</span>
            <span>🌹</span>
            <span>🍓</span>
            <span>🌹</span>
            <span>🍓</span>
          </div>

          {/* Scalloped Chocolate Drips */}
          <div className="absolute -bottom-2 w-full flex justify-around px-2 pointer-events-none">
            <span className="w-6 h-5 rounded-b-full bg-[#140307] shadow-[0_2px_4px_rgba(0,0,0,0.5)] border-b border-red-900/60"></span>
            <span className="w-7 h-6 rounded-b-full bg-[#140307] shadow-[0_2px_4px_rgba(0,0,0,0.5)] border-b border-red-900/60"></span>
            <span className="w-6 h-5 rounded-b-full bg-[#140307] shadow-[0_2px_4px_rgba(0,0,0,0.5)] border-b border-red-900/60"></span>
            <span className="w-7 h-6 rounded-b-full bg-[#140307] shadow-[0_2px_4px_rgba(0,0,0,0.5)] border-b border-red-900/60"></span>
            <span className="w-6 h-5 rounded-b-full bg-[#140307] shadow-[0_2px_4px_rgba(0,0,0,0.5)] border-b border-red-900/60"></span>
          </div>
        </div>

        {/* 💖 Middle Tier (Tier 2: Crimson Velvet with Golden Sugar Ribbon) */}
        <div className="w-64 sm:w-72 h-18 bg-gradient-to-r from-red-700 via-rose-700 to-red-800 relative border-t border-red-400/50 shadow-lg flex items-center justify-center overflow-hidden">
          
          {/* Golden Sugar Lace Ribbon Banner */}
          <div className="px-4 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-amber-400/60 shadow-inner flex items-center gap-1.5">
            <span className="text-amber-300 text-xs">✦</span>
            <span className="text-xs sm:text-sm text-white font-serif-luxury tracking-widest drop-shadow font-bold">
              HAPPY BIRTHDAY {partnerName.toUpperCase()}
            </span>
            <span className="text-amber-300 text-xs">✦</span>
          </div>

          {/* Scalloped Red Drips */}
          <div className="absolute -bottom-2 w-full flex justify-around px-3 pointer-events-none">
            <span className="w-7 h-5 rounded-b-full bg-red-800 shadow-sm"></span>
            <span className="w-8 h-6 rounded-b-full bg-red-900 shadow-sm"></span>
            <span className="w-7 h-5 rounded-b-full bg-red-800 shadow-sm"></span>
            <span className="w-8 h-6 rounded-b-full bg-red-900 shadow-sm"></span>
            <span className="w-7 h-5 rounded-b-full bg-red-800 shadow-sm"></span>
          </div>
        </div>

        {/* 🌹 Bottom Tier (Tier 3: Royal Obsidian Velvet with Golden Filigree) */}
        <div className="w-76 sm:w-88 h-22 rounded-b-3xl bg-gradient-to-r from-[#170408] via-red-950 to-[#170408] relative border-t-2 border-red-600/40 shadow-xl flex flex-col items-center justify-center overflow-hidden">
          
          {/* Romantic Filigree Heart Garland */}
          <div className="flex gap-2.5 sm:gap-3 text-xs sm:text-sm text-amber-300 drop-shadow-md">
            <span>♥</span><span>✦</span><span>♥</span><span>✦</span><span>♥</span><span>✦</span><span>♥</span><span>✦</span><span>♥</span><span>✦</span><span>♥</span>
          </div>
          
          {/* Romantic Message Tag */}
          <span className="text-[10px] font-script-romantic text-red-200 tracking-wider font-bold mt-1 text-glow-red">
            Yours Till My Dying Breath ❤️
          </span>

          {/* If slice was cut */}
          {sliceCut && (
            <div className="absolute right-4 top-2 bg-red-900 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full shadow border border-amber-400/50 animate-bounce">
              🍰 Slice Cut With Love!
            </div>
          )}
        </div>

        {/* 🌟 Ornate Pedestal */}
        <div className="w-84 sm:w-96 h-5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-400 shadow-[0_8px_25px_rgba(245,158,11,0.35)] border-t-2 border-amber-100 flex items-center justify-center">
          <div className="w-24 h-1.5 rounded-full bg-amber-500/60" />
        </div>
        {/* Pedestal Foot */}
        <div className="w-36 sm:w-44 h-3.5 rounded-b-2xl bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 shadow-md border-t border-amber-400/60" />
      </div>

      {/* Interactive Controls */}
      <div className="relative z-10 w-full max-w-md mt-3">
        {candlesLit ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleBlowCandles}
              className="flex-1 py-3.5 px-6 rounded-full bg-gradient-to-r from-red-700 via-rose-700 to-red-800 hover:from-red-600 hover:to-rose-600 text-white font-serif-luxury text-sm flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(220,38,38,0.5)] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <i className="ri-windy-line text-lg"></i>
              <span>Tap to Blow Candles 🎂</span>
            </button>

            <button
              onClick={isListeningMic ? stopMicListening : startMicListening}
              className={`px-5 py-3.5 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer backdrop-blur-md ${
                isListeningMic
                  ? 'bg-red-600 text-white shadow-[0_0_20px_#dc2626] animate-pulse border border-red-300'
                  : 'bg-[#150407] hover:bg-[#20060c] text-red-200 border-2 border-red-600/60 shadow-sm'
              }`}
              title="Blow using your real breath into the microphone!"
            >
              <i className={`ri-mic-${isListeningMic ? 'fill' : 'line'} text-sm`}></i>
              <span>{isListeningMic ? 'Blow now!' : 'Blow with Mic 🎙️'}</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 animate-fade-in">
            {/* Cut a slice mini-action */}
            {!sliceCut && (
              <button
                onClick={handleCutSlice}
                className="py-2.5 px-5 rounded-full bg-red-950/80 hover:bg-red-900 text-red-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border border-red-600/60 shadow-sm"
              >
                <span>🍰 Cut a Sweet Slice for {partnerName}</span>
              </button>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleRelight}
                className="py-3 px-5 rounded-full bg-[#150407] hover:bg-[#22060d] border-2 border-red-600/60 text-red-200 text-xs font-serif-luxury flex items-center gap-1.5 justify-center cursor-pointer transition-colors shadow-sm"
              >
                <i className="ri-fire-line text-amber-400"></i>
                <span>Relight Candles</span>
              </button>

              <button
                onClick={() => {
                  audio.playTap();
                  onNext();
                }}
                className="flex-1 py-3 px-6 rounded-full bg-gradient-to-r from-red-700 via-rose-700 to-red-800 hover:from-red-600 hover:to-rose-600 text-white font-serif-luxury tracking-wide text-sm flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(220,38,38,0.5)] cursor-pointer transition-transform hover:scale-105 active:scale-95"
              >
                <span>{cakeData?.buttonNext || "Release Our Scarlet Wishes 🎈"}</span>
                <i className="ri-arrow-right-line"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthdayCakeBlow;
