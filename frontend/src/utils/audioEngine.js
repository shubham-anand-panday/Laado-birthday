import { birthdayData } from '../data';

class RomanticAudioEngine {
  constructor() {
    this.playlist = birthdayData?.music?.playlist || [
      {
        id: 'heartwarming',
        title: 'Heartwarming Romance',
        artist: 'Kevin MacLeod',
        src: '/romantic-music.mp3',
        tag: 'Piano & Strings'
      },
      {
        id: 'carefree',
        title: 'Carefree Sweet Melody',
        artist: 'Kevin MacLeod',
        src: '/carefree-melody.mp3',
        tag: 'Acoustic Joy'
      }
    ];

    this.currentIndex = 0;
    this.volume = 0.6;
    this.audioElement = null;
    this.isPlaying = false;
    this.listeners = new Set();
    this.customUploadedTrack = null;

    if (typeof window !== 'undefined') {
      this.initAudioElement();
    }
  }

  initAudioElement() {
    if (this.audioElement) return;

    this.audioElement = new Audio();
    this.audioElement.preload = 'auto';
    this.audioElement.volume = this.volume;
    this.audioElement.loop = true;

    const initialTrack = this.getCurrentTrack();
    if (initialTrack?.src) {
      this.audioElement.src = initialTrack.src;
    }

    this.audioElement.addEventListener('play', () => {
      this.isPlaying = true;
      this.notify();
    });

    this.audioElement.addEventListener('pause', () => {
      this.isPlaying = false;
      this.notify();
    });

    this.audioElement.addEventListener('ended', () => {
      // Loop to next track or repeat
      this.nextTrack();
    });

    this.audioElement.addEventListener('error', (e) => {
      console.warn('Audio playback notice:', e);
      this.isPlaying = false;
      this.notify();
    });
  }

  getCurrentTrack() {
    if (this.customUploadedTrack) {
      return this.customUploadedTrack;
    }
    return this.playlist[this.currentIndex] || this.playlist[0];
  }

  getPlaylist() {
    if (this.customUploadedTrack) {
      return [this.customUploadedTrack, ...this.playlist];
    }
    return this.playlist;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    // Immediately invoke with current state
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  notify() {
    const state = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (err) {
        console.error('Error in audio subscriber:', err);
      }
    });
  }

  getState() {
    return {
      isPlaying: this.isPlaying,
      currentTrack: this.getCurrentTrack(),
      currentIndex: this.currentIndex,
      volume: this.volume,
      playlist: this.getPlaylist(),
      isCustom: Boolean(this.customUploadedTrack)
    };
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
    this.notify();
  }

  async play() {
    this.initAudioElement();
    if (!this.audioElement) return false;

    try {
      await this.audioElement.play();
      this.isPlaying = true;
      this.notify();
      return true;
    } catch (err) {
      console.log('Autoplay deferred until user interaction:', err);
      this.isPlaying = false;
      this.notify();
      return false;
    }
  }

  pause() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.isPlaying = false;
    this.notify();
  }

  toggleMusic() {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  startRomanticBackgroundMusic() {
    return this.play();
  }

  stopRomanticBackgroundMusic() {
    this.pause();
  }

  selectTrackIndex(index) {
    this.customUploadedTrack = null;
    if (index >= 0 && index < this.playlist.length) {
      this.currentIndex = index;
      const track = this.playlist[this.currentIndex];
      this.changeSource(track.src, true);
    }
  }

  nextTrack() {
    this.customUploadedTrack = null;
    this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    const track = this.playlist[this.currentIndex];
    this.changeSource(track.src, true);
  }

  prevTrack() {
    this.customUploadedTrack = null;
    this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
    const track = this.playlist[this.currentIndex];
    this.changeSource(track.src, true);
  }

  loadCustomFile(file) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    const cleanName = file.name.replace(/\.[^/.]+$/, '');
    this.customUploadedTrack = {
      id: 'custom-' + Date.now(),
      title: cleanName,
      artist: 'Your Custom Song 🎵',
      src: url,
      tag: 'Custom Upload'
    };
    this.changeSource(url, true);
  }

  changeSource(src, autoPlay = true) {
    this.initAudioElement();
    if (!this.audioElement) return;

    const wasPlaying = this.isPlaying || autoPlay;
    this.audioElement.src = src;
    this.audioElement.load();

    if (wasPlaying) {
      this.play();
    } else {
      this.notify();
    }
  }

  // Silent sound effect stubs:
  // Instead of harsh oscillator synthesize beeps, these are peaceful no-ops
  // ensuring seamless custom romantic music playback without sound interruption.
  playTap() {}
  playChimeSuccess() {}
  playHeartbeat() {}
  playBalloonPop() {}
  playCandleBlow() {}
  playMusicBoxNote() {}
}

export const audio = new RomanticAudioEngine();
