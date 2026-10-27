import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { audio } from '../utils/audioEngine';

const defaultLanternCompliments = [
  { id: 1, text: "I love you to death — no wedding vows and no distance will ever change that ❤️", icon: "ri-heart-pulse-fill" },
  { id: 2, text: "Your smile was my home; even if you leave, my doors will forever stay open 🚪✨", icon: "ri-home-heart-fill" },
  { id: 3, text: "Wishing you the happiest 22nd birthday, my queen, my Laado 👑🎂", icon: "ri-cake-3-fill" },
  { id: 4, text: "Agar thoda sa bhi mumkin ho, agar tumhara dil chahe, toh laut aana... 🥀🕊️", icon: "ri-sparkling-fill" },
];

const generateLeafNodes = () => {
  const totalLeaves = 95;
  const leaves = [];
  const colors = ['#dc2626', '#ef4444', '#b91c1c', '#991b1b', '#7f1d1d', '#f87171', '#fbbf24', '#f59e0b'];

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

const HeartTreeWish = ({ onNext, partnerName = 'Shristi', partnerAge = '22', treeData }) => {
  const [leafNodes] = useState(generateLeafNodes);
  const [bloomedCount, setBloomedCount] = useState(0);
  const [interactiveHearts, setInteractiveHearts] = useState([]);
  const [litLanterns, setLitLanterns] = useState(new Set([1]));
  const [activeNote, setActiveNote] = useState(null);
  const treeContainerRef = useRef(null);

  const lanterns = treeData?.lanterns || defaultLanternCompliments;

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

    setInteractiveHearts((prev) => [
      ...prev.slice(-6),
      {
        id: Date.now() + Math.random(),
        x: clickX,
        y: clickY,
        color: ['#dc2626', '#ef4444', '#b91c1c', '#fbbf24'][Math.floor(Math.random() * 4)],
      },
    ]);
  };

  const handleLanternClick = (lantern, e) => {
    e.stopPropagation();
    audio.playChimeSuccess();
    setLitLanterns((prev) => new Set([...prev, lantern.id]));
    setActiveNote(lantern.text);
  };

  return (
    <div
      ref={treeContainerRef}
      className="relative min-h-[85vh] w-full flex flex-col items-center justify-center p-3 text-center select-none"
    >
      {/* Soft Ambient Crimson Atmosphere */}
      <div className="absolute w-[520px] h-[520px] rounded-full bg-radial from-red-950/40 via-red-900/15 to-transparent blur-3xl pointer-events-none" />

      {/* Header Flourish in Red & Black Theme */}
      <div className="relative z-10 flex flex-col items-center mb-2 max-w-lg">
        <span className="font-mono text-xs uppercase tracking-widest text-red-400 font-bold mb-1">
          ✦ {treeData?.badge || "The Crimson Sakura of Eternal Devotion"} ✦
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif-luxury text-white leading-tight font-normal">
          Sacred Blossom of Love
        </h2>
        <p className="text-xs sm:text-sm text-red-200/80 font-light mt-1 max-w-md leading-relaxed">
          {treeData?.subtitle || `${partnerAge} years ago, the universe created perfection. Every crimson blossom carries a silent tear and a dying prayer for your lifelong joy 🌺`}
        </p>
      </div>

      {/* Interactive Sacred Heart Tree Container */}
      <div
        onClick={handleTreeClick}
        className="relative w-80 h-80 sm:w-96 sm:h-96 my-2 flex items-center justify-center cursor-pointer select-none"
      >
        {/* Soft Crimson Halo around Canopy */}
        <div className="absolute inset-4 rounded-full bg-radial from-red-600/25 via-rose-900/15 to-transparent blur-2xl pointer-events-none" />

        {/* Tree Trunk & Branches SVG */}
        <svg
          viewBox="0 0 200 200"
          className="gsap-tree-trunk absolute inset-0 w-full h-full pointer-events-none filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
        >
          {/* Main Trunk Base */}
          <path
            d="M95 190 C95 160, 90 140, 93 115 C95 90, 105 90, 107 115 C110 140, 105 160, 105 190 Z"
            fill="#3a131b"
          />
          {/* Main Branch Left */}
          <path
            d="M96 130 C76 120, 56 110, 45 85 C38 68, 30 60, 24 48"
            stroke="#4d1a24"
            strokeWidth="7.5"
            strokeLinecap="round"
          />
          {/* Main Branch Right */}
          <path
            d="M98 135 C118 125, 138 115, 150 90 C158 72, 166 65, 172 52"
            stroke="#4d1a24"
            strokeWidth="7.5"
            strokeLinecap="round"
          />
          {/* Left Mid Branch */}
          <path
            d="M72 115 C66 95, 64 80, 72 65"
            stroke="#63212e"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          {/* Center Crown Branch */}
          <path
            d="M100 80 C100 60, 95 45, 92 35"
            stroke="#63212e"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
          {/* Right Mid Branch */}
          <path
            d="M128 110 C134 90, 132 75, 126 60"
            stroke="#63212e"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Blooming Crimson Heart Leaves Canopy */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {leafNodes.slice(0, bloomedCount).map((leaf) => (
            <div
              key={leaf.id}
              className="absolute transition-all duration-700 select-none animate-fade-in"
              style={{
                transform: `translate(${leaf.x}px, ${leaf.y}px) rotate(${leaf.rotation}deg)`,
                fontSize: `${leaf.size}px`,
                color: leaf.color,
                filter: `drop-shadow(0 0 6px ${leaf.color}aa)`,
              }}
            >
              ❤
            </div>
          ))}
        </div>

        {/* 4 Hanging Fairy Light Lanterns */}
        <div className="absolute inset-0 pointer-events-auto">
          {lanterns.slice(0, 4).map((lantern, idx) => {
            const positions = [
              "top-16 left-6",
              "top-24 left-24",
              "top-20 right-24",
              "top-14 right-6"
            ];
            const isLit = litLanterns.has(lantern.id);
            return (
              <button
                key={lantern.id}
                onClick={(e) => handleLanternClick(lantern, e)}
                className={`gsap-lantern absolute ${positions[idx]} group cursor-pointer transition-transform hover:scale-125`}
                title="Tap to light lantern"
              >
                <div className="w-0.5 h-6 bg-amber-400/80 mx-auto" />
                <div className={`w-8 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  isLit
                    ? 'bg-red-600 text-amber-200 shadow-[0_0_20px_#ef4444] border border-amber-300 animate-pulse'
                    : 'bg-[#180407]/90 border border-red-800 text-red-400'
                }`}>
                  <i className={`${lantern.icon || 'ri-heart-pulse-fill'} text-xs`}></i>
                </div>
              </button>
            );
          })}
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
            🥀
          </div>
        ))}
      </div>

      {/* Floating Active Lantern Compliment Bubble */}
      {activeNote ? (
        <div className="relative z-10 my-1 px-5 py-2.5 rounded-full bg-[#150407]/95 border border-red-500/70 text-xs sm:text-sm text-red-100 font-handwriting-cute text-xl shadow-[0_4px_25px_rgba(220,38,38,0.4)] backdrop-blur-md animate-fade-in flex items-center gap-2">
          <span>🥀</span>
          <span>{activeNote}</span>
          <span>✨</span>
        </div>
      ) : (
        <p className="text-xs text-red-300/80 my-1 italic font-light">
          {treeData?.hint || "💡 Touch each glowing ruby lantern to hear the unspoken truths my heart whispers for you"}
        </p>
      )}

      {/* Continue Button */}
      <button
        onClick={() => {
          audio.playTap();
          onNext();
        }}
        className="relative z-10 mt-3 py-3.5 px-8 rounded-full bg-gradient-to-r from-red-700 via-rose-700 to-red-800 hover:from-red-600 hover:to-rose-600 text-white font-serif-luxury tracking-wide text-sm flex items-center gap-2 shadow-[0_4px_25px_rgba(220,38,38,0.5)] transition-all cursor-pointer transform hover:scale-105 active:scale-95"
      >
        <span>{treeData?.buttonText || "Witness The Milestones of My Love ⏳"}</span>
        <i className="ri-arrow-right-line text-lg"></i>
      </button>
    </div>
  );
};

export default HeartTreeWish;
