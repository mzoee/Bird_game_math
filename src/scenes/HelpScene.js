import BaseScene from "./BaseScene";
import MenuScene from "./MenuScene";

class HelpScene extends BaseScene {
  constructor(config) {
    super("HelpScene", config);
    this.MenuScene = new MenuScene(config);
    this.menu = [
      { scene: "-", text: "" },
      { scene: "-", text: "" },
      { scene: "-", text: "" },
      { scene: "-", text: "" },
      { scene: "-", text: "" },
      { scene: "-", text: "" },
      { scene: "MenuScene", text: "Back" },
    ];
    if (!localStorage.getItem("settings")) {
      this.userSettings = this.defaultSettings;
      localStorage.setItem("settings", JSON.stringify(this.defaultSettings));
    } else {
      this.userSettings = JSON.parse(localStorage.getItem("settings"));
    }
  }

  create() {
    super.create();
    this.findSettings();
    this.helpInstructions();
    // this.numbersOption(
    //   this.userSettings,
    //   this.MenuScene.numberEvent.bind(this)
    // );
    this.createMenu(this.menu, this.MenuScene.setupEvent.bind(this));
  }
}

export default HelpScene;
