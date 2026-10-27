import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { audio } from '../utils/audioEngine';

const lanternCompliments = [
  { id: 1, text: "Your smile that brightens my darkest days ✨", icon: "ri-sun-fill" },
  { id: 2, text: "Your tender heart & beautiful empathy ❤️", icon: "ri-heart-pulse-fill" },
  { id: 3, text: "The magic sound of your laughter 🎶", icon: "ri-music-fill" },
  { id: 4, text: "The way you make every moment unforgettable 🌸", icon: "ri-sparkling-fill" },
];

const generateLeafNodes = () => {
  const totalLeaves = 95;
  const leaves = [];
  const colors = ['#f43f5e', '#ec4899', '#fda4af', '#f472b6', '#fbcfe8', '#ffe4e6', '#fbbf24', '#fde047'];

  for (let i = 0; i < totalLeaves; i++) {
    const t = Math.PI * 2 * (i / totalLeaves) + (Math.random() * 0.2 - 0.1);
    const hx = 16 * Math.pow(Math.sin(t), 3);
    const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

    const spread = Math.random() * 0.88;
    const x = hx * spread * 7.5 + (Math.random() * 12 - 6);
    const y = hy * spread * 7.5 + (Math.random() * 12 - 6);

    leaves.push({
      id: i,
      x: x,
      y: y - 55,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.floor(Math.random() * 12) + 14,
      delay: Math.random() * 2,
      rotation: Math.floor(Math.random() * 50 - 25),
    });
  }
  return leaves;
};

