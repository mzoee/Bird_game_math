import BaseScene from "./BaseScene";
import MenuScene from "./MenuScene";

class ScoreScene extends BaseScene {
  constructor(config) {
    super("ScoreScene", config);
    this.MenuScene = new MenuScene(config);
    this.menu = [{ scene: "MenuScene", text: "Back" }];
    this.bestScore = 0;
  }

  create() {
    super.create();
    this.createMenu(this.menu, this.MenuScene.setupEvent.bind(this));
    this.showBestScore();
    this.addScore(this.bestScore);
  }
  showBestScore() {
    this.bestScore = !localStorage.getItem("bestScore")
      ? 0
      : localStorage.getItem("bestScore") * 1;
  }
}

export default ScoreScene;
