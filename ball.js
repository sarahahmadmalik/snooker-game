// Array to store all the pool balls on the table
var poolBalls = []; // Holds the objects representing the pool balls (excluding the cue ball)

// Array to store all the colored balls on the table
var colorballs = []; // Holds the objects representing the colored balls

// Array to store the order in which balls are to be potted (usually based on rules)
var colorOrder = []; // Defines the sequence of balls to be potted in the game (e.g., stripes vs. solids in pool)

// Array to store consecutive balls that are part of a sequence
var consecutiveBalls = []; // Keeps track of balls that must be potted consecutively (if applicable)

// Represents the cue ball in the game
var cueBall; // Object representing the cue ball

// Represents the shot indicator that is drawn when the player aims with the cue stick
var shotIndicator; // Visual indicator (usually a line) that shows the direction of the shot

// Variable to store the player's score
var score = 0; // Keeps track of the player's score during the game

// Represents the applied force for the shot (intensity and direction)
var appliedForce; // The force applied to the cue ball when the player makes a shot

// Holds the previous velocity of the cue ball for tracking its movement and behavior
var cueBallPrevVelocity = { x: 0, y: 0 }; // Stores the cue ball's previous velocity (x and y components)

// Flag indicating whether the cue ball is at rest or still moving
var cueBallRest = false; // Boolean flag indicating whether the cue ball has stopped moving or not

// Flag indicating whether the cue ball has been drawn on the table
var cueBallDrawn = false; // Boolean flag indicating whether the cue ball has been placed on the table

// Index of the next colored ball that will be aimed at
var nextColoredBallIndex = 0; // Keeps track of which colored ball is next in the sequence to be potted

/**
 * Function to draw the "free ball" during cue ball setup mode.
 * This function is responsible for rendering a free ball at the mouse position, which can be moved
 * within specific bounds on the table when the cue ball is being set up.
 * 
 * It performs the following:
 * 1. Draws a white ball (the free ball) at the mouse's position, constrained to a specific area
 *    when `cueBallDrawn` is false.
 * 2. If the cue ball has been drawn (`cueBallDrawn` is true), the free ball follows the mouse position directly.
 */
function drawFreeBall() {
    push();
    fill(255);  // Set the color to white for the free ball

    // If the cue ball has not been drawn yet, constrain the mouse position to certain bounds
    if (!cueBallDrawn) {
        var conMouseX = constrain(mouseX, width / 2 - tableWidth / 3, width / 2 - tableWidth / 4);  // Constrain mouseX within a range
        var conMouseY = constrain(mouseY, height / 2 - tableHeight / 5, height / 2 + tableHeight / 5);  // Constrain mouseY within a range
        ellipse(conMouseX, conMouseY, ballDiameter);  // Draw the free ball at the constrained position
    } else {
        // If the cue ball has been drawn, the free ball follows the mouse position directly
        ellipse(mouseX, mouseY, ballDiameter);  // Draw the free ball directly at the mouse position
    }
    pop();
}

/**
 * Sets up the cue ball on the table at the specified position.
 * This function creates a circular body for the cue ball using the Matter.js physics engine,
 * with properties like restitution, friction, and density defined for realistic ball behavior.
 * The cue ball is added to the world to participate in the simulation.
 * 
 * @param {number} x - The x-coordinate of the cue ball's starting position.
 * @param {number} y - The y-coordinate of the cue ball's starting position.
 */
function setupCueBall(x, y) {
    // Create a circular body for the cue ball with specified properties
    cueBall = Bodies.circle(x, y, ballDiameter / 2, { 
        restitution: 0.8, // Bounciness of the cue ball
        friction: 0.5, // Friction applied to the cue ball
        density: 0.01, // Density affecting the ball's mass
        sleepThreshold: 30 // Threshold for the ball to go to sleep when not moving
    });

    // Add the cue ball to the Matter.js engine's world
    World.add(engine.world, [cueBall]);
}

/**
 * Draws the cue ball on the screen.
 * This function renders the cue ball based on its current position and handles specific 
 * behaviors like resetting its position if it moves too far or checking if it's at rest.
 * It also draws the vertices of the cue ball's physics body using the `drawVertices()` function.
 */
