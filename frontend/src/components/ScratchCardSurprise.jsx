import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { audio } from '../utils/audioEngine';

const ScratchCardSurprise = ({ onNext, partnerName = 'Shristi', scratchData }) => {
  const canvasRef = useRef(null);
  const [isScratchedEnough, setIsScratchedEnough] = useState(false);
  const isDrawing = useRef(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // GSAP entrance on ticket with clearProps
    const ctx = gsap.context(() => {
      gsap.fromTo('.gsap-scratch-card',
        { scale: 0.85, y: 25, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.5)', clearProps: 'all' }
      );
    }, containerRef);

    const canvas = canvasRef.current;
    if (!canvas) return () => ctx.revert();
    const cctx = canvas.getContext('2d');

    // Luxurious gold glitter metallic gradient
    const grad = cctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#f59e0b');
    grad.addColorStop(0.25, '#fef08a');
    grad.addColorStop(0.5, '#b45309');
    grad.addColorStop(0.75, '#fde68a');
    grad.addColorStop(1, '#92400e');

    cctx.fillStyle = grad;
    cctx.fillRect(0, 0, canvas.width, canvas.height);

    // Shimmering starlight particles on canvas
    cctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const r = Math.random() * 3 + 1;
      cctx.beginPath();
      cctx.arc(x, y, r, 0, Math.PI * 2);
      cctx.fill();
    }

    cctx.fillStyle = '#450a0a';
    cctx.font = 'bold 15px "Playfair Display", serif';
    cctx.textAlign = 'center';
    cctx.fillText('✨ SCRATCH WITH YOUR TOUCH ✨', canvas.width / 2, canvas.height / 2 - 8);

    cctx.font = '11px "Plus Jakarta Sans", sans-serif';
    cctx.fillStyle = '#78350f';
    cctx.fillText('Swipe or drag to reveal my eternal vow', canvas.width / 2, canvas.height / 2 + 16);

    return () => ctx.revert();
  }, []);

  const scratch = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();

    checkScratchPercentage();
  };

  const checkScratchPercentage = () => {
    if (isScratchedEnough) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparent = 0;
    const step = 32;

    for (let i = 3; i < pixels.length; i += step * 4) {
      if (pixels[i] === 0) {
        transparent++;
      }
    }

    const totalSamples = pixels.length / (step * 4);
    if (transparent / totalSamples > 0.4) {
      setIsScratchedEnough(true);
      audio.playChimeSuccess();
      confetti({
        particleCount: 90,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#dc2626', '#b91c1c', '#fbbf24', '#ffffff']
      });
    }
  };

  const handleMouseDown = () => {
    isDrawing.current = true;
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handleTouchMove = (e) => {
    if (e.touches[0]) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-[85vh] w-full flex flex-col items-center justify-center p-4 text-center select-none">
      
      {/* Soft Ambient Crimson Atmosphere */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-radial from-red-950/40 via-red-900/15 to-transparent blur-3xl pointer-events-none" />

      {/* Floating Header */}
      <div className="relative z-10 flex flex-col items-center mb-4 max-w-lg">
        <span className="font-mono text-xs uppercase tracking-widest text-red-400 font-semibold mb-1">
          ✦ {scratchData?.badge || "The Unbreakable Promise of a Die-Heart Lover"} ✦
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif-luxury text-white leading-tight">
          Scratch The Crimson-Gold Ticket
        </h2>
        <p className="text-xs sm:text-sm text-red-200/80 font-light mt-1 max-w-md">
          {isScratchedEnough
            ? "🎉 My eternal vow is permanently etched into the stars for you!"
            : (scratchData?.subtitle || `A lifelong, unrevocable vow crafted from the depths of my soul for ${partnerName}`)}
        </p>
      </div>

      {/* Royal Gilded Ticket Frame in Red & Black Theme */}
      <div className="gsap-scratch-card relative z-10 w-80 sm:w-96 h-56 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)] border-2 border-amber-400 bg-gradient-to-br from-[#1c050b] via-[#120307] to-[#070103] flex flex-col items-center justify-center p-4">
        
        {/* Ornate Filigree Corners */}
        <div className="absolute top-2 left-2 text-amber-400 text-xs">╔</div>
        <div className="absolute top-2 right-2 text-amber-400 text-xs">╗</div>
        <div className="absolute bottom-2 left-2 text-amber-400 text-xs">╚</div>
        <div className="absolute bottom-2 right-2 text-amber-400 text-xs">╝</div>

        {/* UNDERNEATH REVEALED CONTENT */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 text-3xl flex items-center justify-center mb-1 animate-bounce">
            👑
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-red-400 font-bold">
            {scratchData?.couponTag || "ETERNAL VOW OF SHUBHAM ❤️"}
          </span>
          <h3 className="font-serif-luxury text-xl sm:text-2xl text-white font-bold mt-0.5 text-glow-white">
            {scratchData?.couponTitle || "Lifelong Waiting & Unconditional Love"}
          </h3>
          <p className="font-handwriting-cute text-xl sm:text-2xl text-red-100 mt-1 leading-snug">
            {scratchData?.couponMessage || '"Valid for infinity: Even if the world separates us and you step into your shaadi, my doors and my arms will forever remain open. If life ever gives you a choice or you ever want to return, I will be right here waiting for you."'}
          </p>
          <div className="mt-1 text-[11px] text-amber-300 font-serif-luxury italic font-medium">
            {scratchData?.couponFooter || "Signed with my tears and eternal love, Yours Shubham ❤️"}
          </div>
        </div>

        {/* CANVAS GOLD METALLIC SCRATCH COAT */}
        <canvas
          ref={canvasRef}
          width={384}
          height={224}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchMove={handleTouchMove}
          className={`absolute inset-0 w-full h-full cursor-crosshair transition-opacity duration-700 ${
            isScratchedEnough ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        />
      </div>

      {/* Bypass / Instant Scratch Link */}
      {!isScratchedEnough ? (
        <button
          onClick={() => {
            setIsScratchedEnough(true);
            audio.playChimeSuccess();
            confetti({ particleCount: 70, colors: ['#dc2626', '#fbbf24', '#ffffff'] });
          }}
          className="relative z-10 text-xs text-red-400/80 hover:text-red-200 underline mt-3 cursor-pointer font-light transition-colors"
        >
          Reveal vow instantly
        </button>
      ) : (
        <div className="relative z-10 text-xs text-red-400 mt-3 font-mono font-bold animate-pulse">
          ✨ Registered in the heavens for all eternity!
        </div>
      )}

      {/* Continue to Love Letter */}
      <button
        onClick={() => {
          audio.playTap();
          onNext();
        }}
        className="relative z-10 mt-5 py-3.5 px-8 rounded-full bg-gradient-to-r from-red-700 via-rose-700 to-red-800 hover:from-red-600 hover:to-rose-600 text-white font-serif-luxury tracking-wide text-sm flex items-center gap-2 shadow-[0_4px_25px_rgba(220,38,38,0.5)] transition-all cursor-pointer transform hover:scale-105 active:scale-95"
      >
        <span>{scratchData?.buttonNext || "Read My Raw Love Letter 💌"}</span>
        <i className="ri-arrow-right-line text-lg"></i>
      </button>
    </div>
  );
};

export default ScratchCardSurprise;
