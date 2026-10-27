import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { audio } from '../utils/audioEngine';

const GrandFinaleCelebration = ({
  onRestart,
  partnerName = 'Ananya',
  partnerAge = 20,
  senderName = 'Forever Yours ❤️',
  finaleData,
}) => {
  const [activeBlessing, setActiveBlessing] = useState(0);
  const [floatingKisses, setFloatingKisses] = useState([]);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const kissIdRef = useRef(0);

  const blessings = [
    {
      id: 1,
      icon: "🌟",
      title: "Radiant Joy & Smiles",
      text: "May your laughter echo through every room you enter, and your gorgeous smile never fade."
    },
    {
      id: 2,
      icon: "💫",
      title: "Sacred Wishes & Dreams",
      text: "May every secret prayer you whisper to the night sky blossom into a miracle this year."
    },
    {
      id: 3,
      icon: "💖",
      title: "Endless Love & Devotion",
      text: "I promise to love, protect, and cherish you through every sunrise and sunset of this lifetime."
    }
  ];

  useEffect(() => {
    // GSAP entrance on finale with clearProps
    const gctx = gsap.context(() => {
      gsap.fromTo('.gsap-finale-content',
        { scale: 0.88, y: 25, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.4)', clearProps: 'all' }
      );
      gsap.fromTo('.gsap-blessing-card',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.12, duration: 0.6, ease: 'power2.out', clearProps: 'all', delay: 0.3 }
      );
    }, containerRef);

    // Initial grand confetti blast
    confetti({
      particleCount: 160,
      spread: 120,
      origin: { y: 0.5 },
      colors: ['#f43f5e', '#ec4899', '#fde047', '#a855f7', '#38bdf8', '#ffffff']
    });

    audio.playChimeSuccess();

    // Canvas heart-shaped pink & gold fireworks
    const canvas = canvasRef.current;
    if (!canvas) return () => gctx.revert();
    const ctx = canvas.getContext('2d');
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    let animationFrameId;
    const particles = [];

    // Parametric heart formula for romantic fireworks
    const createHeartFirework = (centerX, centerY) => {
      const colors = ['#f43f5e', '#fb7185', '#ec4899', '#fde047', '#fda4af', '#f59e0b', '#ffffff'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const scale = Math.random() * 0.15 + 0.22;

      for (let i = 0; i < 55; i++) {
        const t = (Math.PI * 2 * i) / 55;
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        const speed = Math.random() * 0.4 + 1.1;

        particles.push({
          x: centerX,
          y: centerY,
          vx: hx * scale * speed * 0.22,
          vy: hy * scale * speed * 0.22,
          alpha: 1,
          color,
          size: Math.random() * 2.5 + 2,
        });
      }
    };

    const interval = setInterval(() => {
      const x = Math.random() * canvas.width * 0.75 + canvas.width * 0.12;
      const y = Math.random() * canvas.height * 0.4 + 60;
      createHeartFirework(x, y);
    }, 1100);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // Gentle gravity
        p.alpha -= 0.016;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      gctx.revert();
    };
  }, []);

  const triggerExtraCelebration = () => {
    audio.playChimeSuccess();
    confetti({
      particleCount: 130,
      spread: 110,
      origin: { y: 0.55 },
      colors: ['#f43f5e', '#ec4899', '#fde047', '#fda4af', '#ffffff']
    });

    setTimeout(() => {
      confetti({
        particleCount: 70,
        angle: 60,
        spread: 60,
        origin: { x: 0.1, y: 0.6 }
      });
      confetti({
        particleCount: 70,
        angle: 120,
        spread: 60,
        origin: { x: 0.9, y: 0.6 }
      });
    }, 250);
  };

  const handleSendKiss = (e) => {
    audio.playTap();
    kissIdRef.current += 1;
    const currentId = kissIdRef.current;
    const emojis = ['💋', '💖', '💕', '🌹', '🥰', '✨'];
    const chosenEmoji = emojis[currentId % emojis.length];

    const rect = containerRef.current?.getBoundingClientRect();
    const x = rect && e?.clientX ? e.clientX - rect.left : window.innerWidth / 2;
    const y = rect && e?.clientY ? e.clientY - rect.top : 300;

    const newKiss = {
      id: currentId,
      x,
      y,
      emoji: chosenEmoji
    };

    setFloatingKisses((prev) => [...prev.slice(-6), newKiss]);
    setTimeout(() => {
      setFloatingKisses((prev) => prev.filter((k) => k.id !== currentId));
    }, 1500);

    confetti({
      particleCount: 25,
      spread: 45,
      origin: {
        x: (e?.clientX || window.innerWidth / 2) / window.innerWidth,
        y: (e?.clientY || 300) / window.innerHeight
      },
      colors: ['#f43f5e', '#fda4af', '#ffffff']
    });
  };

  return (
    <div ref={containerRef} className="relative min-h-[90vh] w-full flex flex-col items-center justify-center p-3 sm:p-6 text-center select-none overflow-hidden">
      
      {/* Light Pink Heart Fireworks Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none w-full h-full z-0"
      />

      {/* Floating Kisses & Hearts on Tap */}
      {floatingKisses.map((kiss) => (
        <span
          key={kiss.id}
          className="absolute z-50 pointer-events-none text-3xl animate-fade-in"
          style={{
            left: kiss.x,
            top: kiss.y,
            transform: 'translate(-50%, -50%)',
            animation: 'floatPetal 1.4s ease-out forwards'
          }}
        >
          {kiss.emoji}
        </span>
      ))}

      {/* Floating Grand Celebration Atmosphere */}
      <div className="gsap-finale-content relative z-10 flex flex-col items-center max-w-2xl px-3 my-auto">
        
        {/* Crown of Love Crest */}
        <div className="flex flex-col items-center mb-2">
          <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-white/90 border border-amber-300 shadow-[0_4px_15px_rgba(245,158,11,0.25)] mb-2 animate-bounce">
            <span className="text-amber-500 text-sm">👑</span>
            <span className="font-serif-luxury font-bold text-xs uppercase tracking-widest text-rose-950">
              Queen of My Heart • 20 Glorious Years
            </span>
            <span className="text-amber-500 text-sm">👑</span>
          </div>

          {/* Beating Sacred Diamond Heart */}
          <div
            onClick={handleSendKiss}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-600 flex items-center justify-center text-4xl sm:text-5xl text-white shadow-[0_0_40px_rgba(244,63,94,0.5)] animate-heart-thump cursor-pointer hover:scale-110 transition-transform"
            title="Tap to send kisses & love!"
          >
            💖
          </div>
        </div>

        {/* Grand Birthday Royal Title */}
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-rose-700 font-bold mb-1">
          ✦ {finaleData?.badge || "MAY ALL YOUR WISHES COME TRUE"} ✦
        </span>

        <h1 className="text-4xl sm:text-6xl font-serif-luxury text-rose-950 mb-1 leading-tight font-normal">
          HAPPY {partnerAge}ST BIRTHDAY, <br />
          <span className="font-script-romantic text-5xl sm:text-8xl text-rose-600 text-glow-rose block mt-1 font-bold">
            {partnerName}!
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-rose-900/90 font-medium max-w-lg mt-1 mb-4">
          Today, the entire universe smiles upon the most wonderful soul to ever walk this earth.
        </p>

        {/* 🌟 3 Interactive Birthday Blessings Amulets */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 my-2">
          {blessings.map((b, idx) => (
            <div
              key={b.id}
              onClick={() => {
                audio.playTap();
                setActiveBlessing(idx);
              }}
              className={`gsap-blessing-card p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all border-2 text-left flex flex-col justify-between ${
                activeBlessing === idx
                  ? 'bg-white border-rose-500 shadow-[0_8px_25px_rgba(244,63,94,0.22)] scale-102 ring-2 ring-rose-300'
                  : 'bg-white/80 hover:bg-white border-rose-200/90 opacity-80 hover:opacity-100 hover:scale-101 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xl">{b.icon}</span>
                <span className="font-serif-luxury font-bold text-xs sm:text-sm text-rose-950">
                  {b.title}
                </span>
              </div>
              <p className="font-handwriting-cute text-lg sm:text-xl text-rose-900/90 leading-snug">
                "{b.text}"
              </p>
            </div>
          ))}
        </div>

        {/* Deckle-Edge Parchment Toast Decree */}
        <div className="parchment-sheet rounded-3xl p-6 sm:p-8 my-4 text-stone-900 shadow-[0_15px_45px_rgba(244,63,94,0.16)] border-2 border-rose-300 relative text-left">
          
          {/* Top Silk Ribbon Accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 rounded-t-3xl" />

          {/* Dried Flower Stamp */}
          <div className="absolute top-4 right-5 text-2xl opacity-80">
            🌹
          </div>

          <span className="font-mono text-[10px] uppercase tracking-widest text-rose-700 font-bold block mb-2">
            📜 Sacred Birthday Toast Decree
          </span>

          <p className="font-handwriting-cute text-2xl sm:text-3xl text-stone-900 leading-relaxed italic">
            "{finaleData?.wishesText || "Here’s to another year of pure happiness, glowing health, unforgettable adventures, and a love that only grows deeper with every second that passes."}"
          </p>

          <div className="mt-4 pt-3 border-t border-rose-200 flex justify-between items-end">
            <span className="font-mono text-[10px] text-stone-500 font-bold">
              Sealed with All My Love
            </span>
            <span className="font-script-romantic text-3xl sm:text-4xl text-rose-600 font-bold">
              {senderName}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg mt-2">
          {/* Fireworks Explosion */}
          <button
            onClick={triggerExtraCelebration}
            className="flex-1 py-3.5 px-6 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-400 text-white font-serif-luxury tracking-wide text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(244,63,94,0.35)] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <i className="ri-sparkling-fill text-amber-300 text-base"></i>
            <span>Fireworks Burst 🎆</span>
          </button>

          {/* Send Kisses & Confetti */}
          <button
            onClick={handleSendKiss}
            className="py-3.5 px-6 rounded-full bg-pink-100 hover:bg-pink-200 border border-pink-300 text-rose-700 font-serif-luxury text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
          >
            <span>Send Kisses 💋</span>
          </button>

          {/* Replay */}
          <button
            onClick={onRestart}
            className="py-3.5 px-5 rounded-full bg-white hover:bg-rose-50 border-2 border-rose-300 text-rose-700 font-serif-luxury tracking-wide text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
          >
            <i className="ri-restart-line text-base"></i>
            <span>{finaleData?.replayText || "Replay ↺"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GrandFinaleCelebration;