const HeartTreeWish = ({ onNext, partnerName = 'Debuu', partnerAge = '20', treeData }) => {
  const [leafNodes] = useState(generateLeafNodes);
  const [bloomedCount, setBloomedCount] = useState(0);
  const [interactiveHearts, setInteractiveHearts] = useState([]);
  const [litLanterns, setLitLanterns] = useState(new Set([1]));
  const [activeNote, setActiveNote] = useState(null);
  const treeContainerRef = useRef(null);

  useEffect(() => {
    // GSAP entrance on tree with clearProps
    const ctx = gsap.context(() => {
      gsap.fromTo('.gsap-tree-trunk',
        { scale: 0.9, y: 20, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', clearProps: 'all' }
      );
      gsap.fromTo('.gsap-lantern',
        { y: -15, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'bounce.out', clearProps: 'all', delay: 0.2 }
      );
    }, treeContainerRef);

    let count = 0;
    const interval = setInterval(() => {
      count += 3;
      setBloomedCount(count);
      if (count >= 95) {
        clearInterval(interval);
      }
    }, 35);

    return () => {
      clearInterval(interval);
      ctx.revert();
    };
  }, []);

  const handleTreeClick = (e) => {
    audio.playMusicBoxNote(587.33 + Math.random() * 260, 0, 1.2);
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const newHeart = {
      id: Date.now() + Math.random(),
      x: clickX,
      y: clickY,
      color: ['#f43f5e', '#f472b6', '#fbbf24', '#fda4af'][Math.floor(Math.random() * 4)],
    };

    setInteractiveHearts(prev => [...prev.slice(-12), newHeart]);
  };

  const handleLanternClick = (l, e) => {
    e.stopPropagation();
    audio.playMusicBoxNote(659.25 + l.id * 80, 0, 1.5);
    setLitLanterns(prev => new Set([...prev, l.id]));
    setActiveNote(l.text);

    // GSAP bounce on clicked lantern
    gsap.fromTo(e.currentTarget, { scale: 0.85 }, { scale: 1.15, duration: 0.3, yoyo: true, repeat: 1, ease: 'back.out(2)' });
  };

  return (
    <div ref={treeContainerRef} className="relative min-h-[85vh] w-full flex flex-col items-center justify-center p-4 text-center select-none">
      
      {/* Soft Ambient Light Pink Atmosphere */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-radial from-rose-300/25 via-pink-200/20 to-transparent blur-3xl pointer-events-none" />

      {/* Floating Header */}
      <div className="relative z-10 flex flex-col items-center mb-1 max-w-lg">
        <span className="font-mono text-xs uppercase tracking-widest text-rose-600 font-semibold mb-1">
          {treeData?.badge || "A Sacred Bloom ✨"}
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif-luxury text-rose-950 leading-tight">
          Happy Birthday, <span className="font-script-romantic text-4xl sm:text-6xl text-rose-600 text-glow-rose font-bold">{partnerName}</span>!
        </h2>
        <p className="text-xs sm:text-sm text-rose-800/80 font-light mt-0.5 max-w-md">
          {treeData?.subtitle || `You are turning ${partnerAge}... and every single day you blossom brighter than the dawn 🌸`}
        </p>
      </div>

      {/* Centerpiece: Grand Sakura Blossom Tree & Hanging Lanterns */}
      <div
        onClick={handleTreeClick}
        className="gsap-tree-trunk relative w-80 sm:w-[420px] h-80 sm:h-[420px] my-2 flex items-center justify-center cursor-pointer select-none"
        title="Tap the tree to blossom more love!"
      >
        {/* Soft Radial Trunk Halo */}
        <div className="absolute w-72 h-72 rounded-full bg-rose-400/20 blur-3xl -top-4 pointer-events-none" />

        {/* Tree SVG Trunk */}
        <svg
          viewBox="0 0 200 240"
          className="w-full h-full filter drop-shadow-[0_8px_15px_rgba(244,63,94,0.15)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Trunk */}
          <path
            d="M96 230 C96 195, 93 170, 98 145 C102 125, 91 105, 100 80"
            stroke="#854d27"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Main Branch Left */}
          <path
            d="M98 145 C80 130, 60 120, 50 90 C45 75, 36 68, 30 55"
            stroke="#9c5b2f"
            strokeWidth="7.5"
            strokeLinecap="round"
          />
          {/* Main Branch Right */}
          <path
            d="M98 135 C118 125, 138 115, 150 90 C158 72, 166 65, 172 52"
            stroke="#9c5b2f"
            strokeWidth="7.5"
            strokeLinecap="round"
          />
          {/* Left Mid Branch */}
          <path
            d="M72 115 C66 95, 64 80, 72 65"
            stroke="#b06937"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          {/* Center Crown Branch */}
          <path
            d="M100 80 C100 60, 95 45, 92 35"
            stroke="#b06937"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          {/* Right Mid Branch */}
          <path
            d="M128 110 C134 90, 132 75, 126 60"
            stroke="#b06937"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Blooming Heart Leaves Canopy */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {leafNodes.slice(0, bloomedCount).map((leaf) => (
            <div
              key={leaf.id}
              className="absolute transition-all duration-700 select-none animate-fade-in"
              style={{
                transform: `translate(${leaf.x}px, ${leaf.y}px) rotate(${leaf.rotation}deg)`,
                fontSize: `${leaf.size}px`,
                color: leaf.color,
                filter: `drop-shadow(0 0 5px ${leaf.color}77)`,
              }}
            >
              ❤
            </div>
          ))}
        </div>

        {/* 4 Hanging Fairy Light Lanterns */}
        <div className="absolute inset-0 pointer-events-auto">
          {/* Lantern 1 */}
          <button
            onClick={(e) => handleLanternClick(lanternCompliments[0], e)}
            className="gsap-lantern absolute top-16 left-6 group cursor-pointer transition-transform hover:scale-125"
            title="Tap to light lantern"
          >
            <div className="w-0.5 h-6 bg-amber-400/80 mx-auto" />
            <div className={`w-8 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
              litLanterns.has(1)
                ? 'bg-amber-300 text-rose-900 shadow-[0_0_18px_#f59e0b] animate-pulse'
                : 'bg-white/80 border border-amber-300 text-amber-600'
            }`}>
              <i className="ri-sun-fill text-xs"></i>
            </div>
          </button>

          {/* Lantern 2 */}
          <button
            onClick={(e) => handleLanternClick(lanternCompliments[1], e)}
            className="gsap-lantern absolute top-24 left-24 group cursor-pointer transition-transform hover:scale-125"
            title="Tap to light lantern"
          >
            <div className="w-0.5 h-7 bg-amber-400/80 mx-auto" />
            <div className={`w-8 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
              litLanterns.has(2)
                ? 'bg-rose-400 text-white shadow-[0_0_18px_#f43f5e] animate-pulse'
                : 'bg-white/80 border border-rose-300 text-rose-500'
            }`}>
              <i className="ri-heart-pulse-fill text-xs"></i>
            </div>
          </button>

          {/* Lantern 3 */}
          <button
            onClick={(e) => handleLanternClick(lanternCompliments[2], e)}
            className="gsap-lantern absolute top-20 right-24 group cursor-pointer transition-transform hover:scale-125"
            title="Tap to light lantern"
          >
            <div className="w-0.5 h-6 bg-amber-400/80 mx-auto" />
            <div className={`w-8 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
              litLanterns.has(3)
                ? 'bg-pink-400 text-white shadow-[0_0_18px_#ec4899] animate-pulse'
                : 'bg-white/80 border border-pink-300 text-pink-500'
            }`}>
              <i className="ri-music-fill text-xs"></i>
            </div>
          </button>

          {/* Lantern 4 */}
          <button
            onClick={(e) => handleLanternClick(lanternCompliments[3], e)}
            className="gsap-lantern absolute top-14 right-6 group cursor-pointer transition-transform hover:scale-125"
            title="Tap to light lantern"
          >
            <div className="w-0.5 h-8 bg-amber-400/80 mx-auto" />
            <div className={`w-8 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
              litLanterns.has(4)
                ? 'bg-amber-400 text-rose-950 shadow-[0_0_18px_#fbbf24] animate-pulse'
                : 'bg-white/80 border border-amber-300 text-amber-600'
            }`}>
              <i className="ri-sparkling-fill text-xs"></i>
            </div>
          </button>
        </div>

        {/* Interactive Click Spawned Hearts */}
        {interactiveHearts.map((h) => (
          <div
            key={h.id}
            className="absolute pointer-events-none text-2xl animate-ping"
            style={{
              left: `${h.x}px`,
              top: `${h.y}px`,
              color: h.color,
            }}
          >
            💖
          </div>
        ))}
      </div>

      {/* Floating Active Lantern Compliment Bubble */}
      {activeNote ? (
        <div className="relative z-10 my-1 px-5 py-2.5 rounded-full bg-white/90 border border-rose-300 text-xs sm:text-sm text-rose-900 font-handwriting-cute text-xl shadow-[0_4px_20px_rgba(244,63,94,0.15)] backdrop-blur-md animate-fade-in flex items-center gap-2">
          <span>🌸</span>
          <span>{activeNote}</span>
          <span>✨</span>
        </div>
      ) : (
        <p className="text-xs text-rose-700/80 my-1 italic font-light">
          💡 Tap the hanging lanterns or tree branches to blossom love
        </p>
      )}

      {/* Continue Button */}
      <button
        onClick={() => {
          audio.playTap();
          onNext();
        }}
        className="relative z-10 mt-3 py-3.5 px-8 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-400 text-white font-serif-luxury tracking-wide text-sm flex items-center gap-2 shadow-[0_4px_20px_rgba(244,63,94,0.3)] transition-all cursor-pointer transform hover:scale-105 active:scale-95"
      >
        <span>{treeData?.buttonText || "Blow The Candles 🎂"}</span>
        <i className="ri-arrow-right-line text-lg"></i>
      </button>
    </div>
  );
};

export default HeartTreeWish;
