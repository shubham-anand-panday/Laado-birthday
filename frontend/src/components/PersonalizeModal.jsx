import { useState } from 'react';
import { audio } from '../utils/audioEngine';

const PersonalizeModal = ({ isOpen, onClose, config, onSave }) => {
  const [partnerName, setPartnerName] = useState(config.partnerName || "Shristi 'Laado..10:39'");
  const [partnerAge, setPartnerAge] = useState(config.partnerAge || '22');
  const [secretPin, setSecretPin] = useState(config.secretPin || '28102026');
  const [senderName, setSenderName] = useState(config.senderName || 'Yours Till My Last Breath ❤️ Shubham');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    audio.playChimeSuccess();
    onSave({
      partnerName,
      partnerAge,
      secretPin,
      senderName,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#140407]/95 border border-red-600/70 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-red-950 hover:bg-red-900 text-red-300 flex items-center justify-center transition-colors cursor-pointer border border-red-800"
        >
          <i className="ri-close-line text-lg"></i>
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center mb-5">
          <div className="w-12 h-12 rounded-full bg-red-900/40 text-red-500 flex items-center justify-center text-2xl mb-2 shadow-[0_0_15px_rgba(220,38,38,0.4)]">
            <i className="ri-sparkling-fill"></i>
          </div>
          <h3 className="font-serif-luxury text-xl sm:text-2xl text-white font-normal">
            Personalize Your Wish
          </h3>
          <p className="text-xs text-red-300/80 mt-1">Customize the name, age, and secret code</p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-red-400 mb-1.5 font-semibold">
              Birthday Person's Name
            </label>
            <input
              type="text"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              placeholder="e.g. Shristi 'Laado..10:39'"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#1c060d] border border-red-900/60 text-red-100 placeholder-red-400/40 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-red-400 mb-1.5 font-semibold">
                Age Turning
              </label>
              <input
                type="number"
                value={partnerAge}
                onChange={(e) => setPartnerAge(e.target.value)}
                placeholder="22"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#1c060d] border border-red-900/60 text-red-100 placeholder-red-400/40 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-red-400 mb-1.5 font-semibold">
                Secret Passcode (8 digits)
              </label>
              <input
                type="text"
                maxLength={8}
                value={secretPin}
                onChange={(e) => setSecretPin(e.target.value)}
                placeholder="28102026"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#1c060d] border border-red-900/60 text-red-100 placeholder-red-400/40 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-red-400 mb-1.5 font-semibold">
              Your Sign-Off / Love Signature
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="e.g. Yours Till My Last Breath ❤️ Shubham"
              className="w-full px-4 py-2.5 rounded-2xl bg-[#1c060d] border border-red-900/60 text-red-100 placeholder-red-400/40 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full bg-red-950/80 hover:bg-red-900 text-red-300 text-xs font-medium cursor-pointer transition-colors border border-red-900/60"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-full bg-gradient-to-r from-red-700 via-rose-700 to-red-800 hover:from-red-600 hover:to-rose-600 text-white text-xs font-serif-luxury tracking-wider shadow-md shadow-black/40 cursor-pointer transition-transform hover:scale-105 active:scale-95 font-semibold"
            >
              Save Changes ✨
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalizeModal;
