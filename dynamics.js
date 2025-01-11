/**
 * Variables for energy bar:
 * maxForceMagnitude (number): The maximum possible force applied to the cue ball.
 * energyBarHeight (number): The height of the energy bar representing the force magnitude.
 */
var maxForceMagnitude = 500;  // Maximum force magnitude that can be applied
var energyBarHeight = 250;    // Height of the energy bar (used for scaling the force magnitude)

/**
 * Draws the energy bar on the screen, which represents the force magnitude 
 * applied to the cue ball based on the mouse's position.
 * The bar shows an increasing color intensity as the energy increases.
 */
function drawEnergyBar() {
    push();

    // Calculate the force magnitude as the distance between the cue ball and mouse position
    var forceMagnitude = Math.sqrt((cueBall.position.x - mouseX) ** 2 + (cueBall.position.y - mouseY) ** 2);

    // Calculate the energy percentage based on the force magnitude
    var energyPercentage = forceMagnitude / maxForceMagnitude;

    // Draw the background of the energy bar
    fill(50);  // Set background color to dark gray
    rect(width / 2 + 430, height / 2 - 120, 20, energyBarHeight);  // Draw the bar

    // If the mouse is pressed and dragged, update the energy bar
    if (mouseIsPressed && mouseDragged) {
        fill("#FF4500");  // Set the fill color to orange for the active energy bar
        energyPercentage = constrain(energyPercentage, 0, 1);  // Constrain the energy percentage to 0-1

        // Draw the updated energy bar based on the energy percentage
        rect(width / 2 + 430, height / 2 - 120 + (1 - energyPercentage) * energyBarHeight, 20, energyBarHeight * energyPercentage);
    }

    pop();
}


/**
 * Function to draw the HUD (Heads-Up Display) elements on the screen,
 * including the score, menu instructions, and mode change instructions.
 */
function drawHUD() {
    push();
  
    // Draw the background rectangle for the score display
    fill(225, 0, 205, 50);  
    rectMode(CENTER);       
    rect(width / 2, height / 2 - tableHeight / 1.3, 600, 50); 
  
    textAlign(LEFT, CENTER); 
    textSize(18);            
    fill(255);               
    text("Score: " + score, width / 2 - tableWidth / 2.2, height / 2 - 220); 
  
    textAlign(RIGHT, CENTER); 
    textSize(16);             
    text("Press 5 for menu", width / 2 + tableWidth / 2.2, height / 2 - 220);  
  
    // Instructions Text with background
    textSize(12);           
    fill(255);                
    textAlign(LEFT, LEFT);    
  
    // Calculate the width of the rectangle based on the longest text line
    const textWidth1 = textWidth("Press to change game mode:");
    const textWidth2 = textWidth("1. Normal Snooker Game");
    const textWidth3 = textWidth("2. Red Balls are random");
    const textWidth4 = textWidth("3. Every ball is random");
  
    // Determine the width of the rectangle based on the longest line of text + padding
    const rectWidth = max(textWidth1, textWidth2, textWidth3, textWidth4) + 60;
  
    fill('#C5796D');  
    stroke(255);     
    strokeWeight(2);  
    rect(width / 3, height - 70, rectWidth, 100);  // Draw the instructions rectangle
  
    noStroke(); 
    fill(255);   
    text("Press to change game mode:", width / 4, height - 100); 
    text("1. Normal Snooker Game", width / 4, height - 70);       
    text("2. Red Balls are random", width / 4, height - 50);        
    text("3. Every ball is random", width / 4, height - 30);       
  
    pop();
  }
  

/**
 * Resets the pool balls and color balls to their initial positions for the normal snooker game mode.
 */
function modeOne() {
    resetPoolBalls();     // Resets the pool balls to their initial positions.
    resetColorballs();    // Resets the color balls to their initial positions.
}

/**
 * Randomizes the positions of the colored balls and pool balls for the game.
 * This mode alters the initial setup of the game to create a different challenge.
 */
function modeTwo() {
    randomiseColoredBalls();  // Randomizes the positions of the color balls.
    randomisePoolballs();     // Randomizes the positions of the pool balls.
}

