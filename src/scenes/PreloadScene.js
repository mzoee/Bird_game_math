import Phaser from "phaser";

class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }
  /**
   * preload method to load all images
   */
  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("newBG", "assets/NewBG.png");
    // for animate the bird use spritesheet to devide image 128/8 = 16 and 48/3 = 16
    this.load.spritesheet("bird", "assets/birdSprite.png", {
      frameWidth: 16,
      frameHeigh: 16,
    });
    this.load.image("pipe", "assets/pipe.png");
    this.load.image("pause", "assets/pause.png");
    this.load.image("heart", "assets/heart.png");
    this.load.image("explosion", "assets/explosion.png");
    //
    this.load.image("apple", "assets/apple.png");
    this.load.image("banana", "assets/banana.png");
    this.load.image("grape", "assets/grape.png");
    this.load.image("lemon", "assets/lemon.png");
    this.load.image("pear", "assets/pear.png");
  }

  /**
   * show menu scene
   * @returns {void} start the Menu Scene
   */
  create() {
    this.scene.start("MenuScene");
  }
}

export default PreloadScene;
