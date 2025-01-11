// Variables to define the table and balls properties
var tableWidth, tableHeight, ballDiameter, pocketSize;
var tableWalls = []; // Array to store table wall bodies
var cushionWalls = []; // Array to store cushion wall bodies
var holes; // Array to store pocket hole positions

/**
 * Function to calculate the table size based on a fixed width.
 * It sets the global variables for the table's dimensions and ball size.
 *
 * @description
 * - `tableWidth` is set to a fixed value of 600.
 * - `tableHeight` is set to half the table width, ensuring a 2:1 aspect ratio.
 * - `ballDiameter` is calculated as one-thirty-sixth of the table width.
 * - `pocketSize` is set to 1.5 times the ball diameter to define the size of the pockets.
 */
function calculateTablesize() {
  // Set the table width to a fixed value
  tableWidth = 600;

  // Set the table height to half of the table width for a 2:1 aspect ratio
  tableHeight = tableWidth / 2;

  // Calculate the ball diameter as one-thirty-sixth of the table width
  ballDiameter = tableWidth / 36;

  // Set the pocket size to 1.5 times the ball diameter
  pocketSize = 1.5 * ballDiameter;
}

/**
 * Constructor function to create a table wall.
 * This function creates a rectangular body using Matter.js and adds it to the world.
 *
 * @param {number} x - The x-coordinate of the center of the wall.
 * @param {number} y - The y-coordinate of the center of the wall.
 * @param {number} w - The width of the wall.
 * @param {number} h - The height of the wall.
 * @param {Object} options - Matter.js body options (e.g., density, friction, etc.).
 *
 * @description
 * - Creates a rectangular body representing the wall and adds it to the physics world.
 */
function tableWall(x, y, w, h, options) {
  // Create the rectangular body for the table wall
  this.body = Bodies.rectangle(x, y, w, h, options);

  // Add the wall body to the Matter.js world
  World.add(engine.world, this.body);
}
/**
 * Function to setup the table with walls, cushion walls, and other elements.
 *
 * @description
 * - This function creates the table's boundary walls and adds them to the world.
 * - It also creates the cushion walls (trapezoidal shapes) for the table's sides.
 * - The walls and cushion walls are then added to the `World` in the Matter.js physics engine.
 */
function setupTable() {
  var options = { isStatic: true }; // Options for static bodies (non-moving)

  // Create the 4 walls of the table (left, right, top, bottom)
  var wall1 = new tableWall(
    width / 2 - tableWidth / 4,
    height / 2 - tableHeight / 2,
    tableWidth / 2 - 25,
    tableHeight / 18,
    options
  );
  var wall2 = new tableWall(
    width / 2 - tableWidth / 4,
    height / 2 + tableHeight / 2,
    tableWidth / 2 - 25,
    tableHeight / 18,
    options
  );
  var wall3 = new tableWall(
    width / 2 - tableWidth / 2,
    height / 2,
    tableHeight / 18,
    tableHeight - 25,
    options
  );
  var wall4 = new tableWall(
    width / 2 + tableWidth / 2,
    height / 2,
    tableHeight / 18,
    tableHeight - 25,
    options
  );
  var wall5 = new tableWall(
    width / 2 + tableWidth / 4,
    height / 2 - tableHeight / 2,
    tableWidth / 2 - 25,
    tableHeight / 18,
    options
  );
  var wall6 = new tableWall(
    width / 2 + tableWidth / 4,
    height / 2 + tableHeight / 2,
    tableWidth / 2 - 25,
    tableHeight / 18,
    options
  );

  // Push all walls into the `tableWalls` array
  tableWalls.push(wall1, wall2, wall3, wall4, wall5, wall6);

  // Create trapezoidal cushion walls
  var trapezoidOptions = { isStatic: true }; // Options for static trapezoid bodies

  // Define the trapezoid shapes for the sides of the table
  var trapezoid1 = Bodies.trapezoid(
    width / 2 - tableWidth / 4.1,
    height / 2 - tableHeight / 2.15,
    tableWidth / 2 - 67,
    tableHeight / 38,
    -0.1,
    trapezoidOptions
  );
  var trapezoid2 = Bodies.trapezoid(
    width / 2 + tableWidth / 4.1,
    height / 2 - tableHeight / 2.15,
    tableWidth / 2 - 67,
    tableHeight / 38,
    -0.1,
    trapezoidOptions
  );
  var trapezoid3 = Bodies.trapezoid(
    width / 2 - tableWidth / 4.1,
    height / 2 + tableHeight / 2.15,
    tableWidth / 2 - 47,
    tableHeight / 38,
    0.1,
    trapezoidOptions
  );
  var trapezoid4 = Bodies.trapezoid(
    width / 2 + tableWidth / 4.1,
    height / 2 + tableHeight / 2.15,
    tableWidth / 2 - 47,
    tableHeight / 38,
    0.1,
    trapezoidOptions
  );

  // Define the custom vertices for the other two trapezoidal cushions (for corners)
  trapezoid5Vertices = [
    { x: width / 2 + tableWidth / 2.05, y: height / 2 - tableHeight / 2.35 },
    { x: width / 2 + tableWidth / 2, y: height / 2 - tableHeight / 2.6 },
    { x: width / 2 + tableWidth / 2, y: height / 2 + tableHeight / 2.6 },
    { x: width / 2 + tableWidth / 2.05, y: height / 2 + tableHeight / 2.35 },
  ];

  trapezoid6Vertices = [
    { x: width / 2 - tableWidth / 2.05, y: height / 2 - tableHeight / 2.35 },
    { x: width / 2 - tableWidth / 2, y: height / 2 - tableHeight / 2.6 },
    { x: width / 2 - tableWidth / 2, y: height / 2 + tableHeight / 2.6 },
    { x: width / 2 - tableWidth / 2.05, y: height / 2 + tableHeight / 2.35 },
  ];

  // Create the trapezoidal shapes using custom vertices
  var trapezoid5 = Bodies.fromVertices(
    width / 2 - tableWidth / 2.09,
    height / 2,
    trapezoid5Vertices,
    trapezoidOptions
  );
  var trapezoid6 = Bodies.fromVertices(
    width / 2 + tableWidth / 2.09,
    height / 2,
    trapezoid6Vertices,
    trapezoidOptions
  );

  // Push all cushion walls into the `cushionWalls` array
  cushionWalls.push(
    trapezoid1,
    trapezoid2,
    trapezoid3,
    trapezoid4,
    trapezoid5,
    trapezoid6
  );

  // Add all the cushion walls to the Matter.js world
  World.add(engine.world, cushionWalls);
}