function drawCueBall() {
    push();  // Begin a new drawing state

    fill(255);  // Set the color to white (for the cue ball)

    // If the cue ball has not been drawn yet, draw its vertices
    if (!cueBallDrawn) {
        drawVertices(cueBall.vertices);  // Draw the cue ball using its vertices (from Matter.js)
    }

    // Check if the cue ball needs to be reset (e.g., if it's out of bounds)
    if (checkDistance(cueBall)) {
        resetCueBall();  // Reset the cue ball to its starting position
    }

    // Check if the cue ball is at rest (not moving)
    checkCueballAtRest();

    pop();  // End the drawing state
}

/**
 * Creates a pattern of balls in a triangular arrangement, typically used for setting up the balls in games like pool or snooker.
 * The function generates a list of `p5.Vector` positions representing the balls' locations.
 * 
 * @param {number} rows - The number of rows in the pattern. The number of balls increases with each row.
 * @param {number} x - The x-coordinate of the top-center ball's position.
 * @param {number} y - The y-coordinate of the top-center ball's position.
 * @param {number} r - The radius of each ball, used to calculate the distance between balls.
 * @returns {Array} An array of `p5.Vector` objects, each representing the position of a ball.
 */
function makePattern(rows, x, y, r) {
    let columns = 1; // The number of balls in the current row, starts with 1 and increases for each row.
    const ballsPattern = []; // Array to store the positions of all the balls.

    // Loop through the number of rows to create each row of balls
    for (let i = 0; i < rows; i++) {
        // Create the balls for the current row
        const ballsRow = Array(columns).fill().map((_, colIndex) => 
            createVector(x + (columns - 1) * r * 2, y + (colIndex - columns / 2) * r * 2 + r)
        );

        // Add the balls of the current row to the pattern array
        ballsPattern.push(...ballsRow);

        // Increase the number of balls in the next row
        columns++;
    }

    return ballsPattern; // Return the array of ball positions
}


/**
 * Sets up the pool balls on the table in a triangular pattern.
 * This function uses the `makePattern` function to create a pattern of pool balls and then
 * initializes each pool ball with the specified properties and colors.
 * 
 * @returns {void}
 */
function setupPoolBalls() {
    // The number of rows in the ball pattern
    const ballPatternRows = 5; 
    // The x-coordinate for the starting position of the first ball in the pattern
    const ballPatternX = width / 4 + tableWidth / 1.38; 
    // The y-coordinate for the starting position of the first ball in the pattern
    const ballPatternY = height / 2; 
    // The radius of each ball
    const ballPatternRadius = ballDiameter / 2; 
    
    // Create the pool balls pattern using the makePattern function
    const poolBallsPattern = makePattern(ballPatternRows, ballPatternX, ballPatternY, ballPatternRadius);
    
    // Map the pool balls pattern into PoolBall objects, assigning properties such as color and physics properties
    poolBalls = poolBallsPattern.map(({ x, y }) => 
        new PoolBall(x, y, { restitution: 0.8, friction: 0.5 }, "#FF0000")
    );
}

/**
 * Creates a PoolBall object that represents a ball on the table.
 * The PoolBall object has a `body` property that is a Matter.js physics object,
 * and includes methods for resetting the ball's position and velocity.
 * 
 * @param {number} x - The x-coordinate for the ball's initial position.
 * @param {number} y - The y-coordinate for the ball's initial position.
 * @param {Object} options - Physics properties like restitution, friction, and density.
 * @param {string} color - The color of the pool ball.
 */
function PoolBall(x, y, options, color) {
    // Store the original position of the ball so it can be reset later
    this.originalX = x;
    this.originalY = y;
    
    // The color of the pool ball
    this.color = color;

    // Method to reset the ball's position and velocity
    this.reset = function() {
        Body.setVelocity(this.body, { x: 0, y: 0 });  // Set velocity to zero
        Body.setPosition(this.body, { x: this.originalX, y: this.originalY });  // Reset position to original position
    }

    // Create the ball's body using Matter.js and assign it the given physics properties (restitution, friction, etc.)
    this.body = Bodies.circle(x, y, ballDiameter / 2, options);
    
    // Add the ball's body to the world
    World.add(engine.world, this.body);
}


/**
 * Draws all the pool balls on the table.
 * The function iterates through each ball in the `poolBalls` array, fills it with the appropriate color, 
 * and draws its vertices using the `drawVertices` function. It also checks if any ball should be removed 
 * from the world based on the distance and manages the consecutive balls.
 * 
 * @returns {void}
 */
