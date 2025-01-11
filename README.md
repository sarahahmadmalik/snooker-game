# Snooker Game

This project is a snooker game simulation built using JavaScript, p5.js, and Matter.js. The game includes realistic physics for ball movement and collision detection, as well as a user interface for interacting with the game.

## Table of Contents

- Installation
- Usage
- Game Features
- File Structure
- Description of Files

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/your-username/snooker-game.git
    ```plaintext

2. Navigate to the project directory:

    ```sh
    cd snooker-game
    ```plaintext

3. Open [`index.html`](index.html ) in your web browser to start the game.

## Usage

- Use the mouse to position the cue ball during setup.
- Click and drag the mouse to aim and adjust the force of your shot.
- Release the mouse button to take the shot.
- Use the number keys (1, 2, 3) to switch between different game modes.
- Press `4` to toggle the rules screen.
- Press `5` to toggle the menu screen.

## Game Features

- **Realistic Physics**: The game uses Matter.js for realistic ball movement and collision detection.
- **Cue Stick Animation**: The cue stick lengthens smoothly when preparing for a shot.
- **Energy Bar**: Displays the force applied to the cue ball based on the mouse position.
- **HUD**: Displays the score, game mode instructions, and other information.
- **Multiple Game Modes**: Includes different game modes for varied gameplay experiences.

## File Structure

    ```
        snooker-game/
        ├── assets/
        │   ├── start.png
        │   ├── menu.png
        │   ├── rules.png
        │   ├── game-music.mp3
        │   ├── strike.wav
        │   └── explosion.mp3
        ├── libraries/
        │   ├── matter.js
        │   ├── p5.js
        │   ├── p5.min.js
        │   └── p5.sound.min.js
        ├── arena.js
        ├── ball.js
        ├── cue.js
        ├── dynamics.js
        ├── index.html
        ├── main.js
        └── table.js
    ```

### Description of Files

- **index.html**: The main HTML file that includes all the necessary scripts and styles.
- **arena.js**: Contains functions to initialize and draw the snooker game world.
- **ball.js**: Manages the pool and colored balls, including their setup, drawing, and collision detection.
- **cue.js**: Handles the drawing and animation of the cue stick.
- **dynamics.js**: Includes functions for drawing the energy bar, HUD, and handling game modes.
- **main.js**: Initializes the game, loads assets, and manages user input.
- **table.js**: Defines the table setup, including walls, cushions, and pockets.