/**
 * Function to draw the table, including the cushion, walls, pockets, arcs, and lines.
 *
 * @description
 * - This function uses the p5.js library to draw the entire table layout with its walls, cushions, pockets, and other design elements.
 * - The table's surface, walls, cushion bumpers, and pockets are drawn based on predefined dimensions and positions.
 * - The function also draws an arc and lines on the table for a more realistic design.
 */
function drawTable() {
  push(); // Begin drawing group (to isolate transformations)

  fill("#1E5128"); // Green color for the table cushion
  rect(
    width / 2 - tableWidth / 2,
    height / 2 - tableHeight / 2,
    tableWidth,
    tableHeight
  ); // Draw the rectangular cushion

  fill("#3D0000"); // Dark red color for the table walls
  // Loop through tableWalls array and draw each wall's vertices
  for (var i = 0; i < tableWalls.length; i++) {
    drawVertices(tableWalls[i].body.vertices); // Custom function to draw vertices
  }

  fill("#142116"); // Dark green color for the cushion bumpers
  // Loop through cushionWalls array and draw each cushion's vertices
  for (var i = 0; i < cushionWalls.length; i++) {
    drawVertices(cushionWalls[i].vertices); // Custom function to draw vertices
  }

  fill("#FFFF00"); // Yellow color for the pocket borders
  rectMode(CENTER); // Set rectangle mode to center for the pockets
  // Draw rectangles to represent the pocket borders
  rect(width / 2 + tableWidth / 2, height / 2 + tableHeight / 2, 30, 25);
  rect(width / 2 + tableWidth / 2, height / 2 - tableHeight / 2, 25, 25);
  rect(width / 2, height / 2 + tableHeight / 2, 25, 25);
  rect(width / 2, height / 2 - tableHeight / 2, 25, 25);
  rect(width / 2 - tableWidth / 2, height / 2 + tableHeight / 2, 25, 25);
  rect(width / 2 - tableWidth / 2, height / 2 - tableHeight / 2, 25, 25);

  stroke(255); // Set the stroke color to white for lines and arcs
  noFill(); // No fill for the arc
  // Draw a vertical line from top to bottom of the table
  line(
    width / 2 - tableWidth / 4,
    height / 2 - tableHeight / 2.2,
    width / 2 - tableWidth / 4,
    height / 2 + tableHeight / 2.2
  );
  angleMode(DEGREES); // Set angle mode to degrees for the arc
  // Draw an arc at the left edge of the table
  arc(width / 2 - tableWidth / 4, height / 2, 120, 120, 90, 270);
  noStroke(); // Remove stroke after drawing arc and line

  pop(); // End the drawing group (revert transformations)

  // Loop through all the pockets (holes) and draw them using a custom function
  for (var i = 0; i < holes.length; i++) {
    pocket(holes[i].x, holes[i].y, pocketSize); // Custom function to draw pockets
  }
}

/**
 * Function to draw a pocket (hole) on the pool table.
 *
 * @param {number} x - The x-coordinate for the center of the pocket.
 * @param {number} y - The y-coordinate for the center of the pocket.
 * @param {number} pocketSize - The diameter (or size) of the pocket.
 */
function pocket(x, y, pocketSize) {
  fill(0); // Set the pocket color to black
  ellipse(x, y, pocketSize); // Draw the pocket as an ellipse at the given coordinates (x, y) with the specified size
}

/**
 * Function to set up the positions of the pockets on the pool table.
 *
 * This function defines the locations of the six pockets on the table. The pockets are placed at the edges
 * and corners of the table, and their coordinates are stored in the `holes` array.
 */
function setupPocket() {
  // Define the positions for each of the 6 pockets on the pool table
  holes = [
    { x: width / 2, y: height / 2 + tableHeight / 2 - 5 }, // Bottom center pocket
    { x: width / 2 + tableWidth / 2 - 5, y: height / 2 + tableHeight / 2 - 5 }, // Bottom-right pocket
    { x: width / 2 - tableWidth / 2 + 5, y: height / 2 + tableHeight / 2 - 5 }, // Bottom-left pocket
    { x: width / 2, y: height / 2 - tableHeight / 2 + 5 }, // Top center pocket
    { x: width / 2 - tableWidth / 2 + 5, y: height / 2 - tableHeight / 2 + 5 }, // Top-left pocket
    { x: width / 2 + tableWidth / 2 - 5, y: height / 2 - tableHeight / 2 + 5 }, // Top-right pocket
  ];
}
