/**
 * Function to initialize the snooker game world.
 * This function calls multiple setup functions to initialize all the components of the game.
 * 
 * It performs the following:
 * 1. Calculates the table size.
 * 2. Sets up the table.
 * 3. Sets up the pockets.
 * 4. Sets up the pool balls.
 * 5. Sets up the cue ball.
 * 6. Sets up the colored balls.
 */
function setupSnookerWorld() {
    calculateTablesize();        // Calculate the size of the snooker table
    setupTable();                // Setup the table (layout and appearance)
    setupPocket();               // Setup the pockets on the table
    setupPoolBalls();            // Setup the pool balls
    setupCueBall();              // Setup the cue ball
    setupColoredBalls();         // Setup the colored balls
}

/**
 * Function to draw the snooker world on the screen.
 * This function is called every frame to continuously update the game world.
 * 
 * It performs the following:
 * 1. Clears the screen with a black background.
 * 2. Updates the physics engine (using `Engine.update()`).
 * 3. Draws the table, cue ball, pool balls, and colored balls.
 * 4. Draws the HUD (scoreboard, instructions, etc.).
 * 5. Draws the energy bar (for shot force).
 * 6. Checks for collisions between balls and updates the game state.
 * 7. Optionally displays rules, menu, cue stick, and shot indicators based on user actions.
 * 8. Displays the ball order if no pool balls are remaining.
 * 9. Ends the game if all pool and colored balls are potted.
 */
function drawSnookerWorld() {
    background(0, 0, 0);  // Set the background to black
    Engine.update(engine); // Update the physics engine (Matter.js)

    // Draw the game elements
    drawTable();           // Draw the snooker table
    drawCueBall();         // Draw the cue ball
    drawPoolBalls();       // Draw the pool balls
    drawColoredBalls();    // Draw the colored balls
    drawHUD();             // Draw the heads-up display (score, instructions, etc.)
    drawEnergyBar();       // Draw the energy bar (force applied to the shot)
    collisionDetection();  // Check for collisions between cue ball and other objects

    // Show free ball setup if applicable
    if (cueBallSetupMode) drawFreeBall(); 

    // Optionally show the rules or menu images
    if (drawRules) image(rules, tableWidth / 2 + 50, 20, 500, 500);
    if (drawMenu) background(menu);

    // Show shot indicators when mouse is pressed
    if (mouseIsPressed) {
        drawCueStick();      // Draw the cue stick
        drawShotIndicator(); // Draw the shot indicator line
    }
    
    // Show ball order if no pool balls remain
    if (poolBalls.length == 0) drawBallOrder();

    // End the game if all pool and colored balls are potted
    if (poolBalls.length == 0 && colorballs.length == 0) {
        gameOver();  // Display the game over message
    }
}