function drawPoolBalls() {
    push();
    
    // Loop through each pool ball and draw its color and shape
    for (var i = 0; i < poolBalls.length; i++) {
        // Set the fill color of the pool ball
        fill(poolBalls[i].color);
        
        // Draw the ball's vertices (shape) using the drawVertices function
        drawVertices(poolBalls[i].body.vertices);
    }

    // Iterate over pool balls to check for balls that are at rest or removed
    for (var ball of poolBalls) {
        // Check if the distance condition is met for removing the ball
        if (checkDistance(ball.body)) {
            // Add the ball to the consecutive balls array
            consecutiveBalls.push(ball);
            
            // Remove the ball from the world (i.e., stop it from being rendered/affected by physics)
            removeFromWorld(ball);
            
            // Check the consecutive balls to possibly end the game or update score
            checkConsecutiveBalls();
        }
    }
    
    pop();
}

/**
 * Constructor for creating colored ball objects.
 * 
 * @param {number} x - The x-coordinate of the ball's position on the table.
 * @param {number} y - The y-coordinate of the ball's position on the table.
 * @param {number} size - The size (radius) of the ball.
 * @param {Object} options - The physical properties of the ball (Matter.js body options).
 * @param {string} color - The color of the ball (in hexadecimal or color name).
 */
function coloredBalls(x, y, size, options, color) {
    // Create a Matter.js circle body for the ball
    this.body = Bodies.circle(x, y, size, options);
    
    // Assign color to the ball
    this.color = color;

    // Store the initial position to reset the ball later if needed
    this.originalX = x;
    this.originalY = y;

    // Add the ball to the world
    World.add(engine.world, this.body);
}

/**
 * Setup the colored balls on the table.
 * This function creates several colored balls with specific properties (like restitution, friction, and color),
 * and adds them to the `colorballs` array. It also maintains the color order of the balls.
 * 
 * @returns {void}
 */
function setupColoredBalls() {
    // Define the physical properties for the balls
    var options = { restitution: 0.8, friction: 0.5 };

    // Create individual colored balls with specific positions, sizes, and colors
    var greenball = new coloredBalls(width / 2 - tableWidth / 4, height / 2 - 50, ballDiameter / 2, options, "#00FF00");
    var brownball = new coloredBalls(width / 2 - tableWidth / 4, height / 2, ballDiameter / 2, options, "#8B4513");
    var yellowball = new coloredBalls(width / 2 - tableWidth / 4, height / 2 + 50, ballDiameter / 2, options, "#FFFF00");
    var blueball = new coloredBalls(width / 2, height / 2, ballDiameter / 2, options, "#0000FF");
    var pinkball = new coloredBalls(width / 2 + tableWidth / 5, height / 2, ballDiameter / 2, options, "#FFC0CB");
    var blackball = new coloredBalls(width / 2 + tableWidth / 2.5, height / 2, ballDiameter / 2, options, "#000000");

    // Add the colored balls to the colorballs array
    colorballs.push(greenball, brownball, yellowball, blueball, pinkball, blackball);

    // Create an array of colors in the same order as the colorballs array
    colorOrder = colorballs.map(ball => ball.color);
}

/**
 * Draws and updates the colored balls on the table.
 * 
 * This function iterates over each ball in the `colorballs` array, checks for interactions with the pockets, 
 * and updates the game state accordingly. When a ball is pocketed, it is removed from the world, and its 
 * color value is added to the score. Additionally, it handles the behavior of consecutive balls, such as 
 * checking which colored ball should be pocketed next and managing the game flow.
 * 
 * @returns {void}
 */
function drawColoredBalls() {
    // Iterate through all colored balls
    for (var ball of colorballs) {
        // Set the fill color based on the ball's color
        fill(ball.color);

        // Draw the ball's vertices (geometry)
        drawVertices(ball.body.vertices);
        
        // Check if the ball has been pocketed
        if (checkDistance(ball.body)) {
            // If pool balls are pocketed, check if the current ball is the next to be pocketed
            if (poolBalls.length === 0 && ball.color === colorOrder[nextColoredBallIndex]) {
                removeFromWorld(ball); // Remove the ball from the world when pocketed
                if (coloredBalls.length != 0) nextColoredBallIndex++; // Move to the next colored ball
                addColorBallValue(ball.color); // Add the color's value to the score
            } else {
                // If the ball is not pocketed correctly, reset it to its original position
                resetPocketedBall(ball);
                consecutiveBalls.push(ball); // Add the ball to the consecutive balls array
                checkConsecutiveBalls(); // Check and update the consecutive balls
            }
        }
    }
}

