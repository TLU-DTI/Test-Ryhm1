// audioManager.js
class AudioManager {
    constructor() {
      this.backgroundMusic = null;
      this.uiClickSound = new Audio('/sounds/ui-click.mp3');
    }
  
    playBackgroundMusic(src) {
      if (this.backgroundMusic) {
        this.backgroundMusic.pause();
      }
      this.backgroundMusic = new Audio(src);
      this.backgroundMusic.loop = true;
      this.backgroundMusic.play();
    }
  
    stopBackgroundMusic() {
      if (this.backgroundMusic) {
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;
      }
    }
  
    playUIClickSound() {
      this.uiClickSound.play();
    }
  }
  
  const audioManager = new AudioManager();
  export default audioManager;  