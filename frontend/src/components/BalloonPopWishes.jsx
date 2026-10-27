import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { audio } from '../utils/audioEngine';

const defaultWishes = [
  { id: 1, color: '#dc2626', message: "No matter whose name is written in your wedding mehendi, my soul was already written in your destiny ❤️", action: 'fly' },
  { id: 2, color: '#991b1b', message: "I love you to death — not just when you were mine, but even as you step into your shaadi 🥀", action: 'blast' },
  { id: 3, color: '#ef4444', message: "Happy 22nd Birthday, my sweet Laado. May your eyes never see a single tear, except tears of joy ✨", action: 'fly' },
  { id: 4, color: '#b91c1c', message: "Agar thoda sa bhi mumkin ho, agar tumhara mann badal sake, toh laut aana... meri baahein hamesha tumhari hain 🫂", action: 'blast' },
  { id: 5, color: '#f59e0b', message: "You will always be the purest and most precious chapter of my life. Nobody on this earth can love you like I do 🌟", action: 'fly' },
  { id: 6, color: '#7f1d1d', message: "Even if destiny parts our hands, in every prayer, every breath, and in every lifetime — I will choose you 💖", action: 'blast' },
];

const BalloonPopWishes = ({ onNext, partnerName = 'Shristi', balloonWishes = defaultWishes }) => {
  const [revealedIds, setRevealedIds] = useState(new Set());
  const [flyingIds, setFlyingIds] = useState(new Set());
  const [burstingIds, setBurstingIds] = useState(new Set());
  const [disappearedIds, setDisappearedIds] = useState(new Set());
  const [revealedList, setRevealedList] = useState([]);
  const [activeWish, setActiveWish] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // GSAP entrance on balloons with clearProps
    const ctx = gsap.context(() => {
      gsap.fromTo('.gsap-balloon-item',
        { scale: 0.7, y: 30, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: 'back.out(1.5)', clearProps: 'all' }
      );
      gsap.fromTo('.gsap-balloon-header',
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', clearProps: 'all' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleBalloonClick = (balloon, e) => {
    if (revealedIds.has(balloon.id)) {
      setActiveWish(balloon);
      return;
    }

    audio.playBalloonPop();

    const isFlyAction = balloon.id % 2 === 1; // 1, 3, 5 Fly; 2, 4, 6 Blast

    // Coordinates for confetti / blast particles
    let x = 0.5;
    let y = 0.5;
    if (e?.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      x = (rect.left + rect.width / 2) / window.innerWidth;
      y = (rect.top + rect.height / 2) / window.innerHeight;
    }

    if (isFlyAction) {
      // 🎈 Balloon flies into the sky
      setFlyingIds((prev) => new Set([...prev, balloon.id]));
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { x, y: Math.max(0.1, y - 0.05) },
        colors: [balloon.color, '#ffffff', '#ef4444']
      });

      // Mark as disappeared after flying animation finishes
      setTimeout(() => {
        setDisappearedIds((prev) => new Set([...prev, balloon.id]));
      }, 1700);
    } else {
      // 💥 Balloon bursts & shatters into rubber shards
      setBurstingIds((prev) => new Set([...prev, balloon.id]));

      confetti({
        particleCount: 75,
        spread: 90,
        origin: { x, y },
        colors: [balloon.color, '#ffffff', '#fbbf24', '#dc2626']
      });

      // Mark as disappeared after shatter animation
      setTimeout(() => {
        setDisappearedIds((prev) => new Set([...prev, balloon.id]));
      }, 350);
    }

    // Reveal this specific wish and append it to the revealed list
    const updatedRevealed = new Set([...revealedIds, balloon.id]);
    setRevealedIds(updatedRevealed);
    setActiveWish(balloon);

    setRevealedList((prev) => {
      if (prev.some((item) => item.id === balloon.id)) return prev;
      return [...prev, balloon];
    });

    // Check if all are revealed
    if (updatedRevealed.size === balloonWishes.length) {
      setTimeout(() => {
        audio.playChimeSuccess();
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#dc2626', '#b91c1c', '#f59e0b', '#ffffff']
        });
      }, 900);
    }
  };

  const handleReleaseAll = () => {
    audio.playChimeSuccess();
    balloonWishes.forEach((b, idx) => {
      setTimeout(() => {
        setFlyingIds((prev) => new Set([...prev, b.id]));
        setRevealedIds((prev) => new Set([...prev, b.id]));
        setTimeout(() => {
          setDisappearedIds((prev) => new Set([...prev, b.id]));
        }, 1700);
      }, idx * 150);
    });

    setRevealedList(balloonWishes);
    setActiveWish(balloonWishes[balloonWishes.length - 1]);

    setTimeout(() => {
      confetti({
        particleCount: 140,
        spread: 110,
        origin: { y: 0.5 },
        colors: ['#dc2626', '#ef4444', '#f59e0b', '#ffffff']
      });
    }, 1000);
  };

  const allRevealed = revealedIds.size === balloonWishes.length;

  return (
    <div
      ref={containerRef}
      className="relative min-h-[85vh] w-full flex flex-col items-center justify-center p-3 sm:p-5 text-center select-none"
    >
      {/* Soft Ambient Crimson Atmosphere */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-radial from-red-950/40 via-red-900/15 to-transparent blur-3xl pointer-events-none" />

      {/* Floating Header */}
      <div className="gsap-balloon-header relative z-10 flex flex-col items-center mb-4 max-w-lg">
        <span className="font-mono text-xs uppercase tracking-widest text-red-400 font-bold mb-1">
          ✦ Sky Balloons & Secret Vows ✦
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif-luxury text-white leading-tight">
          6 Vows of My Die-Heart Love
        </h2>
        <p className="text-xs sm:text-sm text-red-200/80 font-light mt-1 max-w-md">
          Tap each balloon to release it — odd balloons <span className="font-bold text-red-400">fly to the stars 🎈</span> and even balloons <span className="font-bold text-amber-300">blast with embers 💥</span>!
        </p>
        <div className="mt-2 text-xs font-mono text-red-300 font-bold bg-[#170408]/90 border border-red-700 px-3 py-1 rounded-full shadow-sm">
          Released: {revealedIds.size} / {balloonWishes.length}
        </div>
      </div>

      {/* 🎈 Floating Sky Balloons Cluster */}
      <div className="relative z-10 w-full max-w-2xl min-h-[180px] my-2 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        {balloonWishes.map((b, index) => {
          const isFlying = flyingIds.has(b.id);
          const isBursting = burstingIds.has(b.id);
          const isDisappeared = disappearedIds.has(b.id);
          const isRevealed = revealedIds.has(b.id);
          const isFlyType = b.id % 2 === 1;
          const yOffset = (index % 2 === 0 ? '-10px' : '10px');

          if (isDisappeared) {
            return (
              <div
                key={b.id}
                onClick={() => setActiveWish(b)}
                className="w-16 h-20 sm:w-20 sm:h-24 rounded-full border-2 border-dashed border-red-700/60 bg-[#150408]/50 flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105"
                title={`Vow #${b.id} Released! Click to view message.`}
              >
                <span className="text-lg">{isFlyType ? '☁️' : '✨'}</span>
                <span className="text-[10px] font-mono text-red-400 font-bold mt-1">#{b.id}</span>
              </div>
            );
          }

          return (
            <div
              key={b.id}
              onClick={(e) => handleBalloonClick(b, e)}
              className={`gsap-balloon-item relative flex flex-col items-center cursor-pointer transition-transform ${
                isFlying
                  ? 'animate-balloon-fly'
                  : isBursting
                  ? 'animate-balloon-burst'
                  : 'hover:scale-115 active:scale-95'
              }`}
              style={{
                transform: !isFlying && !isBursting ? `translateY(${yOffset})` : undefined,
                animation: !isRevealed
                  ? `balloonSway 3.8s ease-in-out infinite ${index * 0.4}s`
                  : undefined,
              }}
              title={isFlyType ? `Balloon #${b.id}: Tap to Fly to the Sky 🎈` : `Balloon #${b.id}: Tap to Blast 💥`}
            >
              {/* 💥 Exploding Shard Fragments if Bursting */}
              {isBursting && (
                <div className="absolute inset-0 pointer-events-none z-30">
                  <div className="absolute inset-0 rounded-full border-2 animate-blast-ring" style={{ borderColor: b.color }} />
                  {[0, 1, 2, 3, 4, 5].map((shardIdx) => (
                    <div
                      key={shardIdx}
                      className={`absolute top-1/2 left-1/2 w-3.5 h-3.5 rounded-sm shadow-xs shard-${shardIdx}`}
                      style={{
                        backgroundColor: b.color,
                        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Action Hint Pill */}
              <div className="text-[9px] font-mono font-bold text-red-200 bg-[#160408] px-2 py-0.5 rounded-full mb-1 border border-red-800 shadow-xs">
                {isFlyType ? '🎈 Fly' : '💥 Blast'}
              </div>

              {/* Balloon Graphic */}
              <div
                className="w-16 h-20 sm:w-20 sm:h-24 rounded-[50%_50%_50%_50%/40%_40%_60%_60%] shadow-lg relative flex items-center justify-center border-t border-white/40 overflow-hidden"
                style={{
                  backgroundColor: b.color,
                  boxShadow: `0 8px 25px ${b.color}77, inset 0 -6px 12px rgba(0,0,0,0.5)`,
                }}
              >
                {/* 3D Highlight Shine */}
                <div className="absolute top-2.5 left-3 w-4 h-7 bg-white/40 rounded-full blur-[1px] transform -rotate-15 pointer-events-none" />
                
                {/* Center Number Badge */}
                <div className="flex flex-col items-center text-white drop-shadow">
                  <span className="font-serif-luxury font-black text-sm sm:text-base">#{b.id}</span>
                </div>
              </div>

              {/* Knot */}
              <div
                className="w-3.5 h-2 -mt-0.5 rounded-b-sm"
                style={{ backgroundColor: b.color }}
              />

              {/* Trailing Ribbon */}
              <div className="w-0.5 h-10 bg-gradient-to-b from-red-600/70 to-transparent" />
            </div>
          );
        })}
      </div>

      {/* 🌟 Active Revealed Wish Spotlight Card in Red & Black */}
      {activeWish && (
        <div className="relative z-10 w-full max-w-lg my-3 animate-wish-pop-in">
          <div className="w-full bg-[#160408] border-2 border-red-500/80 rounded-3xl p-5 sm:p-6 shadow-[0_12px_35px_rgba(220,38,38,0.3)] text-stone-100 flex items-center gap-4">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-white text-base font-bold shrink-0 shadow-md border border-white/20"
              style={{ backgroundColor: activeWish.color }}
            >
              ❤
            </div>
            <div className="text-left flex-1">
              <span className="text-[10px] uppercase tracking-wider font-mono text-red-400 font-bold block mb-0.5">
                Vow #{activeWish.id} for {partnerName}
              </span>
              <p className="font-handwriting-cute text-2xl sm:text-3xl text-red-100 leading-snug">
                "{activeWish.message}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 📜 Revealed Vows Collection List in Red & Black Theme */}
      <div className="relative z-10 w-full max-w-2xl my-3">
        <div className="bg-[#120306]/95 border-2 border-red-700/60 rounded-3xl p-5 sm:p-6 shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
          
          {/* List Header */}
          <div className="flex items-center justify-between border-b border-red-900/60 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">📜</span>
              <h3 className="font-serif-luxury text-lg sm:text-2xl text-white font-bold">
                Revealed Vows ({revealedList.length} of {balloonWishes.length})
              </h3>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-red-950 text-red-300 border border-red-800">
              {revealedList.length === balloonWishes.length ? '✨ All 6 Unlocked!' : `${balloonWishes.length - revealedList.length} remaining in sky`}
            </span>
          </div>

          {/* List Content */}
          {revealedList.length === 0 ? (
            <div className="py-8 text-center text-red-300/80 text-sm font-medium">
              <span className="text-2xl block mb-1">🎈</span>
              <span>Tap any floating balloon above to pop it or release it into the sky.</span>
              <p className="text-xs text-red-400/70 font-mono mt-1">Each secret vow will appear in this list as you release it!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {revealedList.map((b) => {
                const isFlyType = b.id % 2 === 1;

                return (
                  <div
                    key={b.id}
                    onClick={() => setActiveWish(b)}
                    className="animate-wish-pop-in p-4 rounded-2xl bg-[#1a060d] border border-red-900/60 shadow-sm hover:border-red-500 hover:shadow-md transition-all text-left cursor-pointer flex items-start gap-3.5"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0 mt-0.5 shadow-sm border border-white/20"
                      style={{ backgroundColor: b.color }}
                    >
                      #{b.id}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-red-400">
                          {isFlyType ? '🎈 Flown to the Heavens' : '💥 Celebratory Pop'}
                        </span>
                        <span className="text-[10px] text-amber-400">✨</span>
                      </div>
                      <p className="font-handwriting-cute text-xl sm:text-2xl text-red-100 leading-snug">
                        "{b.message}"
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="relative z-10 mt-2 mb-6">
        {allRevealed ? (
          <button
            onClick={() => {
              audio.playTap();
              onNext();
            }}
            className="py-3.5 px-8 rounded-full bg-gradient-to-r from-red-700 via-rose-700 to-red-800 hover:from-red-600 hover:to-rose-600 text-white font-serif-luxury tracking-wide text-sm flex items-center gap-2 shadow-[0_4px_25px_rgba(220,38,38,0.5)] transition-all cursor-pointer transform hover:scale-105 active:scale-95 animate-pulse"
          >
            <span>Walk Down Memory Lane (16 Keepsakes) 📷</span>
            <i className="ri-arrow-right-line text-lg"></i>
          </button>
        ) : (
          <button
            onClick={handleReleaseAll}
            className="py-2.5 px-5 rounded-full bg-[#150408] hover:bg-[#22060d] text-xs text-red-300 font-semibold border border-red-700 shadow-sm cursor-pointer transition-colors"
          >
            Release & Blast all balloons at once ✨
          </button>
        )}
      </div>
    </div>
  );
};

export default BalloonPopWishes;
