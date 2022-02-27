import BaseScene from "./BaseScene";

const PIPE_RENDER_COUNT = 4;
/**
 * Play Scene for handleing all events and object in the game
 */
class PlayScene extends BaseScene {
  /**
   * the constructor function with config parameter
   * @param {object} config that contain some information in super class BaseScene
   */
  constructor(config) {
    super("PlayScene", config);
    this.config = config;
    this.bird = null;
    this.birdScale = 3;
    this.timeBGChange = 90;
    this.life = 3;
    this.heart = null;
    this.fruits = null;
    this.fruitScale = 2;
    this.coefficientTexts = null;
    //////////////
    this.pipes = null;
    this.pause = null;
    this.isPause = false;
    this.VELOCITY = 200;
    this.flapVelocity = 300;
    this.difficulty = {
      easy: {
        pipeVertivalDistanceRange: [150, 200],
        pipeHorizontalDistanceRange: [300, 350],
      },
      normal: {
        pipeVertivalDistanceRange: [140, 190],
        pipeHorizontalDistanceRange: [280, 330],
      },
      hard: {
        pipeVertivalDistanceRange: [120, 170],
        pipeHorizontalDistanceRange: [200, 250],
      },
    };
    this.score = 0;
    this.scoreText = "";
    this.curretDifficulty = "easy";
    this.coefficient = 2;
    this.fruitsType = ["apple", "banana", "grape", "lemon", "pear"];
  }

  /**
   * creating all object that we need in the game
   * @returns {void} only create game objects
   */
  create() {
    // create background.
    // if you want change the background you can
    // comment below and uncomment super.createNewBG();
    this.findSettings();
    if (this.userSettings.background === "sky") {
      super.create();
    } else if (this.userSettings.background === "nature") {
      super.createNewBG();
    }

    // create objects of the game like bird,pipes,boms ant etc.
    this.buildBird();
    this.buildPipes();
    this.buildFruits();
    this.buildHeart();
    this.buildLife();
    this.buildTexts();

    // define the collider boundary.
    this.buildCollider();

    // define the score of the game.
    this.buildScore();

    // create pause button and handleing the events.
    this.buildPause();
    this.handleInputs();
    this.listenToEvents();

    // animate the bird with using cells between 8 to 15 (index base and start with 0)
    this.anims.create({
      key: "fly",
      frames: this.anims.generateFrameNumbers("bird", { start: 8, end: 15 }),
      frameRate: 8,
      repeat: -1,
    });
    this.bird.play("fly");

    // set the pause to false for stating the game
    this.isPause = false;
  }

  /**
   * checking some conditions during the game and change or not
   * @returns {void} only check and regenerate objects
   */
  update() {
    // checking for the bird collided to the boundary or not
    this.boundaryCollideCheck();

    // creating the pipes with its own algorithm
    this.recyclePipes();

    // create the fruits with its own algorithm
    this.recycleFruits();

    // create the Texts with its own algorithm
    this.recycleText();
  }

  /**
   * create the bird object
   * @returns {void} Only create bird object
   */
  buildBird() {
    // for animating the bird we use sprite
    // because of the incorrect direction of bird
    // we must flip it in X direction
    // and this bird is so small for this reason we magnify it
    this.bird = this.physics.add
      .sprite(this.config.startPosition.x, this.config.startPosition.y, "bird")
      .setFlipX(true)
      .setScale(this.birdScale)
      .setOrigin(0);

    // the bird size is 16x16 pixels and some of these spaces are empty.
    // when the bird empty pixels collide to the pipes, gamer loose, for
    // eliminating these space we resixe thease space.
    this.bird.setSize(this.bird.width, this.bird.height - 8);

    // set the gravity to the 600
    this.bird.body.gravity.y = 600;

    // for colliding the screen boundary
    this.bird.setCollideWorldBounds(true);
  }

  /**
   * create pipes object
   * @returns {void} only create pipes
   */
  buildPipes() {
    // we have 8 pipes that 2 pipes in a column upperPipe and lowerPipe
    // for setting a feature to the all pipe we create a group and add
    // all pipes to it.
    this.pipes = this.physics.add.group();
    for (let index = 0; index < PIPE_RENDER_COUNT; index++) {
      const upperPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable()
        .setOrigin(0, 1);
      const lowerPipe = this.pipes
        .create(0, 0, "pipe")
        .setImmovable()
        .setOrigin(0, 0);
      this.placePipe(upperPipe, lowerPipe);
    }
    this.pipes.setVelocityX(-this.VELOCITY);
  }

