import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";
import MenuScene from "./scenes/MenuScene";
import PreloadScene from "./scenes/PreloadScene";
import ScoreScene from "./scenes/ScoreScene";
import SettingsScene from "./scenes/SettingsScene";
import PauseScene from "./scenes/PauseScene";
import NumbersScene from "./scenes/NumbersScene";
import HelpScene from "./scenes/HelpScene";

const width = !localStorage.getItem("settings")
  ? 400
  : JSON.parse(localStorage.getItem("settings")).width;
const height = 600;
const birdInitialPosition = { x: width * 0.1, y: height / 2 };
const initConfig = {
  width,
  height,
  startPosition: birdInitialPosition,
};
// instantiate the scenes
const Scenes = [
  PreloadScene,
  MenuScene,
  HelpScene,
  NumbersScene,
  ScoreScene,
  SettingsScene,
  PlayScene,
  PauseScene,
];
const initScenes = () => Scenes.map((Scene) => new Scene(initConfig));

// set the Configuration
const config = {
  type: Phaser.AUTO,
  ...initConfig,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      //debug: true,
    },
  },
  scene: initScenes(),
};

new Phaser.Game(config);
