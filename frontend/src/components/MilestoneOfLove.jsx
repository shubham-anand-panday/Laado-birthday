import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { audio } from '../utils/audioEngine';

const MilestoneOfLove = ({ onNext, partnerName = 'Debuu', age = 20, milestoneData }) => {
  const [animatedValues, setAnimatedValues] = useState({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
  });
  const containerRef = useRef(null);

  const parsedAge = parseInt(age, 10) || 20;
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
      
      {/* Soft Ambient Light Pink Atmosphere */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-radial from-rose-200/25 to-transparent blur-3xl pointer-events-none" />

      {/* Header Flourish */}
      <div className="relative z-10 flex flex-col items-center mb-6 max-w-lg">
        <span className="font-mono text-xs uppercase tracking-widest text-rose-700 font-bold mb-1">
          ✦ {milestoneData?.badge || "The Starlit Milestones"} ✦
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif-luxury text-rose-950 leading-tight font-normal">
          A Lifetime of Pure Light
        </h2>
        <p className="text-xs sm:text-sm text-rose-900/90 font-medium mt-1.5 max-w-md leading-relaxed">
          The cosmos has danced with joy for every single moment <span className="font-bold text-rose-700">{partnerName}</span> has illuminated this world:
        </p>
      </div>

      {/* High-Contrast Organic Spheres of Time */}
      <div className="relative z-10 w-full max-w-3xl my-3">
        
        {/* Constellation Golden Curve */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 600 240">
          <path
            d="M 120,60 C 250,20 350,180 480,70"
            fill="none"
            stroke="url(#constellationGradPink)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <defs>
            <linearGradient id="constellationGradPink" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>

        {/* 4 Distinct, Readable Time Spheres */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 px-2">
          
          {/* Sphere 1: Years */}
          <div className="gsap-milestone-orb flex flex-col items-center group cursor-default transform transition-transform hover:scale-105">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl sm:rounded-full bg-white border-2 border-rose-400 flex flex-col items-center justify-center shadow-[0_10px_25px_rgba(244,63,94,0.18)] relative px-2">
              <span className="text-3xl sm:text-4xl font-serif-luxury font-black text-rose-800 leading-none">
                {animatedValues.years}
              </span>
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-rose-950 font-bold mt-1.5">
                Years
              </span>
            </div>
            <span className="text-xs text-rose-950 font-serif-luxury mt-2 font-bold">Of Pure Grace</span>
          </div>

          {/* Sphere 2: Days */}
          <div className="gsap-milestone-orb flex flex-col items-center group cursor-default transform transition-transform hover:scale-105">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl sm:rounded-full bg-white border-2 border-amber-400 flex flex-col items-center justify-center shadow-[0_10px_25px_rgba(217,119,6,0.18)] relative px-2">
              <span className="text-2xl sm:text-3xl font-serif-luxury font-black text-amber-800 leading-none">
                {animatedValues.days.toLocaleString()}
              </span>
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-amber-950 font-bold mt-1.5">
                Days
              </span>
            </div>
            <span className="text-xs text-rose-950 font-serif-luxury mt-2 font-bold">Of Warm Sunshine</span>
          </div>

          {/* Sphere 3: Hours */}
          <div className="gsap-milestone-orb flex flex-col items-center group cursor-default transform transition-transform hover:scale-105">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl sm:rounded-full bg-white border-2 border-purple-400 flex flex-col items-center justify-center shadow-[0_10px_25px_rgba(147,51,234,0.18)] relative px-2">
              <span className="text-xl sm:text-2xl font-serif-luxury font-black text-purple-900 leading-none">
                {animatedValues.hours.toLocaleString()}
              </span>
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-purple-950 font-bold mt-1.5">
                Hours
              </span>
            </div>
            <span className="text-xs text-rose-950 font-serif-luxury mt-2 font-bold">Of Endless Magic</span>
          </div>

          {/* Sphere 4: Minutes */}
          <div className="gsap-milestone-orb flex flex-col items-center group cursor-default transform transition-transform hover:scale-105">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl sm:rounded-full bg-white border-2 border-rose-400 flex flex-col items-center justify-center shadow-[0_10px_25px_rgba(244,63,94,0.18)] relative px-2">
              <span className="text-lg sm:text-xl font-serif-luxury font-black text-rose-800 leading-none">
                {animatedValues.minutes.toLocaleString()}
              </span>
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-rose-950 font-bold mt-1.5">
                Minutes
              </span>
            </div>
            <span className="text-xs text-rose-950 font-serif-luxury mt-2 font-bold">Of Cosmic Love</span>
          </div>

        </div>
      </div>

      {/* Floating Calligraphy Poetry Quote with Crisp Contrast */}
      <div className="gsap-milestone-quote relative z-10 max-w-lg my-5 px-6 py-4 rounded-3xl bg-white border-2 border-rose-300 shadow-[0_10px_30px_rgba(244,63,94,0.14)]">
        <p className="font-handwriting-cute text-2xl sm:text-3xl text-rose-950 font-bold italic leading-snug">
          {milestoneData?.quote || '"And in all those millions of minutes, meeting you was the greatest miracle the stars ever gave me."'}
        </p>
      </div>

      {/* Continue Button */}
      <button
        onClick={() => {
          audio.playTap();
          onNext();
        }}
        className="relative z-10 py-3.5 px-8 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-400 text-white font-serif-luxury tracking-wide text-sm flex items-center gap-2 shadow-[0_4px_25px_rgba(244,63,94,0.3)] transition-all cursor-pointer transform hover:scale-105 active:scale-95"
      >
        <span>{milestoneData?.buttonText || "Blow The Cake Candles 🕯️"}</span>
        <i className="ri-arrow-right-line text-base"></i>
      </button>
    </div>
  );
};

export default MilestoneOfLove;
