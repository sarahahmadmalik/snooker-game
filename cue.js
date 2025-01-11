var cueStickAnimationFrame = 0; // Keeps track of the animation frame for the cue stick
var cueStickDrawn = false; // A flag to track if the cue stick is drawn
var cueStickLength = 20; // The length of the cue stick (can be adjusted)

/**
 * Draws the cue stick in the game.
 *
 * This function draws the cue stick based on the position of the cue ball and the mouse.
 * The cue stick's body and handle are drawn, and it is positioned according to the mouse's position relative to the cue ball.
 *
 * The cue stick consists of:
 * - A **body** of fixed length (200 units)
 * - A **handle** of fixed length (100 units)
 *
 * The cue stick points in the direction from the cue ball to the mouse position, with the body and handle aligned in that direction.
 *
 * @returns {void} This function does not return anything, it directly updates the canvas by drawing the cue stick.
 */
function drawCueStick() {
  push();
  const fixedBodyLength = 200; // Length of the cue stick's body part
  const fixedHandleLength = 100; // Length of the cue stick's handle part

  // Calculate the direction vector from the cue ball to the mouse position
  const directionVector = Matter.Vector.normalise(
    Matter.Vector.create(
      cueBall.position.x - mouseX,
      cueBall.position.y - mouseY
    )
  );

  // Calculate the endpoint of the cue stick's body based on the direction
  const cueStickEndX = cueBall.position.x - cueStickLength * directionVector.x;
  const cueStickEndY = cueBall.position.y - cueStickLength * directionVector.y;

  // Calculate the body end (where the body part connects to the handle)
  const bodyEnd = Matter.Vector.create(
    cueStickEndX - fixedBodyLength * directionVector.x,
    cueStickEndY - fixedBodyLength * directionVector.y
  );

  // Calculate the handle end (where the cue stick handle ends)
  const handleEnd = Matter.Vector.create(
    bodyEnd.x - fixedHandleLength * directionVector.x,
    bodyEnd.y - fixedHandleLength * directionVector.y
  );

  // Draw the cue stick: body part in white and handle part in brown
  strokeWeight(5);
  stroke(255); // White for the body
  line(cueStickEndX, cueStickEndY, bodyEnd.x, bodyEnd.y); // Draw body part
  stroke("#C87941"); // Brown for the handle
  line(bodyEnd.x, bodyEnd.y, handleEnd.x, handleEnd.y); // Draw handle part
  pop();
}

/**
 * Function to animate the cue stick lengthening effect.
 * This function gradually increases the length of the cue stick over a specified number of frames.
 * It uses a recursive `setTimeout` call to simulate a smooth animation over time.
 */
function animateCueStick() {
  // Reset the cue stick length to its initial value of 20
  cueStickLength = 20;

  // Reset the animation frame counter to start from 0
  cueStickAnimationFrame = 0;

  // Set the flag to indicate that the cue stick is being drawn/animated
  cueStickDrawn = true;

  // Total number of frames the animation will last
  const animationFrames = 60;

  /**
   * Recursive function that animates the cue stick's lengthening.
   * It increases the length of the cue stick by a small amount on each frame.
   */
  function animate() {
    // Increment the animation frame counter
    cueStickAnimationFrame++;

    // If the current frame is within the specified range, continue animating
    if (cueStickAnimationFrame <= animationFrames) {
      // Increase the cue stick length slightly on each frame
      cueStickLength += 0.5;

      // Call the animate function again after 30ms for the next frame
      setTimeout(animate, 30);
    } else {
      // Once the animation is complete, stop drawing the cue stick
      cueStickDrawn = false;
    }
  }

  // Start the animation
  animate();
}
