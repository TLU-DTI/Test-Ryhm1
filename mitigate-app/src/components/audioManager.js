class AudioManager {
  constructor() {
    this.backgroundMusic = null;
    this.uiClickSound = new Audio('/sounds/ui-click.mp3');
    this.volume = 0.5; // Default volume (50%)
  }

  setVolume(volume) {
    this.volume = volume;
    this.uiClickSound.volume = volume;
  }

  playBackgroundMusic(src) {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
    }
    this.backgroundMusic = new Audio(src);
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = this.volume;
    this.backgroundMusic.play();
  }

  stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  }

  playUIClickSound() {
    this.uiClickSound.volume = this.volume;
    this.uiClickSound.play();
  }
}

const audioManager = new AudioManager();
export default audioManager;