/**
 * Resets the cue ball position and stops its movement when needed.
 * 
 * This function resets the cue ball's velocity to zero and allows the player to reposition the ball.
 * If the mouse is pressed, the cue ball is moved to the mouse's position, allowing the player to 
 * freely place it before taking the next shot.
 * 
 * @returns {void}
 */
function resetCueBall() {
    // Set the cue ball's velocity to zero
    Body.setVelocity(cueBall, { x: 0, y: 0 });
    
    // Mark that the cue ball has been drawn
    cueBallDrawn = true;
    
    // Draw the free ball (allowing the player to place the cue ball)
    drawFreeBall();
    
    // If the mouse is pressed, set the cue ball's position to the mouse's location
    if (mouseIsPressed) {
        cueBallDrawn = false;
        Body.setPosition(cueBall, { x: mouseX, y: mouseY }); 
    }
}

/**
 * Resets all pool balls to their original positions and stops their movement.
 * 
 * This function iterates over all pool balls in the `poolBalls` array and calls the `reset()` method 
 * for each ball. This effectively resets their positions and stops their velocity, bringing them 
 * back to the starting position.
 * 
 * @returns {void}
 */
function resetPoolBalls() {
    // Iterate over each pool ball and reset its state
    for (var ball of poolBalls) {
        ball.reset(); // Reset ball position and velocity
    }
}

/**
 * Resets all colored balls to their original positions and stops their movement.
 * 
 * This function iterates over all colored balls in the `colorballs` array and resets their 
 * positions to their original positions by setting their velocity to zero.
 * 
 * @returns {void}
 */
function resetColorballs(ball) {
    // Iterate over each colored ball and reset its state
    for (var ball of colorballs) {
        // Reset velocity and position of the ball
        Body.setVelocity(ball.body, { x: 0, y: 0 });
        Body.setPosition(ball.body, { x: ball.originalX, y: ball.originalY });
    }
}

/**
 * Resets the position and stops the movement of a specific pocketed ball.
 * 
 * This function resets the velocity and position of a ball that has been pocketed, 
 * returning it to its original position on the table.
 * 
 * @param {Object} ball - The ball to be reset (either from pool balls or colored balls).
 * @returns {void}
 */
function resetPocketedBall(ball) {
    // Reset the velocity and position of the specific pocketed ball
    Body.setVelocity(ball.body, { x: 0, y: 0 });
    Body.setPosition(ball.body, { x: ball.originalX, y: ball.originalY });
}

/**
 * Checks whether a given ball has entered a pocket by comparing its distance to the pockets.
 * 
 * This function calculates the distance between the ball's position and each pocket's position. 
 * If the ball is within a certain distance (19 pixels), it is considered pocketed.
 * The function handles two game states: the standard `gameState` and the `ovalgameState`, 
 * where the latter uses a different set of pockets (ovalHoles).
 * 
 * @param {Object} ball - The ball to check for pocketing. The ball object must have a `position` property.
 * @returns {boolean} - `true` if the ball is pocketed (i.e., its distance from any hole is less than 19), 
 *                      otherwise `false`.
 */
function checkDistance(ball) {
    // If the game state is in the standard mode
    if(gameState) {
        var pos = ball.position; // Get the ball's position

        // Iterate through all holes in the table (standard pockets)
        for (var i = 0; i < holes.length; i++) {
            var hole = holes[i]; // Get each hole's position
            // Calculate the distance between the ball and the hole
            var distance = Matter.Vector.magnitude({
                x: pos.x - hole.x,
                y: pos.y - hole.y
            });

            // If the distance is less than 19, the ball is considered pocketed
            if (distance < 19) {
                return true;
            }
        }
        return false; // Return false if the ball is not pocketed
    } 
    // If the game state is in oval mode
    else if(ovalgameState) {
        var pos = ball.position; // Get the ball's position

        // Iterate through all holes in the oval game (oval-shaped pockets)
        for (var i = 0; i < ovalHoles.length; i++) {
            var hole = ovalHoles[i]; // Get each oval hole's position
            // Calculate the distance between the ball and the hole
            var distance = Matter.Vector.magnitude({
                x: pos.x - hole.x,
                y: pos.y - hole.y
            });

            // If the distance is less than 19, the ball is considered pocketed
            if (distance < 19) {
                return true;
            }
        }
        return false; // Return false if the ball is not pocketed
    }
}

