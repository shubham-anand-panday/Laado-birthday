import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { audio } from '../utils/audioEngine';

const AudioBar = ({ currentStep, totalSteps }) => {
  const [audioState, setAudioState] = useState(() => audio.getState());
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const fileInputRef = useRef(null);
  const headerRef = useRef(null);
  const volumeSliderRef = useRef(null);

  useEffect(() => {
    // GSAP header entrance with clearProps
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', clearProps: 'all' }
      );
    }

    // Subscribe to custom music engine state
    const unsubscribe = audio.subscribe((newState) => {
      setAudioState(newState);
    });

    return () => unsubscribe();
  }, []);

  const handleToggle = () => {
    audio.toggleMusic();
  };

  const handleNextTrack = () => {
    audio.nextTrack();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      audio.loadCustomFile(file);
      e.target.value = '';
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    audio.setVolume(val);
  };

  const { isPlaying, currentTrack, volume } = audioState;

  return (
    <div
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-8 pt-3 sm:pt-4 pb-2 flex items-center justify-between pointer-events-none select-none"
    >
      {/* Left: Romantic Title & Chapter Badge in Red & Black */}
      <div className="pointer-events-auto flex items-center gap-2.5 sm:gap-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-950/80 border border-red-600/60 flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)] animate-heart-thump">
          <i className="ri-heart-3-fill text-lg sm:text-xl text-red-500"></i>
        </div>
        <div>
          <span className="font-script-romantic text-xl sm:text-3xl text-red-400 text-glow-red tracking-wide leading-none block font-bold">
            Yours Forever
          </span>
          <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-red-300/70 block -mt-0.5 font-medium">
            Chapter {currentStep + 1} of {totalSteps}
          </span>
        </div>
      </div>

      {/* Right: Custom Romantic Music Player Capsule in Dark Obsidian & Ruby */}
      <div className="pointer-events-auto flex items-center gap-2">
        <div className="flex items-center gap-2 sm:gap-3 bg-[#120407]/90 hover:bg-[#1a060b] border border-red-500/40 rounded-full pl-2 pr-3 sm:pr-4 py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all">
          
          {/* Spinning Deep Black & Ruby Vinyl Record */}
          <button
            onClick={handleToggle}
            className="relative cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title={isPlaying ? "Pause Romantic Music" : "Play Romantic Music"}
          >
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-red-500/80 flex items-center justify-center shadow-md relative ${
                isPlaying ? 'animate-spin-slow shadow-[0_0_20px_rgba(220,38,38,0.6)]' : ''
              }`}
              style={{
                background: 'radial-gradient(circle, #b91c1c 18%, #dc2626 45%, #7f1d1d 75%, #050102 100%)',
              }}
            >
              {/* Vinyl center gold label */}
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-300 to-yellow-200 border border-red-950 flex items-center justify-center shadow-inner">
                <span className="w-1 h-1 rounded-full bg-red-950"></span>
              </div>

              {/* Concentric Grooves */}
              <div className="absolute inset-1 rounded-full border border-white/20 pointer-events-none"></div>
              <div className="absolute inset-2 rounded-full border border-white/10 pointer-events-none"></div>
            </div>

            {/* Music note indicator */}
            {isPlaying && (
              <span className="absolute -top-2 -right-1 text-xs text-red-400 animate-bounce pointer-events-none font-bold">
                ♪
              </span>
            )}
          </button>

          {/* Track Info (Clickable to toggle play) */}
          <div
            onClick={handleToggle}
            className="cursor-pointer select-none max-w-[200px] sm:max-w-[300px] text-left"
            title="Click to Play/Pause"
          >
            <div className="text-xs sm:text-sm font-semibold text-white flex items-center gap-1.5 leading-tight">
              <span>{currentTrack?.title || "Romantic Melody"}</span>
            </div>
            <div className="text-[9px] sm:text-[10px] text-red-400 font-mono flex items-center gap-1">
              <span>{isPlaying ? 'Playing • ' : 'Paused • '}</span>
              <span>{currentTrack?.artist || 'Eternal Love'}</span>
            </div>
          </div>

          {/* Play / Pause Toggle Button */}
          <button
            onClick={handleToggle}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-200 flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            title={isPlaying ? "Pause" : "Play"}
          >
            <i className={`text-base sm:text-lg ${isPlaying ? 'ri-pause-mini-fill' : 'ri-play-mini-fill'}`}></i>
          </button>

          {/* Next / Switch Track Button */}
          <button
            onClick={handleNextTrack}
            className="w-7 h-7 rounded-full hover:bg-red-950 text-red-400 hover:text-red-200 flex items-center justify-center transition-all cursor-pointer"
            title="Switch Next Romantic Track"
          >
            <i className="ri-skip-forward-mini-line text-base"></i>
          </button>

          {/* Volume Control Pill with Popover */}
          <div className="relative" ref={volumeSliderRef}>
            <button
              onClick={() => setShowVolumeSlider(!showVolumeSlider)}
              className="w-7 h-7 rounded-full hover:bg-red-950 text-red-400 hover:text-red-200 flex items-center justify-center transition-all cursor-pointer"
              title="Adjust Music Volume"
            >
              <i className={`text-base ${volume === 0 ? 'ri-volume-mute-line' : volume < 0.5 ? 'ri-volume-down-line' : 'ri-volume-up-line'}`}></i>
            </button>

            {showVolumeSlider && (
              <div className="absolute right-0 top-10 p-2.5 bg-[#140407]/95 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.9)] border border-red-600/50 flex items-center gap-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                <i className="ri-volume-mute-line text-xs text-red-400"></i>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 accent-red-600 cursor-pointer h-1.5 rounded-lg bg-red-950"
                />
                <i className="ri-volume-up-line text-xs text-red-400"></i>
              </div>
            )}
          </div>

          {/* Custom Song Upload Trigger */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            title="Upload & Play Your Special Romantic Song (MP3/WAV)"
          >
            <i className="ri-folder-music-line text-sm sm:text-base"></i>
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            accept="audio/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioBar;
