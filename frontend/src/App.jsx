import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import BackgroundAmbiance from './components/BackgroundAmbiance';
import AudioBar from './components/AudioBar';
import PasscodeScreen from './components/PasscodeScreen';
import GiftBoxSurprise from './components/GiftBoxSurprise';
import HeartTreeWish from './components/HeartTreeWish';
import MilestoneOfLove from './components/MilestoneOfLove';
import BirthdayCakeBlow from './components/BirthdayCakeBlow';
import BalloonPopWishes from './components/BalloonPopWishes';
import MemoryLanePolaroids from './components/MemoryLanePolaroids';
import ScratchCardSurprise from './components/ScratchCardSurprise';
import LoveLetterModal from './components/LoveLetterModal';
import VideoReelMoments from './components/VideoReelMoments';
import GrandFinaleCelebration from './components/GrandFinaleCelebration';
import { birthdayData } from './data';

const TOTAL_STEPS = 11;

const chapterTitles = [
  "Secret Key 🔐",
  "The Surprise 🎁",
  "Sacred Bloom 🌸",
  "Milestones ⏳",
  "Make A Wish 🎂",
  "Sky Balloons 🎈",
  "Memory Lane 📷",
  "Golden Card ✨",
  "Love Letter 💌",
  "Living Moments ✨",
  "Grand Finale 🎆"
];

const App = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const mainStageRef = useRef(null);

  // Directly sourced from birthdayData
  const partnerName = birthdayData.partnerName || 'Debuu';
  const partnerAge = birthdayData.partnerAge || 21;
  const secretPin = birthdayData.secretPin || '12042005';
  const senderName = birthdayData.senderName || 'Forever Yours ❤️';

  // GSAP smooth stage transition on step change with clearProps
  useEffect(() => {
    if (mainStageRef.current) {
      gsap.fromTo(mainStageRef.current, 
        { opacity: 0, y: 12 }, 
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', clearProps: 'all' }
      );
    }
  }, [currentStep]);

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(TOTAL_STEPS - 1, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const jumpToStep = (step) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const restartJourney = () => {
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative bg-[#fff0f5] text-[#4a0e2e] selection:bg-rose-400 selection:text-white flex flex-col justify-between overflow-x-hidden">
      {/* Immersive Light Pink Theme Ambient Atmosphere */}
      <BackgroundAmbiance />

      {/* Floating Ethereal Header with Custom Romantic Music Player */}
      <AudioBar
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
      />

      {/* Main Romantic Stage with GSAP Transition */}
      <main ref={mainStageRef} className="relative z-10 pt-20 pb-16 flex-1 flex flex-col items-center justify-center w-full max-w-5xl mx-auto px-4">
        {currentStep === 0 && (
          <PasscodeScreen
            onUnlock={nextStep}
            partnerName={partnerName}
            secretPin={secretPin}
          />
        )}

        {currentStep === 1 && (
          <GiftBoxSurprise
            onNext={nextStep}
            partnerName={partnerName}
            giftData={birthdayData.gift}
          />
        )}

        {currentStep === 2 && (
          <HeartTreeWish
            onNext={nextStep}
            partnerName={partnerName}
            partnerAge={partnerAge}
            treeData={birthdayData.tree}
          />
        )}

        {currentStep === 3 && (
          <MilestoneOfLove
            onNext={nextStep}
            partnerName={partnerName}
            age={partnerAge}
            milestoneData={birthdayData.milestones}
          />
        )}

        {currentStep === 4 && (
          <BirthdayCakeBlow
            onNext={nextStep}
            partnerName={partnerName}
            partnerAge={partnerAge}
            cakeData={birthdayData.cake}
          />
        )}

        {currentStep === 5 && (
          <BalloonPopWishes
            onNext={nextStep}
            partnerName={partnerName}
            balloonWishes={birthdayData.balloonWishes}
          />
        )}

        {currentStep === 6 && (
          <MemoryLanePolaroids
            onNext={nextStep}
            partnerName={partnerName}
            memoriesData={birthdayData.memories}
          />
        )}

        {currentStep === 7 && (
          <ScratchCardSurprise
            onNext={nextStep}
            partnerName={partnerName}
            scratchData={birthdayData.scratchCard}
          />
        )}

        {currentStep === 8 && (
          <LoveLetterModal
            onNext={nextStep}
            partnerName={partnerName}
            senderName={senderName}
            letterData={birthdayData.loveLetter}
          />
        )}

        {currentStep === 9 && (
          <VideoReelMoments
            onNext={nextStep}
            partnerName={partnerName}
            videosData={birthdayData.videos}
          />
        )}

        {currentStep === 10 && (
          <GrandFinaleCelebration
            onRestart={restartJourney}
            partnerName={partnerName}
            partnerAge={partnerAge}
            senderName={senderName}
            finaleData={birthdayData.finale}
          />
        )}
      </main>

      {/* Light Pink Constellation Progress Ribbon at Bottom */}
      <footer className="relative z-20 pb-5 flex flex-col items-center gap-1.5 pointer-events-auto">
        <div className="flex items-center gap-2 sm:gap-2.5 px-4 py-2 rounded-full bg-white/80 backdrop-blur-xl border border-rose-300 shadow-[0_4px_20px_rgba(244,63,94,0.12)]">
          {Array.from({ length: TOTAL_STEPS }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => jumpToStep(idx)}
              className={`relative transition-all duration-300 cursor-pointer group flex items-center justify-center ${
                currentStep === idx
                  ? 'scale-125'
                  : 'hover:scale-115 opacity-55 hover:opacity-100'
              }`}
              title={`Chapter ${idx + 1}: ${chapterTitles[idx]}`}
            >
              {currentStep === idx ? (
                <div className="w-5 h-2.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-400 to-rose-600 shadow-[0_0_10px_#f43f5e]" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-rose-400 group-hover:bg-rose-600" />
              )}
            </button>
          ))}
        </div>

        {/* Current Chapter Tagline */}
        <span className="text-[10px] font-mono uppercase tracking-widest text-rose-800/80 font-medium">
          {chapterTitles[currentStep]}
        </span>
      </footer>
    </div>
  );
};

export default App;