/**
 * Resets the color balls to their initial positions and randomizes the positions of the pool balls.
 * This mode keeps the pool balls randomized but ensures color balls are placed back to the start.
 */
function modeThree() {
    resetColorballs();   // Resets the color balls to their initial positions.
    randomisePoolballs(); // Randomizes the positions of the pool balls.
}



/**
 * Draws a polygon by connecting the provided vertices in the order they are given.
 * The vertices are assumed to be in an array of p5.js `createVector` objects.
 * 
 * @param {Array} vertices - An array of `createVector` objects representing the points of the polygon.
 */
function drawVertices(vertices) {
    // Start drawing the shape
    beginShape();
    
    // Loop through the vertices array to plot each vertex
    for (var i = 0; i < vertices.length; i++) {
        // Define each vertex point
        vertex(vertices[i].x, vertices[i].y);
    }
    
    // Close the shape and connect the last point to the first
    endShape(CLOSE);
}


/**
 * Draws an indicator line from the cue ball towards the mouse position,
 * representing the direction and strength of the upcoming shot.
 */
function drawShotIndicator() {
    push();
    
    // Set stroke weight for the line to be drawn
    strokeWeight(5);
    
    // Calculate the direction vector from the cue ball to the mouse position
    const directionVector = createVector(cueBall.position.x - mouseX, cueBall.position.y - mouseY);
    
    // Calculate the endpoint of the line (second line end) based on the direction vector
    const secondLineEndX = cueBall.position.x + directionVector.x;
    const secondLineEndY = cueBall.position.y + directionVector.y;
    
    // Set stroke weight and color for the final shot indicator line
    strokeWeight(2);  // Reduces stroke weight for the actual line
    stroke(255);      // Set color to white for the line
    
    // Draw the line from the cue ball to the calculated endpoint
    line(cueBall.position.x, cueBall.position.y, secondLineEndX, secondLineEndY);
    
    pop();
}

/**
 * Detects collisions between the cue ball and various objects in the pool game,
 * including pool balls, color balls, and cushion walls.
 * The function checks for collisions using the Matter.js physics engine.
 * 
 * For each object type, it logs the index of the object with which the cue ball collides.
 */
function collisionDetection() {
    // Check collisions between cue ball and pool balls
    for (var i = 0; i < poolBalls.length; i++) {
        // Check if the cue ball collides with the current pool ball
        var collisionWithPoolBall = Matter.Query.collides(cueBall, [poolBalls[i].body]);
        if (collisionWithPoolBall.length > 0) {
            console.log("Collided with pool ball at index " + i);
        }
    }

    // Check collisions between cue ball and color balls
    for (var i = 0; i < colorballs.length; i++) {
        // Check if the cue ball collides with the current color ball
        var collisionWithColorBall = Matter.Query.collides(cueBall, [colorballs[i].body]);
        if (collisionWithColorBall.length > 0) {
            console.log("Collided with color ball at index " + i);
        }
    }

    // Check collisions between cue ball and cushion walls
    for (var i = 0; i < cushionWalls.length; i++) {
        // Check if the cue ball collides with the current cushion wall
        var collisionWithCushionWall = Matter.Query.collides(cueBall, [cushionWalls[i]]);
        if (collisionWithCushionWall.length > 0) {
            console.log("Collided with cushion wall at index " + i);
        }
    }
}

/**
 * Displays a "Game Over" message at the center of the screen and stops the game music.
 * This function is called when the game ends.
 */
function gameOver() {
    push();
    
    // Set the text properties for the "Game Over" message
    textSize(36);  // Set the text size to 36 pixels
    fill("red");   // Set the text color to red
    stroke("yellow");  // Set the stroke (outline) color to yellow

    // Display the "Game Over" message at the center of the screen
    text("Game Over", width / 2 - 100, height / 2);

    gameMusic.stop();
    
    pop();
}

/**
 * Stops the specified sound from playing.
 * 
 * @param {p5.SoundFile} sound - The sound object to be stopped.
 * This function can be used to stop any sound, such as background music or sound effects.
 */
function stopMusic(sound) {
    sound.stop();  
}
