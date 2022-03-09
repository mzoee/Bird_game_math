# Bird game: multiplication practice

# Jeux Video-2D

This is a Repository for a game named "bird game": multiplication practice for course "2D jeux Video" at UNIL.

By: Maryam Sadat Zoee

Supervisor: Isaac Panthé

## Introduction

This repository is for a 2-D Video game called "Bird Game": multiplication practice that is written in JavaScript using Phaser3. 

This game has some features as below:

* At the beginning of the game, after running the code, the Menu is shown on the screen. It contains *play*, *score*, *setting*, *exit*. 

* By clicking on "Setting", the player can choose the screen resolution and the background image. 

* By clicking on "Play", another page is appeared on the screen that the player should select the number he/she wants to practice for.

* The bird should fly among the pipes and the "Fruits" which randomly appear in the way of the bird.

* Each "Fruit" has a random number on it. Therefore, the aim of this game for the user is to eat the fruit that has a correct number (a correct multiplication of the number selcted at the beginning of the game). Five different fruits appear on the way of the bird: banana, apple, lemon, grape & pear. 

* The bird is given three *hearts* at the beginning of the game, So after 3 collision of the bird with the pipes or eating the wrong fruit, the game ends.

* Each time that the bird eats the correct fruit, the player gains score and one heart.

* The game has three difficulty levels: "Simple", "Normal" and "Hard". After gaining specific score and by passing the time, the level is automatically changed. Therefore, the pipes will get closer and the fruits will appear more in the path of the bird.

* The "Best Score" is saved for the game and is shown on the left side of the screen under the score.

* The light of the background screen will change during the game, from morning to evening and to night. This means that the time passes with the bird flies.


## The code

* As mentioned, the game is written in JS. The files uploaded include a folder named assets which contains all the images used in this game and src which contains all the scene codes in .js format.



## How to run

* To run the game, after you download the whole files and unzip them, open it in VisualStudio. First, you should install the modules using the command *npm i* and secondly, you may use the command *npm run start* to run the code. 
