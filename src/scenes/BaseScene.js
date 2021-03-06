import Phaser from "phaser";

class BaseScene extends Phaser.Scene {
  /**
   * the constructor function with config parameter
   * @param {String} key the name of the scene class
   * @param {object} config that contain some information in super class BaseScene
   */
  constructor(key, config) {
    super(key);
    this.config = config;
    this.centerScreen = [this.config.width / 2, this.config.height / 2];
    this.fontSize = 32;
    this.fontOption = { fontSize: `${this.fontSize}px`, fill: "#fff" };
    this.lineHeight = 40;
    this.BG = null;
    this.defaultSettings = { width: 400, background: "sky", number: 2 };
    this.userSettings = this.defaultSettings;
  }

  /**
   * create method to create defualt background image
   */
  create() {
    this.BG = this.add.image(0, 0, "sky").setOrigin(0);
  }
  /**
   * create new background image
   */
  createNewBG() {
    this.BG = this.add.image(0, 0, "newBG").setOrigin(0);
  }

  /**
   * create menu with items and event handler
   * @param {{scene:("playScene"|"scoreScene"|"menuScene"|null),text:(String)}} menu menu object with items
   * @param {object} eventObject event handler
   * @returns {void} only create menu
   */
  createMenu(menu, eventObject) {
    let itemPositionY = 0;
    menu.forEach((item) => {
      item.textObject = this.add
        .text(
          this.centerScreen[0],
          this.centerScreen[1] + itemPositionY,
          item.text,
          this.fontOption
        )
        .setOrigin(0.5, 1);
      itemPositionY += this.lineHeight;
      eventObject(item);
    });
  }

  /**
   * show the player score to the screen
   * @param {Number} score score number
   * @returns {void} only set the score and show it
   */
  addScore(score) {
    this.add
      .text(
        this.centerScreen[0],
        this.centerScreen[1] - this.lineHeight,
        `Best score: ${score}`,
        this.fontOption
      )
      .setOrigin(0.5, 1);
  }

  /**
   * Show user settings option
   * @returns {void} create the setting menu
   */
  settingsOption(settingItem, eventObject) {
    this.fontOption.fontSize = "20px";

    const SettingsText = [
      { name: "width", text: "Screen width", value: [400, 800] },
      {
        name: "background",
        text: "Background image",
        value: ["sky", "nature"],
      },
    ];
    const lines =
      SettingsText.length +
      SettingsText.reduce((item) => {
        return item.value.length;
      });
    SettingsText.forEach((setting, index) => {
      this.add
        .text(
          this.centerScreen[0],
          this.centerScreen[1] - (lines - 3 * index) * this.lineHeight,
          `${setting.text}`,
          this.fontOption
        )
        .setInteractive()
        .setOrigin(0.5, 1);
      setting.value.forEach((item, idx) => {
        const valueText =
          item === this.userSettings.width ||
          item === this.userSettings.background
            ? `${item} \u2713`
            : `${item}  `;
        settingItem.titleText = setting.name;
        settingItem.textObject = this.add
          .text(
            this.centerScreen[0],
            this.centerScreen[1] -
              (lines - 3 * index - (idx + 1)) * this.lineHeight,
            valueText,
            this.fontOption
          )
          .setInteractive()
          .setOrigin(0.5, 1);

        eventObject(settingItem);
      });
    });
  }
  /**
   * set user settings from local storage
   * @returns {void} set the settings of the user
   */
  findSettings() {
    if (!localStorage.getItem("settings")) {
      this.userSettings = this.defaultSettings;
      localStorage.setItem("settings", JSON.stringify(this.defaultSettings));
    } else {
      this.userSettings = JSON.parse(localStorage.getItem("settings"));
    }
  }
  /**
   * add Help content with scrollabel text
   * @returns {void} add scrollable text
   */
  helpInstructions() {
    this.fontOption.fontSize = "14px";
    this.fontOption.wordWrap = { width: this.config.width - 80 };
    const textStartPosition = {
      x: 40,
      y: 40,
    };
    const instructions = `
This game has some features as below:

1- By clicking on "Setting", the player can choose the screen resolution and the background image.

2- By clicking on "Play", another page is appeared on the screen that the player should select the number he/she wants to practice for.

3- The bird should fly among the pipes and the "Fruits" which randomly appear in the way of the bird.

4- Each "Fruit" has a random number on it. Therefore, the aim of this game for the user is to eat the fruit that has a correct number (a correct multiplication of the number selected at the beginning of the game). Five different fruits appear on the way of the bird: banana, apple, lemon, grape & pear.

5- The bird is given three hearts at the beginning of the game, So after 3 collisions of the bird with the pipes or eating the wrong fruit, the game ends.

6- Each time that the bird eats the correct fruit, the player gains score and one heart.

7- The game has three difficulty levels: "Simple", "Normal" and "Hard". After gaining a specific score and by passing the time, the level is automatically changed. Therefore, the pipes will get closer and the fruits will appear more in the path of the bird.

8- The "Best Score" is saved for the game and is shown on the left side of the screen under the score.

9- The light of the background screen will change during the game, from morning to evening and to night. This means that the time passes with the bird flies.
    `;
    const graphics = this.make.graphics();
    graphics.fillRect(
      textStartPosition.x,
      textStartPosition.y,
      this.config.width - 2 * textStartPosition.x,
      this.config.height - 4 * textStartPosition.y
    );
    const mask = new Phaser.Display.Masks.GeometryMask(this, graphics);
    const text = this.add.text(
      textStartPosition.x + 5,
      textStartPosition.y + 5,
      `${instructions}`,
      this.fontOption
    );
    text.setMask(mask);
    const zone = this.add
      .zone(
        textStartPosition.x,
        textStartPosition.y,
        this.config.width - 2 * textStartPosition.x,
        this.config.height - 4 * textStartPosition.y
      )
      .setOrigin(0)
      .setInteractive();
    zone.on("pointermove", function (pointer) {
      if (pointer.isDown) {
        const textStop = Math.abs(
          text.height - this.scene.config.height + 4 * textStartPosition.y
        );
        text.y += pointer.velocity.y / 10;
        text.y = Phaser.Math.Clamp(text.y, -textStop, textStartPosition.y);
      }
    });
  }

