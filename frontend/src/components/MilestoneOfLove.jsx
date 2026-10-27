import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { audio } from '../utils/audioEngine';

const MilestoneOfLove = ({ onNext, partnerName = 'Shristi', age = 22, milestoneData }) => {
  const [animatedValues, setAnimatedValues] = useState({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
  });
  const containerRef = useRef(null);

  const parsedAge = parseInt(age, 10) || 22;
  const targetDays = parsedAge * 365 + Math.floor(parsedAge / 4);
  const targetHours = targetDays * 24;
  const targetMinutes = targetHours * 60;

  useEffect(() => {
    // GSAP sphere entrance animation with clearProps
    const ctx = gsap.context(() => {
      gsap.fromTo('.gsap-milestone-orb',
        { scale: 0.8, y: 20, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'back.out(1.4)', clearProps: 'all' }
      );
      gsap.fromTo('.gsap-milestone-quote',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.3, clearProps: 'all' }
      );
    }, containerRef);

    let frame = 0;
    const totalFrames = 45;
    const interval = setInterval(() => {
      frame++;
      const progress = Math.min(1, frame / totalFrames);
      const ease = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues({
        years: Math.floor(parsedAge * ease),
        days: Math.floor(targetDays * ease),
        hours: Math.floor(targetHours * ease),
        minutes: Math.floor(targetMinutes * ease),
      });

      if (frame >= totalFrames) {
        clearInterval(interval);
      }
    }, 25);

    return () => {
      clearInterval(interval);
      ctx.revert();
    };
  }, [parsedAge, targetDays, targetHours, targetMinutes]);

  return (
    <div ref={containerRef} className="relative min-h-[85vh] w-full flex flex-col items-center justify-center p-4 text-center select-none">
      
      {/* Soft Ambient Crimson Atmosphere */}
      <div className="absolute w-[520px] h-[520px] rounded-full bg-radial from-red-950/40 via-red-900/15 to-transparent blur-3xl pointer-events-none" />

      {/* Header Flourish in Red & Black Theme */}
      <div className="relative z-10 flex flex-col items-center mb-6 max-w-lg">
        <span className="font-mono text-xs uppercase tracking-widest text-red-400 font-bold mb-1">
          ✦ {milestoneData?.badge || "22 Years of You, A Lifetime of My Love"} ✦
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif-luxury text-white leading-tight font-normal">
          Milestones of My Devotion
        </h2>
        <p className="text-xs sm:text-sm text-red-200/80 font-light mt-1.5 max-w-md leading-relaxed">
          Every single second of <span className="font-bold text-red-400">{partnerName}</span>'s life, my heart has silently worshipped you:
        </p>
      </div>

      {/* High-Contrast Red & Black Spheres of Time */}
      <div className="relative z-10 w-full max-w-3xl my-3">
        
        {/* Constellation Golden Curve */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 600 240">
          <path
            d="M 120,60 C 250,20 350,180 480,70"
            fill="none"
            stroke="url(#constellationGradRed)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <defs>
            <linearGradient id="constellationGradRed" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
        </svg>

        {/* 4 Distinct Red-Black Time Spheres */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 px-2">
          
          {/* Sphere 1: Years */}
          <div className="gsap-milestone-orb flex flex-col items-center group cursor-default transform transition-transform hover:scale-105">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl sm:rounded-full bg-[#140407] border-2 border-red-600/70 flex flex-col items-center justify-center shadow-[0_10px_25px_rgba(220,38,38,0.3)] relative px-2">
              <span className="text-3xl sm:text-4xl font-serif-luxury font-black text-white leading-none text-glow-red">
                {animatedValues.years}
              </span>
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-red-400 font-bold mt-1.5">
                Years
              </span>
            </div>
            <span className="text-xs text-red-200/90 font-serif-luxury mt-2 font-bold">Of Pure Grace</span>
          </div>

          {/* Sphere 2: Days */}
          <div className="gsap-milestone-orb flex flex-col items-center group cursor-default transform transition-transform hover:scale-105">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl sm:rounded-full bg-[#140407] border-2 border-amber-500/70 flex flex-col items-center justify-center shadow-[0_10px_25px_rgba(245,158,11,0.25)] relative px-2">
              <span className="text-2xl sm:text-3xl font-serif-luxury font-black text-amber-300 leading-none text-glow-gold">
                {animatedValues.days.toLocaleString()}
              </span>
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-amber-400 font-bold mt-1.5">
                Days
              </span>
            </div>
            <span className="text-xs text-amber-200/90 font-serif-luxury mt-2 font-bold">Of Warm Sunshine</span>
          </div>

          {/* Sphere 3: Hours */}
          <div className="gsap-milestone-orb flex flex-col items-center group cursor-default transform transition-transform hover:scale-105">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl sm:rounded-full bg-[#140407] border-2 border-rose-600/70 flex flex-col items-center justify-center shadow-[0_10px_25px_rgba(225,29,72,0.3)] relative px-2">
              <span className="text-xl sm:text-2xl font-serif-luxury font-black text-rose-300 leading-none">
                {animatedValues.hours.toLocaleString()}
              </span>
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-rose-400 font-bold mt-1.5">
                Hours
              </span>
            </div>
            <span className="text-xs text-rose-200/90 font-serif-luxury mt-2 font-bold">Of Endless Longing</span>
          </div>

          {/* Sphere 4: Minutes */}
          <div className="gsap-milestone-orb flex flex-col items-center group cursor-default transform transition-transform hover:scale-105">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl sm:rounded-full bg-[#140407] border-2 border-red-600/70 flex flex-col items-center justify-center shadow-[0_10px_25px_rgba(220,38,38,0.3)] relative px-2">
              <span className="text-lg sm:text-xl font-serif-luxury font-black text-red-200 leading-none text-glow-red">
                {animatedValues.minutes.toLocaleString()}
              </span>
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-red-400 font-bold mt-1.5">
                Minutes
              </span>
            </div>
            <span className="text-xs text-red-200/90 font-serif-luxury mt-2 font-bold">Of Die-Heart Love</span>
          </div>

        </div>
      </div>

      {/* Floating Calligraphy Poetry Quote with Red & Black Contrast */}
      <div className="gsap-milestone-quote relative z-10 max-w-lg my-5 px-6 py-4 rounded-3xl bg-[#150407]/95 border-2 border-red-600/60 shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
        <p className="font-handwriting-cute text-2xl sm:text-3xl text-red-100 font-bold italic leading-snug">
          {milestoneData?.quote || '"In all those 22 years and millions of minutes, loving you was the only truth my soul ever knew. Even if you walk towards the wedding mandap, my love will stay frozen in time for you."'}
        </p>
      </div>

      {/* Continue Button */}
      <button
        onClick={() => {
          audio.playTap();
          onNext();
        }}
        className="relative z-10 py-3.5 px-8 rounded-full bg-gradient-to-r from-red-700 via-rose-700 to-red-800 hover:from-red-600 hover:to-rose-600 text-white font-serif-luxury tracking-wide text-sm flex items-center gap-2 shadow-[0_4px_25px_rgba(220,38,38,0.5)] transition-all cursor-pointer transform hover:scale-105 active:scale-95"
      >
        <span>{milestoneData?.buttonText || "Light The 22nd Birthday Candles 🕯️"}</span>
        <i className="ri-arrow-right-line text-base"></i>
      </button>
    </div>
  );
};

export default MilestoneOfLove;
