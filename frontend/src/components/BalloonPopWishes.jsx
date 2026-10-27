import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { audio } from '../utils/audioEngine';

const defaultWishes = [
  { id: 1, color: '#f43f5e', message: "Your laugh is my absolute favorite melody in this entire universe ❤️", action: 'fly' },
  { id: 2, color: '#ec4899', message: "You believed in me even when I struggled to believe in myself ✨", action: 'blast' },
  { id: 3, color: '#38bdf8', message: "You make the most ordinary days feel cozy, magical, and warm 🥰", action: 'fly' },
  { id: 4, color: '#a855f7', message: "Holding your hand is the safest and happiest place I know 🤝", action: 'blast' },
  { id: 5, color: '#f59e0b', message: "The world is an infinitely brighter and kinder place with you in it 🌟", action: 'fly' },
  { id: 6, color: '#10b981', message: "I would choose you in every single lifetime, without a second thought 💖", action: 'blast' },
];

const BalloonPopWishes = ({ onNext, partnerName = 'Ananya', balloonWishes = defaultWishes }) => {
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
        particleCount: 25,
        spread: 45,
        origin: { x, y: Math.max(0.1, y - 0.05) },
        colors: [balloon.color, '#ffffff', '#fda4af']
      });

      // Mark as disappeared after flying animation finishes
      setTimeout(() => {
        setDisappearedIds((prev) => new Set([...prev, balloon.id]));
      }, 1700);
    } else {
      // 💥 Balloon bursts & shatters into rubber shards
      setBurstingIds((prev) => new Set([...prev, balloon.id]));

      confetti({
        particleCount: 70,
        spread: 90,
        origin: { x, y },
        colors: [balloon.color, '#ffffff', '#fbbf24', '#f43f5e']
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
        confetti({
          particleCount: 130,
          spread: 110,
          origin: { y: 0.55 },
          colors: ['#f43f5e', '#ec4899', '#fde047', '#38bdf8', '#ffffff']
        });
      }, 500);
    }
  };

  const handleReleaseAll = () => {
    balloonWishes.forEach((b) => {
      if (b.id % 2 === 1) {
        setFlyingIds((prev) => new Set([...prev, b.id]));
      } else {
        setBurstingIds((prev) => new Set([...prev, b.id]));
      }
    });

    setTimeout(() => {
      const allIds = new Set(balloonWishes.map((b) => b.id));
      setDisappearedIds(allIds);
    }, 1200);

    const allIds = new Set(balloonWishes.map((b) => b.id));
    setRevealedIds(allIds);
    setRevealedList([...balloonWishes]);
    setActiveWish(balloonWishes[0]);

    confetti({
      particleCount: 150,
      spread: 110,
      origin: { y: 0.5 }
    });
  };

  const allRevealed = revealedIds.size === balloonWishes.length;

  return (
    <div ref={containerRef} className="relative min-h-[85vh] w-full flex flex-col items-center justify-center p-4 text-center select-none overflow-hidden">
      
      {/* Soft Ambient Light Pink Atmosphere */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-radial from-rose-300/25 via-pink-200/20 to-transparent blur-3xl pointer-events-none" />

      {/* Floating Header */}
      <div className="gsap-balloon-header relative z-10 flex flex-col items-center mb-4 max-w-lg">
        <span className="font-mono text-xs uppercase tracking-widest text-rose-700 font-bold mb-1">
          ✦ Sky Balloons & Secret Vows ✦
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif-luxury text-rose-950 leading-tight">
          6 Reasons Why You Own My Heart
        </h2>
        <p className="text-xs sm:text-sm text-rose-900/90 font-medium mt-1 max-w-md">
          Tap each balloon to release it — odd balloons <span className="font-bold text-sky-600">fly to the stars 🎈</span> and even balloons <span className="font-bold text-rose-600">blast with glitter 💥</span>!
        </p>
        <div className="mt-2 text-xs font-mono text-rose-700 font-bold bg-white/80 border border-rose-300 px-3 py-1 rounded-full shadow-sm">
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

          // If balloon is completely gone after blast/fly, render an ethereal glowing star placeholder
          if (isDisappeared) {
            return (
              <div
                key={b.id}
                onClick={() => setActiveWish(b)}
                className="w-16 h-20 sm:w-20 sm:h-24 rounded-full border-2 border-dashed border-rose-300/60 bg-white/40 flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105"
                title={`Vow #${b.id} Released! Click to view message.`}
              >
                <span className="text-lg">{isFlyType ? '☁️' : '✨'}</span>
                <span className="text-[10px] font-mono text-rose-600 font-bold mt-1">#{b.id}</span>
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
              <div className="text-[9px] font-mono font-bold text-rose-800 bg-white/90 px-2 py-0.5 rounded-full mb-1 border border-rose-200 shadow-xs">
                {isFlyType ? '🎈 Fly' : '💥 Blast'}
              </div>

              {/* Balloon Graphic */}
              <div
                className="w-16 h-20 sm:w-20 sm:h-24 rounded-[50%_50%_50%_50%/40%_40%_60%_60%] shadow-md relative flex items-center justify-center border-t border-white/70 overflow-hidden"
                style={{
                  backgroundColor: b.color,
                  boxShadow: `0 8px 22px ${b.color}55, inset 0 -6px 12px rgba(0,0,0,0.15)`,
                }}
              >
                {/* 3D Highlight Shine */}
                <div className="absolute top-2.5 left-3 w-4 h-7 bg-white/50 rounded-full blur-[1px] transform -rotate-15 pointer-events-none" />
                
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
              <div className="w-0.5 h-10 bg-gradient-to-b from-rose-400/60 to-transparent" />
            </div>
          );
        })}
      </div>

      {/* 🌟 Active Revealed Wish Spotlight Card (Displayed when a balloon is clicked) */}
      {activeWish && (
        <div className="relative z-10 w-full max-w-lg my-3 animate-wish-pop-in">
          <div className="w-full bg-white border-2 border-rose-300 rounded-3xl p-5 sm:p-6 shadow-[0_12px_35px_rgba(244,63,94,0.14)] text-stone-900 flex items-center gap-4">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-white text-base font-bold shrink-0 shadow-md"
              style={{ backgroundColor: activeWish.color }}
            >
              ❤
            </div>
            <div className="text-left flex-1">
              <span className="text-[10px] uppercase tracking-wider font-mono text-rose-600 font-bold block mb-0.5">
                Vow #{activeWish.id} for {partnerName}
              </span>
              <p className="font-handwriting-cute text-2xl sm:text-3xl text-rose-950 leading-snug">
                "{activeWish.message}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 📜 Revealed Vows Collection List (Only displays texts that have been clicked!) */}
      <div className="relative z-10 w-full max-w-2xl my-3">
        <div className="bg-white/95 border-2 border-rose-300 rounded-3xl p-5 sm:p-6 shadow-[0_10px_30px_rgba(244,63,94,0.1)]">
          
          {/* List Header */}
          <div className="flex items-center justify-between border-b border-rose-200/80 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">📜</span>
              <h3 className="font-serif-luxury text-lg sm:text-2xl text-rose-950 font-bold">
                Revealed Vows ({revealedList.length} of {balloonWishes.length})
              </h3>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              {revealedList.length === balloonWishes.length ? '✨ All 6 Unlocked!' : `${balloonWishes.length - revealedList.length} remaining in sky`}
            </span>
          </div>

          {/* List Content: ONLY displays wishes that have been clicked! */}
          {revealedList.length === 0 ? (
            <div className="py-8 text-center text-rose-800/80 text-sm font-medium">
              <span className="text-2xl block mb-1">🎈</span>
              <span>Tap any floating balloon above to pop it or release it into the sky.</span>
              <p className="text-xs text-rose-600/70 font-mono mt-1">Each secret vow will appear in this list as you release it!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {revealedList.map((b) => {
                const isFlyType = b.id % 2 === 1;

                return (
                  <div
                    key={b.id}
                    onClick={() => setActiveWish(b)}
                    className="animate-wish-pop-in p-4 rounded-2xl bg-white border border-rose-200/90 shadow-sm hover:border-rose-400 hover:shadow-md transition-all text-left cursor-pointer flex items-start gap-3.5"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0 mt-0.5 shadow-sm"
                      style={{ backgroundColor: b.color }}
                    >
                      #{b.id}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-rose-600">
                          {isFlyType ? '🎈 Flown to the Heavens' : '💥 Celebratory Pop'}
                        </span>
                        <span className="text-[10px] text-amber-500">✨</span>
                      </div>
                      <p className="font-handwriting-cute text-xl sm:text-2xl text-rose-950 leading-snug">
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
            className="py-3.5 px-8 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-400 text-white font-serif-luxury tracking-wide text-sm flex items-center gap-2 shadow-[0_4px_25px_rgba(244,63,94,0.3)] transition-all cursor-pointer transform hover:scale-105 active:scale-95 animate-pulse"
          >
            <span>Walk Down Memory Lane (10 Photos) 📷</span>
            <i className="ri-arrow-right-line text-lg"></i>
          </button>
        ) : (
          <button
            onClick={handleReleaseAll}
            className="py-2.5 px-5 rounded-full bg-white hover:bg-rose-50 text-xs text-rose-700 font-semibold border border-rose-300 shadow-sm cursor-pointer transition-colors"
          >
            Release & Blast all balloons at once ✨
          </button>
        )}
      </div>
    </div>
  );
};

export default BalloonPopWishes;
