import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const BackgroundAmbiance = () => {
  const [ambientHearts] = useState(() => 
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 18 + 14,
      duration: Math.random() * 12 + 12,
      delay: Math.random() * 8,
      opacity: Math.random() * 0.5 + 0.3,
      symbol: ['🌸', '❤', '✨', '💕', '🌷', '🫧'][Math.floor(Math.random() * 6)],
      color: ['#f43f5e', '#ec4899', '#fb7185', '#fda4af', '#f472b6', '#f59e0b'][Math.floor(Math.random() * 6)]
    }))
  );

  const [stars] = useState(() => 
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1.5,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 4,
      opacity: Math.random() * 0.6 + 0.2
    }))
  );

  const canvasRef = useRef(null);
  const sparklesRef = useRef([]);

  useEffect(() => {
    // GSAP background subtle pulse
    gsap.to('.gsap-bg-orb-1', {
      scale: 1.2,
      x: 30,
      y: 20,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
    gsap.to('.gsap-bg-orb-2', {
      scale: 1.15,
      x: -30,
      y: -25,
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
          // Draw soft pink petal
          ctx.fillStyle = s.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, s.size * 1.5, s.size * 0.9, 0, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Draw glowing golden sparkle
          ctx.fillStyle = s.color;
          ctx.shadowColor = s.color;
          ctx.shadowBlur = 8;
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
      const colors = ['#f43f5e', '#ec4899', '#fb7185', '#fbbf24', '#fde047', '#fda4af'];
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
          baseAlpha: 0.85,
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
      {/* Light Pink Dreamy Theme Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fff2f6] via-[#fce7ef] to-[#fad2e1]" />
      
      {/* Pastel Glowing Blush Orbs (Animated by GSAP) */}
      <div className="gsap-bg-orb-1 absolute -top-24 -left-24 w-[600px] h-[600px] bg-gradient-to-tr from-pink-300/35 via-rose-200/25 to-transparent rounded-full blur-[120px]" />
      <div className="gsap-bg-orb-2 absolute -bottom-24 -right-24 w-[650px] h-[650px] bg-gradient-to-bl from-rose-300/30 via-pink-200/25 to-transparent rounded-full blur-[140px]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-amber-200/15 rounded-full blur-[160px]" />

      {/* Twinkling pastel starlight */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
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

      {/* Floating upward romantic pink petals and symbols */}
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
            filter: `drop-shadow(0 0 6px ${heart.color}55)`,
            animation: `driftUpLightPink ${heart.duration}s cubic-bezier(0.4, 0, 0.2, 1) infinite ${heart.delay}s`,
          }}
        >
          {heart.symbol}
        </div>
      ))}

      {/* Interactive Cursor Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      <style>{`
        @keyframes driftUpLightPink {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg) scale(0.85);
            opacity: 0;
          }
          15% {
            opacity: 0.8;
          }
          50% {
            transform: translateY(-55vh) translateX(30px) rotate(45deg) scale(1);
          }
          85% {
            opacity: 0.7;
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
