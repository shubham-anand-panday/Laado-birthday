import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { audio } from '../utils/audioEngine';

const ScratchCardSurprise = ({ onNext, partnerName = 'Ananya', scratchData }) => {
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
    grad.addColorStop(0.5, '#d97706');
    grad.addColorStop(0.75, '#fde68a');
    grad.addColorStop(1, '#b45309');

    cctx.fillStyle = grad;
    cctx.fillRect(0, 0, canvas.width, canvas.height);

    // Shimmering starlight particles on canvas
    cctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const r = Math.random() * 3 + 1;
      cctx.beginPath();
      cctx.arc(x, y, r, 0, Math.PI * 2);
      cctx.fill();
    }

    cctx.fillStyle = '#78350f';
    cctx.font = 'bold 15px "Playfair Display", serif';
    cctx.textAlign = 'center';
    cctx.fillText('✨ SCRATCH WITH YOUR TOUCH ✨', canvas.width / 2, canvas.height / 2 - 8);

    cctx.font = '11px "Plus Jakarta Sans", sans-serif';
    cctx.fillStyle = '#92400e';
    cctx.fillText('Swipe or drag to reveal your royal treat', canvas.width / 2, canvas.height / 2 + 16);

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
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#f43f5e', '#ffffff']
      });
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleTouchMove = (e) => {
    if (e.touches[0]) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-[85vh] w-full flex flex-col items-center justify-center p-4 text-center select-none">
      
      {/* Soft Ambient Light Pink Atmosphere */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-radial from-amber-300/25 via-pink-200/20 to-transparent blur-3xl pointer-events-none" />

      {/* Floating Header */}
      <div className="relative z-10 flex flex-col items-center mb-4 max-w-lg">
        <span className="font-mono text-xs uppercase tracking-widest text-rose-600 font-semibold mb-1">
          ✦ {scratchData?.badge || "Royal Golden Decree"} ✦
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif-luxury text-rose-950 leading-tight">
          Scratch The Golden Ticket
        </h2>
        <p className="text-xs sm:text-sm text-rose-800/80 font-light mt-1 max-w-md">
          {isScratchedEnough
            ? "🎉 Your eternal birthday privilege is officially activated!"
            : (scratchData?.subtitle || `A rare, unrevocable treat crafted exclusively for ${partnerName}`)}
        </p>
      </div>

      {/* Royal Gilded Golden Decree Frame in Light Pink Theme */}
      <div className="gsap-scratch-card relative z-10 w-80 sm:w-96 h-56 rounded-3xl overflow-hidden shadow-[0_15px_45px_rgba(244,63,94,0.18)] border-2 border-amber-300 bg-gradient-to-br from-white via-[#fff5f8] to-[#fde2ea] flex flex-col items-center justify-center p-4">
        
        {/* Ornate Filigree Corners */}
        <div className="absolute top-2 left-2 text-amber-500 text-xs">╔</div>
        <div className="absolute top-2 right-2 text-amber-500 text-xs">╗</div>
        <div className="absolute bottom-2 left-2 text-amber-500 text-xs">╚</div>
        <div className="absolute bottom-2 right-2 text-amber-500 text-xs">╝</div>

        {/* UNDERNEATH REVEALED CONTENT */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-400/20 text-3xl flex items-center justify-center mb-1 animate-bounce">
            👑
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-rose-600 font-bold">
            {scratchData?.couponTag || "VIP BIRTHDAY PRIVILEGE 🎟️"}
          </span>
          <h3 className="font-serif-luxury text-xl sm:text-2xl text-rose-950 font-bold mt-0.5">
            {scratchData?.couponTitle || "Unlimited Hugs & Pampering"}
          </h3>
          <p className="font-handwriting-cute text-2xl text-stone-800 mt-1 leading-snug">
            {scratchData?.couponMessage || '"Valid for 365 days of infinite cuddles, midnight snacks on demand, and winning every argument forever!"'}
          </p>
          <div className="mt-1 text-[11px] text-rose-600 font-serif-luxury italic font-medium">
            {scratchData?.couponFooter || "Signed with eternal love ❤️"}
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
            confetti({ particleCount: 60 });
          }}
          className="relative z-10 text-xs text-rose-700/80 hover:text-rose-900 underline mt-3 cursor-pointer font-light transition-colors"
        >
          Reveal royal prize instantly
        </button>
      ) : (
        <div className="relative z-10 text-xs text-rose-700 mt-3 font-mono font-bold animate-pulse">
          ✨ Claimed forever & registered in the stars!
        </div>
      )}

      {/* Continue to Love Letter */}
      <button
        onClick={() => {
          audio.playTap();
          onNext();
        }}
        className="relative z-10 mt-5 py-3.5 px-8 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-400 text-white font-serif-luxury tracking-wide text-sm flex items-center gap-2 shadow-[0_4px_25px_rgba(244,63,94,0.3)] transition-all cursor-pointer transform hover:scale-105 active:scale-95"
      >
        <span>{scratchData?.buttonNext || "Read My Love Letter 💌"}</span>
        <i className="ri-arrow-right-line text-lg"></i>
      </button>
    </div>
  );
};

export default ScratchCardSurprise;