/**
 * Removes a ball from the world and updates relevant arrays and the score.
 * 
 * This function removes the given ball from the physics world (engine.world), 
 * removes the ball from the `poolBalls` and `colorballs` arrays if present, 
 * and increments the score.
 * 
 * @param {Object} ball - The ball to remove. The ball object must have a `body` property to be removed from the world.
 */
function removeFromWorld(ball) {
    // Remove the ball from the physics world
    World.remove(engine.world, ball.body);

    // Remove the ball from the poolBalls array if it exists
    var index = poolBalls.indexOf(ball);
    if (index !== -1) {
        poolBalls.splice(index, 1); // Remove the ball from the array
        score++; // Increment the score
    }

    // Remove the ball from the colorballs array if it exists
    var index2 = colorballs.indexOf(ball);
    if (index2 !== -1) {
        colorballs.splice(index2, 1); // Remove the ball from the array
    }
}
/**
 * Randomizes the position of each pool ball within a defined area on the table.
 * 
 * This function iterates over all the balls in the `poolBalls` array and assigns them
 * a new random position within a specified rectangular area defined by the table’s width and height.
 * The random positions ensure that each pool ball is placed in a different spot on the table within the defined bounds.
 */
function randomisePoolballs() {
    // Defining the minimum and maximum X and Y coordinates for the random placement
    const minX = width / 2 - tableWidth / 2.5;
    const minY = height / 2 - tableHeight / 2.5;
    const maxX = width / 2 + tableWidth / 2.5;
    const maxY = height / 2 + tableHeight / 2.5;

    // Iterate over each pool ball and set a random position within the specified bounds
    for (var ball of poolBalls) {
        // Generate random X and Y coordinates within the defined range
        const randomX = random(minX, maxX);
        const randomY = random(minY, maxY);

        // Set the ball’s new position
        Body.setPosition(ball.body, { x: randomX, y: randomY });
    }
}

/**
 * Randomizes the position of each colored ball within a defined area on the table.
 * 
 * This function iterates over all the balls in the `colorballs` array and assigns them
 * a new random position within a specified rectangular area defined by the table’s width and height.
 * The random positions ensure that each colored ball is placed in a different spot on the table within the defined bounds.
 */
function randomiseColoredBalls() {
    // Defining the minimum and maximum X and Y coordinates for the random placement
    const minX = width / 2 - tableWidth / 2.5;
    const minY = height / 2 - tableHeight / 2.5;
    const maxX = width / 2 + tableWidth / 2.5;
    const maxY = height / 2 + tableHeight / 2.5;

    // Iterate over each colored ball and set a random position within the specified bounds
    for (var ball of colorballs) {
        // Generate random X and Y coordinates within the defined range
        const randomX = random(minX, maxX);
        const randomY = random(minY, maxY);

        // Set the ball’s new position
        Body.setPosition(ball.body, { x: randomX, y: randomY });
    }
}

/**
 * Checks whether the cue ball has come to rest (i.e., its velocity is below a certain threshold).
 * 
 * This function monitors the cue ball's velocity to determine if it has stopped moving. 
 * If the velocity is below a threshold value, it updates a global variable `cueBallRest` to `true`
 * and displays a "Click to Play" message. If the velocity is above the threshold, it sets `cueBallRest` to `false`.
 */
function checkCueballAtRest() {
    // Get the current velocity of the cue ball
    const velocity = cueBall.velocity;

    // Set a threshold for the velocity to determine if the ball has stopped
    const threshold = 0.1; 

    // Check if the velocity is below the threshold for both x and y components
    if (abs(velocity.x) < threshold && abs(velocity.y) < threshold) {
        stroke("red");
        textSize(24);
        // Display "Click to Play" message when the ball is at rest
        text("Click to Play", width / 2 - 45, height - 50);
        cueBallRest = true; // Cue ball is at rest
    } else {
        cueBallRest = false; // Cue ball is still moving
    }

    // Store the current velocity for comparison in the next call
    cueBallPrevVelocity = { x: velocity.x, y: velocity.y };
}

