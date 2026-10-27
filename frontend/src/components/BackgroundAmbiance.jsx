import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const BackgroundAmbiance = () => {
  const [ambientHearts] = useState(() => 
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 18 + 14,
      duration: Math.random() * 12 + 12,
      delay: Math.random() * 8,
      opacity: Math.random() * 0.5 + 0.35,
      symbol: ['🌹', '🥀', '❤️', '✨', '💔', '🕯️'][Math.floor(Math.random() * 6)],
      color: ['#dc2626', '#ef4444', '#b91c1c', '#991b1b', '#f59e0b', '#fbbf24'][Math.floor(Math.random() * 6)]
    }))
  );

  const [stars] = useState(() => 
    Array.from({ length: 45 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2.5 + 1.2,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 4,
      opacity: Math.random() * 0.6 + 0.25
    }))
  );

  const canvasRef = useRef(null);
  const sparklesRef = useRef([]);

  useEffect(() => {
    // GSAP background subtle pulse
    gsap.to('.gsap-bg-orb-1', {
      scale: 1.25,
      x: 35,
      y: 25,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
    gsap.to('.gsap-bg-orb-2', {
      scale: 1.2,
      x: -35,
      y: -30,
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let animationId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = Date.now();
      const sparkles = sparklesRef.current;

      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        const age = now - s.birth;
        if (age > s.life) {
          sparkles.splice(i, 1);
          continue;
        }

        const progress = age / s.life;
        const alpha = Math.max(0, 1 - progress);

        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.vRot;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.globalAlpha = alpha * s.baseAlpha;

        if (s.isPetal) {
          // Draw deep crimson petal
          ctx.fillStyle = s.color;
          ctx.shadowColor = '#dc2626';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.ellipse(0, 0, s.size * 1.6, s.size * 0.9, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Draw glowing golden or ruby ember sparkle
          ctx.fillStyle = s.color;
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(0, 0, s.size * (1 - progress * 0.4), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    const addTrailPoint = (x, y) => {
      const colors = ['#dc2626', '#ef4444', '#b91c1c', '#f87171', '#f59e0b', '#fbbf24'];
      for (let i = 0; i < 2; i++) {
        sparklesRef.current.push({
          x: x + (Math.random() * 16 - 8),
          y: y + (Math.random() * 16 - 8),
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2 + 0.3,
          size: Math.random() * 3 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.05,
          birth: Date.now(),
          life: 800 + Math.random() * 400,
          baseAlpha: 0.9,
          isPetal: Math.random() > 0.6
        });
      }

      if (sparklesRef.current.length > 70) {
        sparklesRef.current.shift();
      }
    };

    const handleMouseMove = (e) => addTrailPoint(e.clientX, e.clientY);
    const handleTouchMove = (e) => {
      if (e.touches[0]) addTrailPoint(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Red & Black Theme Midnight Velvet Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#060102] via-[#0d0205] to-[#150408]" />
      
      {/* Glowing Crimson & Ruby Orbs (Animated by GSAP) */}
      <div className="gsap-bg-orb-1 absolute -top-24 -left-24 w-[650px] h-[650px] bg-gradient-to-tr from-red-950/45 via-red-900/35 to-transparent rounded-full blur-[140px]" />
      <div className="gsap-bg-orb-2 absolute -bottom-24 -right-24 w-[700px] h-[700px] bg-gradient-to-bl from-rose-950/40 via-red-800/30 to-transparent rounded-full blur-[150px]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[750px] h-[750px] bg-red-950/20 rounded-full blur-[170px]" />

      {/* Twinkling golden and scarlet starlight / embers */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animation: `pulse ${star.duration}s infinite ease-in-out ${star.delay}s`,
          }}
        />
      ))}

      {/* Floating upward red roses, bleeding hearts, and candle flames */}
      {ambientHearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute select-none pointer-events-none"
          style={{
            left: `${heart.left}%`,
            bottom: '-50px',
            fontSize: `${heart.size}px`,
            color: heart.color,
            opacity: heart.opacity,
            filter: `drop-shadow(0 0 10px ${heart.color}88)`,
            animation: `driftUpRedBlack ${heart.duration}s cubic-bezier(0.4, 0, 0.2, 1) infinite ${heart.delay}s`,
          }}
        >
          {heart.symbol}
        </div>
      ))}

      {/* Interactive Cursor Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      <style>{`
        @keyframes driftUpRedBlack {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg) scale(0.85);
            opacity: 0;
          }
          15% {
            opacity: 0.85;
          }
          50% {
            transform: translateY(-55vh) translateX(30px) rotate(45deg) scale(1);
          }
          85% {
            opacity: 0.75;
          }
          100% {
            transform: translateY(-120vh) translateX(-20px) rotate(90deg) scale(0.9);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default BackgroundAmbiance;
