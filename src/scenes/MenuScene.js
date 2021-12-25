import BaseScene from "./BaseScene";

class MenuScene extends BaseScene {
  /**
   * the constructor function with config parameter
   * @param {object} config that contain some information in super class BaseScene
   */
  constructor(config) {
    super("MenuScene", config);
    this.menu = [
      { scene: "NumbersScene", text: "Play" },
      { scene: "ScoreScene", text: "Score" },
      { scene: "SettingsScene", text: "Settings" },
      { scene: null, text: "Exit" },
    ];
  }

  /**
   * create the background image and menu items
   * @returns {void} only create the background image and menu items
   */
  create() {
    super.create();
    this.createMenu(this.menu, this.setupEvent.bind(this));
  }

  /**
   * create menu with optional itmes
   * @param {{scene:("playScene"|"scoreScene"|"menuScene"|null),text:(String)}} menuItem menu items to show
   */
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
      menuItem.scene && menuItem.text !== "Exit"
        ? this.scene.start(menuItem.scene)
        : this.game.destroy(true);
    });
  }

  /**
   * create setting options with itmes
   * @param {object} settingItem setting items to show
   */
  settingEvent(settingItem) {
    super.eventHandler(settingItem, "SettingsScene");
  }

  /**
   * create number options with itmes
   * @param {object} numberItem number items to show
   */
  numberEvent(numberItem) {
    super.eventHandler(numberItem, "PlayScene");
  }
}

export default MenuScene;