/**
 * Constrains a value to be within a specified range.
 * 
 * This function ensures that a given value stays within a defined minimum and maximum range.
 * If the value is below the minimum, it returns the minimum. If the value is above the maximum, it returns the maximum.
 * Otherwise, it returns the value itself.
 * 
 * @param {number} value - The value to be constrained.
 * @param {number} min - The minimum value allowed.
 * @param {number} max - The maximum value allowed.
 * @returns {number} - The constrained value within the range [min, max].
 */
function constrain(value, min, max) {
    // Return the value constrained between min and max
    return Math.min(Math.max(value, min), max);
}


/**
 * Draws the next ball's color and displays the label "Next Ball" on the game table.
 * 
 * This function visually indicates which colored ball is the next one in the game. It shows the label "Next Ball" 
 * and a circle representing the color of the next ball to be played, based on the `colorOrder` array and the 
 * `nextColoredBallIndex` variable.
 */
function drawBallOrder() {
    push(); // Start a new drawing state

    // Set the fill color to the next ball's color in the color order
    fill(colorOrder[nextColoredBallIndex]);

    // Set text size for the "Next Ball" label
    textSize(20);

    // Draw the label and the colored circle representing the next ball
    text("Next Ball: ", width / 2 + tableWidth / 4, 75);
    ellipse(width / 2 + tableWidth / 2.4, 68, ballDiameter, ballDiameter);

    pop(); // Restore the previous drawing state
}

/**
 * Checks if two consecutive balls have been pocketed and applies scoring penalties.
 * 
 * This function evaluates the `consecutiveBalls` array to see if there are consecutive balls of the same color
 * or two red balls in a row. If there are two color balls (not red) in a row or two red balls in a row, it applies 
 * a penalty and removes those balls from the `consecutiveBalls` array.
 * 
 * Penalties:
 * - If two color balls (other than red) are consecutive, the player loses 1 point.
 * - If two red balls are consecutive, the player loses 2 points.
 */
function checkConsecutiveBalls() {
    // Loop through the consecutive balls to check for rule violations
    for (let i = 0; i < consecutiveBalls.length - 1; i++) {
        const currentBall = consecutiveBalls[i]; // The current ball in the sequence
        const nextBall = consecutiveBalls[i + 1]; // The next ball in the sequence

        if (poolBalls.length != 0) {
            // Check for two non-red balls in a row
            if (currentBall.color != "#FF0000" && nextBall.color != "#FF0000") {
                alert("Two color balls in a row and minus point");
                console.log("Consecutive balls with colors:", currentBall.color, "and", nextBall.color);

                // Remove both balls from consecutive balls and apply penalty
                consecutiveBalls.splice(i, 2);
                i--; // Adjust the index after removal
                score -= 1; // Apply penalty of -1 point
            } 
            // Check for two red balls in a row
            else if (currentBall.color == "#FF0000" && nextBall.color == "#FF0000") {
                alert("Two red balls in a row and minus point");
                
                // Remove both red balls from consecutive balls and apply penalty
                consecutiveBalls.splice(i, 2);
                i--; // Adjust the index after removal
                score -= 2; // Apply penalty of -2 points
            }
        }
    }
}

/**
 * Adds score based on the color of the ball pocketed.
 * 
 * This function takes in the color of a pocketed ball and adds an appropriate amount of points to the player's score 
 * based on the color. The color is represented by its hexadecimal value.
 * 
 * Scoring:
 * - Green ball (#00FF00) = +2 points
 * - Brown ball (#8B4513) = +3 points
 * - Yellow ball (#FFFF00) = +4 points
 * - Blue ball (#0000FF) = +5 points
 * - Pink ball (#FFC0CB) = +6 points
 * - Black ball (#000000) = +7 points
 * 
 * @param {string} color - The color of the pocketed ball in hexadecimal format.
 */
function addColorBallValue(color) {
    switch (color) {
        case "#00FF00": // Green ball
            score += 2;
            break;
        case "#8B4513": // Brown ball
            score += 3;
            break;
        case "#FFFF00": // Yellow ball
            score += 4;
            break;
        case "#0000FF": // Blue ball
            score += 5;
            break;
        case "#FFC0CB": // Pink ball
            score += 6;
            break;
        case "#000000": // Black ball
            score += 7;
            break;
    }
}


function mouseDragged(){}