  /**
   * define colliding
   * @returns {void} only define collide functions
   */
  buildCollider() {
    // define the collider and the collide function between bird and pipes
    this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
    // define the collider and the collide function between bird and fruits
    this.physics.add.collider(this.bird, this.fruits, this.explode, null, this);
  }

  /**
   * create heart image top-right corner to show life
   * @returns {void} only create heart image
   */
  buildHeart() {
    // assign the heart image to the top-right corner
    this.heart = this.add
      .image(this.config.width - 10, 10, "heart")
      .setOrigin(1, 0);
  }

  /**
   * create life value and read from local storage when player pause the game
   * @returns {void} only calculate the life value in the game
   */
  buildLife() {
    this.life = 3;
    const currentLife = !localStorage.getItem("currentLife")
      ? 3
      : localStorage.getItem("currentLife");
    this.LifeText = this.add.text(
      this.heart.x - this.heart.width - 24,
      this.heart.y + 10,
      `${currentLife}`,
      { fontSize: "24px", fill: "#fff" }
    );
  }

  /**
   * for increasing or decreasing the value of life
   * @param {("inc" | "dec")} mode for increase or decrease score
   * @returns {void} set the score plus or minus
   */
  lifeStatus(mode) {
    if (mode === "inc") {
      this.life++;
    } else if (mode === "dec" && this.life > 0) {
      this.life--;
    }
    this.LifeText.setText(`${this.life}`);
  }

  /**
   * create the fruits object
   * @returns {void}  only create fruits object
   */
  buildFruits() {
    this.fruits = this.physics.add.group();

    for (let index = 0; index < PIPE_RENDER_COUNT - 1; index++) {
      const fruitObject = this.fruits
        .create(0, 0, `${this.fruitsType[Phaser.Math.Between(0, 4)]}`)
        .setImmovable()
        .setOrigin(0, 1)
        .setScale(this.fruitScale);
      this.placeFruit(fruitObject, index);
    }

    // because of the pipe motion fruits object must have the same velocity
    // if we wnat to show all fruits have vertical velocity
    this.fruits.setVelocityY(0.1 * this.VELOCITY);
    this.fruits.setVelocityX(-this.VELOCITY);
  }

  /**
   * create the text top of boms object
   * @returns {void}  only create text object
   */
  buildTexts() {
    this.coefficientTexts = this.physics.add.group();
    for (let index = 0; index < PIPE_RENDER_COUNT - 1; index++) {
      const textValue = Phaser.Math.Between(2, 100);
      const coefficientTextObject = this.add
        .text(200, 200, `${textValue}`, {
          fontSize: "24px",
          fill: "#fff",
        })
        .setOrigin(0.5, 0.5);
      this.coefficientTexts.add(coefficientTextObject);
      this.fruits.children.entries[index].number = textValue;
      this.placeText(coefficientTextObject, index);
    }

    this.coefficientTexts.setVelocityY(0.1 * this.VELOCITY);
    this.coefficientTexts.setVelocityX(-this.VELOCITY);
  }

  /**
   * calculate the position of text object top of each fruits
   * @param {Object} coefficientTextObject the text object
   * @param {Number} index the position of fruit
   * @returns {void}  only set the place of texts
   */
  placeText(coefficientTextObject, index) {
    if (this.fruits.children) {
      coefficientTextObject.x = this.fruits.children.entries[index].x;
      coefficientTextObject.y = this.fruits.children.entries[index].y - 5;
    }
  }

  /**
   * calculate the position of fruits object between two pipes
   * @param {Object} fruitObject the fruit object
   * @param {Number} pipePosition the position of pipe
   * @returns {void}  only set the place of fruits
   */
  placeFruit(fruitObject, pipePosition) {
    const difficulty = this.difficulty[this.curretDifficulty];
    const pipesX = [];
    const pipeVerticalDistance = Phaser.Math.Between(
      ...difficulty.pipeVertivalDistanceRange
    );
    const pipeVerticalPosition = Phaser.Math.Between(
      20,
      this.config.height - 20 - pipeVerticalDistance
    );
    this.pipes.getChildren().forEach((pipe, index) => {
      if (index % 2 === 0) {
        pipesX.push(pipe.x);
      }
    });
    // this is parameter for random fruit count in every cycle
    const isExist = Math.round(Math.random());
    const fruitX = Phaser.Math.Between(
      pipesX[pipePosition] + 60,
      pipesX[pipePosition + 1]
    );
    fruitObject.x = fruitX;
    if (isExist) {
      fruitObject.y = pipeVerticalPosition;
    } else {
      fruitObject.y = this.config.height;
    }
    //this.placeText(fruitObject, pipePosition);
  }

