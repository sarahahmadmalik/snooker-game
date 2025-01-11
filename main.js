/**
 * Matter.js physics engine variables and setup for the pool game.
 */
var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Composites = Matter.Composites;
var Body = Matter.Body;
var Constraint = Matter.Constraint;
var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;

/**
 * Game state variables for tracking different states within the game.
 * - `engine`: The physics engine.
 * - `menu`: The menu screen image.
 * - `rules`: The rules screen image.
 * - `gameState`: Boolean to track if the game is running or paused.
 * - `drawRules`: Boolean to manage if the rules screen should be shown.
 * - `drawMenu`: Boolean to manage if the main menu screen should be shown.
 * - `cueBallSetupMode`: Boolean to track if the cue ball is being set up.
 */
var engine;
var menu;
var rules;
var gameState = false;
var drawRules = false;
var drawMenu = false;
var cueBallSetupMode = true;

/**
 * Preload assets for the game.
 *
 * This function loads images, sound files, and other media resources required
 * for the game, ensuring they are available before the game starts.
 */
function preload() {
  // Loading images for start screen, menu screen, and rules screen
  start = loadImage("assets/start.png");
  menu = loadImage("assets/menu.png");
  rules = loadImage("assets/rules.png");

  // Loading sound files for game events and actions
  gameMusic = loadSound("assets/game-music.mp3");
  strike = loadSound("assets/strike.wav");
  explosion = loadSound("assets/explosion.mp3");
}

/**
 * Setup function that initializes the game canvas and the Matter.js physics engine.
 *
 * - Creates a canvas of size 1200x600 pixels for rendering the game.
 * - Initializes the Matter.js physics engine.
 * - Sets the gravity in the physics engine to 0 in the y-direction (no gravity effect).
 * - Sets the game state to `true` indicating the game is running.
 * - Calls the `setupSnookerWorld()` function to initialize the snooker world setup (table, balls, etc.).
 */
function setup() {
  // Create the game canvas with specified dimensions
  canvas = createCanvas(1200, 600);

  // Initialize the Matter.js physics engine
  engine = Engine.create();

  // Set gravity to 0 in the y-direction (no gravity effect on objects)
  engine.world.gravity.y = 0;

  // Set the game state to true, indicating the game is active
  gameState = true;

  // Call the setup function for the snooker world (this would set up the table, balls, etc.)
  setupSnookerWorld();
}

/**
 * Draw function that continuously renders the game world.
 *
 * This function is called in every frame to draw the snooker world if the game state is true.
 * It manages the rendering of the snooker table and other game elements.
 */
function draw() {
  // Check if the game state is true, indicating the game is ongoing
  if (gameState) {
    // Call the function to draw the snooker world (table, balls, etc.)
    drawSnookerWorld();
  }
}

/**
 * keyPressed function that handles key press events in the game.
 *
 * This function is called whenever a key is pressed. It manages different key inputs to trigger
 * game modes, toggle UI elements (rules and menu), and control the left/right movement.
 */
function keyPressed() {
  // Switch statement to handle different keys
  switch (key) {
    case "1":
      // Switch to game mode 1 when the "1" key is pressed
      modeOne();
      break;
    case "2":
      // Switch to game mode 2 when the "2" key is pressed
      modeTwo();
      break;
    case "3":
      // Switch to game mode 3 when the "3" key is pressed
      modeThree();
      break;
    case "4":
      // Toggle the visibility of the rules when the "4" key is pressed
      drawRules = !drawRules;
      break;
    case "5":
      // Toggle the visibility of the menu when the "5" key is pressed
      drawMenu = !drawMenu;
      break;
  }

  // Handle left/right movement when "a" or "A" and "d" or "D" are pressed
  if (key === "a" || key === "A") {
    // Set left movement to true when "a" or "A" is pressed
    isLeft = true;
  } else if (key === "d" || key === "D") {
    // Set right movement to true when "d" or "D" is pressed
    isRight = true;
  }
}

/**
 * keyReleased function that handles key release events in the game.
 *
 * This function is called whenever a key is released. It stops the movement when "a" or "d" keys
 * are released, providing control over movement actions.
 */
function keyReleased() {
  // Stop left movement when "a" or "A" is released
  if (key === "a" || key === "A") {
    isLeft = false;
  }
  // Stop right movement when "d" or "D" is released
  else if (key === "d" || key === "D") {
    isRight = false;
  }
}

/**
 * mousePressed function that handles mouse press events in the game.
 *
 * This function is called when the mouse is pressed. It manages actions like setting up the cue ball
 * in cue ball setup mode, drawing the cue stick for the player, and initiating the cue ball's setup and
 * stroke behavior based on the mouse's position.
 */
function mousePressed() {
  // Check if the game is in progress (gameState is true)
  if (gameState) {
    // Constrain mouse position within specific ranges to set up the cue ball
    var conMouseX = constrain(
      mouseX,
      width / 2 - tableWidth / 3,
      width / 2 - tableWidth / 4
    );
    var conMouseY = constrain(
      mouseY,
      height / 2 - tableHeight / 5,
      height / 2 + tableHeight / 5
    );

    // If cue ball setup mode is active, place the cue ball at the constrained mouse position
    if (cueBallSetupMode) {
      setupCueBall(conMouseX, conMouseY);
    }

    // Set cue ball setup mode to false after setup
    cueBallSetupMode = false;

    // If the cue stick hasn't been drawn yet, animate it
    if (!cueStickDrawn) {
      cueStickDrawn = true;
      animateCueStick();
    }

    // Reset cue stick drawn state to false after animation
    cueStickDrawn = false;
  }
}

/**
 * mouseReleased function that handles mouse release events in the game.
 *
 * This function is called when the mouse is released. It applies a force to the cue ball based on the
 * mouse's position relative to the cue ball when the shot is taken.
 */
function mouseReleased() {
  // Check if the game is in progress (gameState is true)
  if (gameState) {
    // Define the force of the shot
    var force = 2500;

    // Calculate the force direction based on the difference between the cue ball's position and the mouse's position
    var forceX = (cueBall.position.x - mouseX) / force;
    var forceY = (cueBall.position.y - mouseY) / force;

    // If the cue ball is at rest or hasn't moved yet, apply force to it to initiate the shot
    if (
      cueBallRest ||
      (cueBallPrevVelocity.x === 0 && cueBallPrevVelocity.y === 0)
    ) {
      // Play the strike sound effect when the shot is made
      strike.play();

      // Apply the calculated force to the cue ball
      Body.applyForce(
        cueBall,
        { x: cueBall.position.x, y: cueBall.position.y },
        { x: forceX, y: forceY }
      );
    }
  }
}