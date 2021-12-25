import BaseScene from "./BaseScene";
import MenuScene from "./MenuScene";

class PauseScene extends BaseScene {
  constructor(config) {
    super("PauseScene", config);
    this.MenuScene = new MenuScene(config);
    this.menu = [
      { scene: "PlayScene", text: "Continue" },
      { scene: "MenuScene", text: "Exit" },
    ];
  }

  create() {
    super.create();
    this.createMenu(this.menu, this.setupEvent.bind(this));
  }

  setupEvent(menuItem) {
    const menuTextItem = menuItem.textObject;
    menuTextItem.setInteractive();
    menuTextItem.on("pointerover", () => {
      menuTextItem.setStyle({ fill: "#ff0" });
    });
    menuTextItem.on("pointerout", () => {
      menuTextItem.setStyle({ fill: "#fff" });
    });
    menuTextItem.on("pointerup", () => {
      if (menuItem.text === "Continue") {
        this.scene.stop();
        this.scene.resume(menuItem.scene);
      } else {
        this.scene.stop("PlayScene");
        this.scene.start(menuItem.scene);
      }
    });
  }
}

export default PauseScene;