  /**
   * recycle the fruits after they arrive to the bottom of the screen
   * @returns {void} only reassign the fruits on screen
   */
  recycleFruits() {
    //when the fruit arrive to the bottom of the screen recycle to the top
    this.fruits.getChildren().forEach((fruit, index) => {
      if (fruit.getBounds().bottom >= this.config.height + fruit.height) {
        this.placeFruit(fruit, index);
      }
    });
  }

  /**
   * recycle the texts after they arrive to the bottom of the screen
   * @returns {void} only reassign the texts on screen
   */
  recycleText() {
    this.coefficientTexts.getChildren().forEach((text, index) => {
      if (text.getBounds().bottom >= this.config.height + text.height) {
        this.placeText(text, index);
      }
    });
  }

  /**
   * add the explosion image to the screen
   * @returns {void} set the explosion image and after 1 second it will be hidden
   */
  explode() {
    //
    this.fruits.getChildren().forEach((fruit, index) => {
      if (
        this.bird.x + 2 >= fruit.x - this.birdScale * this.bird.width &&
        this.bird.x <= fruit.x + this.fruitScale * fruit.width + 2
      ) {
        if (fruit.number % this.userSettings.number !== 0) {
          const explosion = this.add.image(fruit.x, fruit.y, "explosion");
          this.time.addEvent({
            delay: 1000,
            callback: () => {
              explosion.destroy(true);
            },
            loop: false,
          });
          // shake the screen effect when the bird collide to the fruit
          this.cameras.main.shake(500);
          this.gameOver();
        } else {
          const heart = this.add.image(fruit.x, fruit.y, "heart");
          this.time.addEvent({
            delay: 1000,
            callback: () => {
              heart.destroy(true);
            },
            loop: false,
          });
          fruit.y = this.config.height + fruit.height;
          this.coefficientTexts.children.entries[index].y =
            this.config.height + fruit.height;
          this.lifeStatus("inc");
        }
      }
    });
  }

  /**
   * define the score and read it from the localstorage
   * @returns {void} only set the score
   */
  buildScore() {
    this.score = 0;
    const bestScore = !localStorage.getItem("bestScore")
      ? 0
      : localStorage.getItem("bestScore");
    this.scoreText = this.add.text(16, 16, `Score: ${0}`, {
      fontSize: "16px",
      fill: "#fff",
    });
    this.add.text(16, 32, `Best score: ${bestScore}`, {
      fontSize: "16px",
      fill: "#fff",
    });
  }

  /**
   * craete pause button in right bottom corner
   * @returns {void} set the pause button and handle its events
   */
  buildPause() {
    // add the pause button in right bottom corner
    const pauseButton = this.add
      // add image of pause button
      .image(this.config.width - 10, this.config.height - 10, "pause")
      // to clickable
      .setInteractive()
      // set 3 times larger
      .setScale(3)
      .setOrigin(1);

    // pause the game with click on the button
    pauseButton.on("pointerdown", () => {
      this.isPause = true;
      this.physics.pause();
      this.scene.pause();
      this.scene.launch("PauseScene");
    });
  }

  /**
   * handle keyboard and mouse inputs
   * @returns {void} only set the click and press the SPACE key event handle
   */
  handleInputs() {
    // with the mouse click bird will flap
    this.input.on("pointerdown", this.flap, this);
    // with the SPACE key the game will pause
    this.input.keyboard.on(
      "keydown_SPACE",
      () => {
        this.isPause = true;
        this.physics.pause();
        this.scene.pause();
        this.scene.launch("PauseScene");
      },
      this
    );
  }

  /**
   * set the resume event for handleing pause mode
   * @returns {void} listen to resume event
   */
  listenToEvents() {
    if (this.pauseEvent) return;
    this.pauseEvent = this.events.on("resume", () => {
      // countdown start on 3
      this.timeCountDown = 3;
      // show countdown on the middle of the screen
      this.textCountDown = this.add
        .text(
          ...this.centerScreen,
          `Start: ${this.timeCountDown}`,
          this.fontOption
        )
        .setOrigin(0.5, 1);
      // loop countdown every 1 second
      this.timedEvent = this.time.addEvent({
        delay: 1000,
        callback: this.countDown,
        callbackScope: this,
        loop: true,
      });
    });
  }

  /**
   * show countdown for restart the game
   * @returns {void} countdown and resume the game
   */
  countDown() {
    this.timeCountDown--;
    this.textCountDown.setText(`Start: ${this.timeCountDown}`);
    if (this.timeCountDown <= 0) {
      this.isPause = false;
      this.textCountDown.setText("");
      this.physics.resume();
      this.timedEvent.remove();
    }
  }

