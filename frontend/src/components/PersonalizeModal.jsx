import { useState } from 'react';
import { audio } from '../utils/audioEngine';

const PersonalizeModal = ({ isOpen, onClose, config, onSave }) => {
  const [partnerName, setPartnerName] = useState(config.partnerName || 'Debuu');
  const [partnerAge, setPartnerAge] = useState(config.partnerAge || '20');
  const [secretPin, setSecretPin] = useState(config.secretPin || '12042005');
  const [senderName, setSenderName] = useState(config.senderName || 'Forever Yours ❤️');

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/40 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white/95 border border-rose-300 shadow-[0_20px_60px_rgba(244,63,94,0.25)] relative text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <i className="ri-close-line text-lg"></i>
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center mb-5">
          <div className="w-12 h-12 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center text-2xl mb-2 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
            <i className="ri-sparkling-fill"></i>
          </div>
          <h3 className="font-serif-luxury text-xl sm:text-2xl text-rose-950 font-normal">
            Personalize Your Wish
          </h3>
          <p className="text-xs text-rose-800/80 mt-1">Customize the name, age, and secret code</p>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-rose-900 mb-1.5 font-semibold">
              Birthday Person's Name
            </label>
            <input
              type="text"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              placeholder="e.g. Ananya, Priya, Shubham"
              className="w-full px-4 py-2.5 rounded-2xl bg-rose-50/60 border border-rose-200 text-rose-950 placeholder-rose-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition-all font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-rose-900 mb-1.5 font-semibold">
                Age Turning
              </label>
              <input
                type="number"
                value={partnerAge}
                onChange={(e) => setPartnerAge(e.target.value)}
                placeholder="21"
                className="w-full px-4 py-2.5 rounded-2xl bg-rose-50/60 border border-rose-200 text-rose-950 placeholder-rose-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition-all font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-rose-900 mb-1.5 font-semibold">
                Secret Passcode (8 digits)
              </label>
              <input
                type="text"
                maxLength={8}
                value={secretPin}
                onChange={(e) => setSecretPin(e.target.value)}
                placeholder="12042005"
                className="w-full px-4 py-2.5 rounded-2xl bg-rose-50/60 border border-rose-200 text-rose-950 placeholder-rose-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-rose-400 transition-all font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-rose-900 mb-1.5 font-semibold">
              Your Sign-Off / Love Signature
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="e.g. Forever Yours ❤️"
              className="w-full px-4 py-2.5 rounded-2xl bg-rose-50/60 border border-rose-200 text-rose-950 placeholder-rose-300 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition-all font-medium"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-medium cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-400 text-white text-xs font-serif-luxury tracking-wider shadow-md shadow-rose-900/20 cursor-pointer transition-transform hover:scale-105 active:scale-95 font-semibold"
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