  /** set numbers for playing the game */
  numbersOption(numberItem, eventObject) {
    this.fontOption.fontSize = "20px";

    const NumbersText = [
      {
        name: "number",
        text: "Select Number to study",
        value: [1, 2, 3],
      },
      {
        name: "number",
        text: "",
        value: [4, 5, 6],
      },
      {
        name: "number",
        text: "",
        value: [7, 8, 9],
      },
    ];
    const lines = NumbersText.length + 3;
    NumbersText.forEach((number, index) => {
      this.add
        .text(
          this.centerScreen[0],
          this.centerScreen[1] - (lines - 3 * index) * this.lineHeight,
          `${number.text}`,
          this.fontOption
        )
        .setInteractive()
        .setOrigin(0.5, 1);
      number.value.forEach((item, idx) => {
        const valueText =
          item === this.userSettings.number ? `${item} \u2713` : `${item}  `;
        numberItem.titleText = number.name;
        let xPosition = this.centerScreen[0];
        if (index === 0) {
          xPosition = this.centerScreen[0] - this.centerScreen[0] / 2;
        } else if (index === 2) {
          xPosition = this.centerScreen[0] + this.centerScreen[0] / 2;
        }
        numberItem.textObject = this.add
          .text(
            xPosition,
            this.centerScreen[1] - (lines - (idx + 1)) * this.lineHeight,
            valueText,
            this.fontOption
          )
          .setInteractive()
          .setOrigin(0.5, 1);

        eventObject(numberItem);
      });
    });
  }

  /**
   * Event Handler
   * @param {Object} item to show items
   * @param {String} scene name of the scene to start
   */
  eventHandler(item, scene) {
    const title = item.titleText;
    const subtitle = item.textObject;
    subtitle.on("pointerover", () => {
      subtitle.setStyle({ fill: "#ff0" });
    });
    subtitle.on("pointerout", () => {
      subtitle.setStyle({ fill: "#fff" });
    });
    subtitle.on("pointerup", () => {
      const userSettings = !localStorage.getItem("settings")
        ? JSON.parse(defaultSettings)
        : JSON.parse(localStorage.getItem("settings"));

      if (subtitle.text.indexOf("\u2713") === -1) {
        userSettings[title] = isNaN(Number(subtitle.text))
          ? subtitle.text.trim()
          : Number(subtitle.text);
        localStorage.setItem("settings", JSON.stringify(userSettings));
        subtitle.setText(`${subtitle.text} \u2713`);
      }
      this.scene.start(scene);
    });
  }
}
export default BaseScene;