  /**
   * check the bird position near the y boundary screen
   * @returns {void} only check bird in y direction
   */
  boundaryCollideCheck() {
    if (
      this.bird.y <= 0 ||
      this.bird.y >= this.config.height - this.birdScale * this.bird.height
    ) {
      this.gameOver();
    }
  }

  /**
   * calculate the position of pipes object
   * @param {object} uPipe upper pipe object
   * @param {object} lPipe lower pipe object
   * @returns {void} set the pipe group members to the right place
   */
  placePipe(uPipe, lPipe) {
    // find the current difficulty and set the pipes position depend on it
    const difficulty = this.difficulty[this.curretDifficulty];
    // get the last pipe position in X direction
    const rightMostX = this.getLastPipeX();
    // calculate the pipe position in vertical direction randomly
    const pipeVerticalDistance = Phaser.Math.Between(
      ...difficulty.pipeVertivalDistanceRange
    );
    const pipeVerticalPosition = Phaser.Math.Between(
      20,
      this.config.height - 20 - pipeVerticalDistance
    );
    // calculate the pipe position in horizontal direction randomly
    const pipeHorizontalDistance = Phaser.Math.Between(
      ...difficulty.pipeHorizontalDistanceRange
    );

    uPipe.x = rightMostX + pipeHorizontalDistance;
    uPipe.y = pipeVerticalPosition;
    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeVerticalDistance;
  }

  /**
   * flap method of the bird
   * @returns {void} set the bird velocity and move it to the
   * top of the screen if the game is not in pause mode.
   */
  flap() {
    // check the pause mode
    if (this.isPause) return;
    // set the bird velocity and move it to the top of the screen
    this.bird.body.velocity.y = -this.flapVelocity;
  }

  /**
   * recycle the pipes after they arrive to the left side of the screen
   * @returns {void} set the pipe place,increase and save the score,
   * increase difficulty and change background
   */
  recyclePipes() {
    const tempPipe = [];
    this.pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right <= 0) {
        tempPipe.push(pipe);
        if (tempPipe.length === 2) {
          this.placePipe(...tempPipe);
          this.increaseScore();
          this.saveBestScore();
          this.increaseDifficulty();
          this.changeBG();
        }
      }
    });
  }

  /**
   * difficulty of the game with 3 levels (easy|normal|hard)
   * @returns {void} set the current difficulty with the score
   */
  increaseDifficulty() {
    switch (this.score) {
      case 5:
        this.curretDifficulty = "normal";
        break;
      case 15:
        this.curretDifficulty = "hard";
        break;
      default:
        this.curretDifficulty = "easy";
    }
  }

  /**
   * change the background during the game with 3 mode (morning|evening|night)
   * @returns {void} set the background
   */
  changeBG() {
    const timeState = this.score % this.timeBGChange;
    const morningTime = Math.floor(this.timeBGChange / 3);
    // alpha setting between 0 to 1 can change the darkness of the image
    if (timeState < morningTime) {
      this.BG.alpha = 1;
    } else if (timeState >= morningTime && timeState < 2 * morningTime) {
      this.BG.alpha = 0.8;
    } else {
      this.BG.alpha = 0.3;
    }
  }

  /**
   * find the last position of the pipes
   * @returns {Number} the last position of the pipes in X direction
   */
  getLastPipeX() {
    let lastPositionX = 0;
    this.pipes.getChildren().forEach((pipe) => {
      lastPositionX = Math.max(pipe.x, lastPositionX);
    });
    return lastPositionX;
  }

  /**
   * increase the score and show it on the score bar
   * @returns {void} increase the score plus 1.
   */
  increaseScore() {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
  }

  /**
   * compare the score with the best one and save in local storage
   * @returns {void} set the best score
   */
  saveBestScore() {
    // check the bestScore item in local storage of the browser
    const bestScore = !localStorage.getItem("bestScore")
      ? 0
      : localStorage.getItem("bestScore");
    // if the bestScore item in local storage less than
    // the score save it as a best score.
    if (this.score > bestScore) {
      localStorage.setItem("bestScore", this.score);
    }
  }

  /**
   * game over method
   * @returns {void} save the score, change the bird color and restart the game
   */
  gameOver() {
    // decrease the life
    this.lifeStatus("dec");

    // if the life > 0 player can continue the game
    if (this.life > 0) return;

    // if the life <= 0
    if (this.life <= 0) {
      // pause the scene
      this.physics.pause();
      // change the bird color to black
      this.bird.setTint("#fff");
      // compare the score with the best score
      this.saveBestScore();
      // delay 1 second and then restart the game
      this.time.addEvent({
        delay: 1000,
        callback: () => {
          //this.scene.restart();
          this.scene.start("MenuScene");
        },
        loop: false,
      });
    }
  }
}

export default PlayScene;
