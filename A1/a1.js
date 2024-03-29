/**
 * Note: Do not include any external libraries.
 * You may only use the drawing functions provided to complete this assignment.
 */

/**    HELPER FUNCTIONS     **/
/** Do not modify this code **/

/**
 * Draws a line segment on the screen connecting (x1, y1) and (x2, y2). This is the only function
 * you may call to draw.
 * @param  {DOMString} ctx - Canvas context to draw to. Simply pass in the given ctx variable
 * @param  {number} x1 - X coordinate of the start point
 * @param  {number} y1 - Y coordinate of the start point
 * @param  {number} x2 - X coordinate of the end point
 * @param  {number} y2 - Y coordinate of the end point
 * @param  {String} style - A string giving the colour of the line. Default is black.
 * @return {undefined}
 */
function drawLineSegment(ctx, x1, y1, x2, y2, style="black")
{
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.strokeStyle = style;
  ctx.stroke();
}

/**
 * Takes a point defined as an array of numbers [x, y] and treats it as a homogeneous coordinate [x, y, 1]
 * The transformation T is a 2x3 matrix defined as an array of arrays
 * T = [[T11, T12, T13],
 *      [T21, T22, T23]]
 * The result is a new transformed point [x', y'] = T * [p[0], p[1], 1]
 * @param  {array} p - Point to transform
 * @param  {array} T - Transformation to apply
 * @return {array} New transformed point
 */
function transformPoint(p,T)
{
  var q = new Array();
  
  for(var i = 0; i<T.length; i++)
  {
    q[i] = 0;
    for(var j = 0; j<p.length; j++)
      q[i] += T[i][j] * p[j];
	// Translation
	q[i] += T[i][j];
  }
  
  return q;
}

/**
 * Given two transformations T1 and T2, returns a new transformation equivalent to applying
 * T1 followed by T2.
 * @param  {array} T1 - The first transform to apply
 * @param  {array} T2 - The second transfrom to apply
 * @return {array} A new transformation
 */
function composeTransforms(T1, T2) {
  var T_new = [
    [0, 0, 0],
    [0, 0, 0]
  ];

  for (var i = 0; i < 2; i++) {
    for (var j = 0; j < 3; j++) {
      for(var k = 0; k < 3; k++) {
        T_new[i][j] += T2[i][k] * (k === 2 ? (j === 2 ? 1 : 0) : T1[k][j]);
      }
    }
  }

  return T_new;
}
/** END OF HELPER FUNCTIONS **/


/**
 * This function should take a list of points and draw a closed polygon connecting the points.
 * Each point is an array containing two numbers [x, y].
 * @param  {DOMString} ctx - Canvas context to draw to. Simply pass in the given ctx variable
 * @param  {array} poly - Array of points corresponding to the vertices of the polygon [p1, p2, p3, ..., pn]
 * @return {undefined}
 */
function drawPolygon(ctx, poly)
{
  /** Fill in your answer here **/
  // Hint: call drawLineSegment to help you
  for (var i = 0; i < poly.length; i++) {
  	drawLineSegment(ctx,
  					poly[i%poly.length][0],
  					poly[i%poly.length][1],
    				poly[(i+1)%poly.length][0],
  					poly[(i+1)%poly.length][1]
  					);
  }
  return;
}

/**
 * Given an array of points defining a polygon, return a new array of points for a polygon transformed by
 * the transformation T.
 * @param  {array} poly - Array of points corresponding to the vertices of the polygon [p1, p2, p3, ..., pn]
 * @param  {array} T - T transformation to apply. Same definition as in transformPoint()
 * @return {array} Array of vertex locations for the transformed polygon
 */
function transformPolygon(poly, T)
{
  /** Fill in your answer here **/
  // Hint: call transformPoint to help you
  for (var i = 0; i < poly.length; i++) {
  	poly[i] = transformPoint(poly[i], T);
  }
  return poly;
}

/**
 * Draws a circle of radius r around point [cx, cy].
 * @param  {DOMString} ctx - Canvas context to draw to. Simply pass in the given ctx variable
 * @param  {number} cx - X coordinate of the circle center
 * @param  {number} cy - Y coordinate of the circle center
 * @param  {number} r - Radius of the circle
 * @return {undefined}
 */
function drawCircle(ctx, cx, cy, r)
{
  /** Fill in your answer here **/
  // Hint: call drawLineSegment to help you
  incrementAngle = 15;
  for (var i = 0; i <= 360; i += incrementAngle) {
  	drawLineSegment(ctx,
  					cx + (r * Math.cos(i * Math.PI / 180)),
  					cy + (r * Math.sin(i * Math.PI / 180)),
  					cx + (r * Math.cos((i+incrementAngle) * Math.PI / 180)),
  					cy + (r * Math.sin((i+incrementAngle) * Math.PI / 180))
  					);
  }
  return;
}

/**
 * Returns a transformation matrix T that defines a translation in homogeneous coordinates
 * by the vector offset [x, y].
 * That is, if applied to a point p = [p1, p2, 1] then it will be
 * translated to p' = [p1 + x, p2 + y, 1]
 * @param  {array} offset - The offset to translate by
 * @return {array} A 2x3 transformation matrix
 */
function translateByOffset(offset)
{
  var T = [
    [1, 0, 0],
    [0, 1, 0]
  ];

  /** Fill in your answer here **/

  T[0][2] = offset[0];
  T[1][2] = offset[1];
  
  
  return T;
}

/**
 * Returns a transformation matrix T that defines
 * a rotation by angle radians around a point joint.
 * @param  {number} angle - Angle in radians
 * @param  {array} joint - point [x, y] to rotate around 
 * @return {array} T - 2x3 transformation matrix defining the rotation
 */
function rotationAboutPoint(angle, joint)
{
  var T = [
    [1, 0, 0],
    [0, 1, 0]
  ];
  
  /** Fill in your answer here **/
  // Hint: Use Math.cos() and Math.sin()
 
  var T1 = [
  	[1, 0, -joint[0]],
  	[0, 1, -joint[1]]
  ];

  var T2 = [
  	[Math.cos(angle), -Math.sin(angle), 0],
  	[Math.sin(angle), Math.cos(angle), 0]
  ];

  var T3 = [
  	[1, 0, joint[0]],
  	[0, 1, joint[1]]
  ];

  T = composeTransforms(composeTransforms(T1, T2), T3)
 
  return T;
}


function drawPenguin(ctx)
{
  /** GET UI SLIDER VARIABLES **/
  /** You do not need to change this code **/
  var deg_to_rad = Math.PI / 180.0;
  var torso_x_offset = parseFloat(document.getElementById("slider_torso_x").value);
  var torso_y_offset = parseFloat(document.getElementById("slider_torso_y").value);
  var arm_angle = parseFloat(document.getElementById("slider_arm_angle").value) * deg_to_rad;
  var head_angle = parseFloat(document.getElementById("slider_head_angle").value) * deg_to_rad;
  var mouth_gap = parseFloat(document.getElementById("slider_mouth_gap").value);
  var hip_angles = [
    parseFloat(document.getElementById("slider_hip_angle0").value) * deg_to_rad,
    parseFloat(document.getElementById("slider_hip_angle1").value)  * deg_to_rad
  ];
  var ankle_angles = [
    parseFloat(document.getElementById("slider_ankle_angle0").value)  * deg_to_rad,
	parseFloat(document.getElementById("slider_ankle_angle1").value)  * deg_to_rad
  ];
  /** END OF GET UI SLIDER VARIABLES **/


  /** POLYGON DEFINITIONS **/
  /**
   * The polygons defining each body region are provided *relative to the origin*
   * It is your responsibility to transform and draw these polygons to construct a hierarchical model
   * that can be manipulated by the sliders. 
   *
   * You may not change these values manually.
   */
  // 
  var torso_poly = [[-56, -196], [-129, 99], [-46, 188], [36, 196], [129, 116], [69, -71], [36, -196]];
  var arm_poly = [[-38, -78], [-15, 78], [22, 78], [39, -74]];

  var head_poly = [[-19, -50], [-49, -29], [-62, 50], [62, 48], [46, -27]];
  var upper_beak_poly = [[41, -13], [-44, 2], [-41, 13], [43, 13]];
  var lower_beak_poly = [[-40, -3], [-42, 3], [41, 3], [41, -3]];
  
  var leg_poly = [[-15, -53], [-20, 52], [ 20,  52], [ 12, -53]];
  var foot_poly = [[54, -11], [58, 11], [-48,  11], [-58, -11]];
  
  // These will be drawn as circles
  var eye = [0, 0];
  var iris = [0, 0];
  
  // Radii of circles
  var eye_r = 10;
  var iris_r = 3;
  var arm_joint_r = 10;
  var head_joint_r = 5;
  var hip_joint_r = 5;
  var ankle_joint_r = 5;
  
  // Joint positions
  var hip_joints = [[0, 0], [0, 0]];
  var ankle_joints = [[0, 0], [0, 0]];
  var arm_joint = [0, 0];
  var head_joint = [0, 0];
  /** END OF POLYGON DEFINITIONS **/


  /*********************************/
  /** YOUR DRAWING CODE GOES HERE **/
  /*********************************/

  /** The torso and head are given as examples **/
  // Define the center of the torso in screen space
  // and a transformation to translate the torso to its origin
  var torso_origin = [360, 360];
  var torso_T = translateByOffset([torso_origin[0] + torso_x_offset, torso_origin[1] + torso_y_offset]);
  
  torso_poly = transformPolygon(torso_poly, torso_T);
  drawPolygon(ctx, torso_poly);

  // Define the transformation for the head as a rotation and then a translation
  var head_offset = [-10, -220]; // The location of the head relative to the body
  var head_joint_offset = [0, 35]; // The location of the head joint relative to the head center
  var head_T = composeTransforms(
    rotationAboutPoint(head_angle, head_joint_offset),
    translateByOffset(head_offset)
  );

  // Beak, translate
  var beak_origin = [-90, 0];
  var beak_offset = [0, mouth_gap];
  var lower_beak_offset = [0, 30];
  var beakRotate = rotationAboutPoint(head_angle, head_joint_offset);
  var beak_T = translateByOffset([beak_origin[0], beak_origin[1]]);
  var lower_beak_T = translateByOffset([lower_beak_offset[0] + beak_offset[0], lower_beak_offset[1] + beak_offset[1]]);


  // eye, translate
  var eye_iris_T = translateByOffset([-20, -20]);

  // arm joint disp
  var joint_disp = [40, -20];
  var joint_disp_T = translateByOffset([arm_joint[0] + joint_disp[0], arm_joint[1] + joint_disp[1]]);


  // arm, rotate and translate
  var arm_offset = [0, 40];
  var arm_disp = [0, 20];
  var arm_disp_T = translateByOffset(arm_disp);
  var arm_T = composeTransforms(
  	translateByOffset([arm_joint[0] + arm_offset[0] + joint_disp[0], arm_joint[1] + arm_offset[1] + joint_disp[1]]),
  	rotationAboutPoint(arm_angle, [arm_joint[0] + joint_disp[0], arm_joint[1] + joint_disp[1]])
  );
 
  // Transform and draw the head in a hierarchical fashion
  // That is, if the body moves, then the head will move with it.
  head_poly = transformPolygon(head_poly, head_T);
  head_poly = transformPolygon(head_poly, torso_T);
  drawPolygon(ctx, head_poly);

  // Now draw the head joint
  head_joint = transformPoint(head_joint_offset, head_T);
  head_joint = transformPoint(head_joint, torso_T);
  drawCircle(ctx, head_joint[0], head_joint[1], head_joint_r);

  /* Draw the rest of the penguin below. */

  // Draw upper beak
  upper_beak_poly = transformPolygon(upper_beak_poly, beak_T);
  upper_beak_poly = transformPolygon(upper_beak_poly, head_T);
  upper_beak_poly = transformPolygon(upper_beak_poly, torso_T);
  drawPolygon(ctx, upper_beak_poly);

  // Draw lower beak
  lower_beak_poly = transformPolygon(lower_beak_poly, lower_beak_T);
  lower_beak_poly = transformPolygon(lower_beak_poly, beak_T);
  lower_beak_poly = transformPolygon(lower_beak_poly, head_T);
  lower_beak_poly = transformPolygon(lower_beak_poly, torso_T);
  drawPolygon(ctx, lower_beak_poly);

  // eye and iris
  eye = transformPoint(eye, eye_iris_T);
  iris = transformPoint(iris, eye_iris_T);
  eye = transformPoint(eye, head_T);
  eye = transformPoint(eye, torso_T);
  iris = transformPoint(iris, head_T);
  iris = transformPoint(iris, torso_T);
  drawCircle(ctx, eye[0], eye[1], eye_r);
  drawCircle(ctx, iris[0], iris[1], iris_r);
  
  // arm
  arm_poly = transformPolygon(arm_poly, arm_T);
  arm_poly = transformPolygon(arm_poly, torso_T);
  drawPolygon(ctx, arm_poly);

  // arm joint
  arm_joint = transformPoint(arm_joint, joint_disp_T);
  arm_joint = transformPoint(arm_joint, torso_T);
  drawCircle(ctx, arm_joint[0], arm_joint[1], arm_joint_r);

  // left hip
  var leg_disp = [0, 40];
  var hip_joint_1_disp = [0, 0];
  var leg_disp_T = translateByOffset(leg_disp);
  var hip_angle_1_T = rotationAboutPoint(hip_angles[0], [hip_joint_1_disp[0] + hip_joints[0][0], hip_joint_1_disp[1] + hip_joints[0][1]]);
  var hip_left_disp = [-50, 120];
  var hip_left_disp_T = translateByOffset(hip_left_disp);

  // left leg
  var leg_poly_copy = leg_poly.slice();
  leg_poly = transformPolygon(leg_poly, leg_disp_T);
  leg_poly = transformPolygon(leg_poly, hip_angle_1_T);
  leg_poly = transformPolygon(leg_poly, torso_T);
  leg_poly = transformPolygon(leg_poly, hip_left_disp_T)
  drawPolygon(ctx, leg_poly);

  // hip joint
  hip_joints[0] = transformPoint(hip_joints[0], torso_T);
  hip_joints[0] = transformPoint(hip_joints[0], hip_left_disp_T);
  drawCircle(ctx, hip_joints[0][0], hip_joints[0][1], hip_joint_r);

  // copy foot poly for right leg
  var foot_poly_copy = foot_poly.slice();

  // foot poly transforms
  var ankle_1_angle = ankle_angles[0];
  var ankle_1_angle_T = rotationAboutPoint(ankle_1_angle, ankle_joints[0]);
  var foot_offset = [-40, 0];
  var foot_offset_T = translateByOffset(foot_offset);
  foot_poly = transformPolygon(foot_poly, foot_offset_T);
  foot_poly = transformPolygon(foot_poly, ankle_1_angle_T);

  // ankle joint
  var ankle_joint_1_disp = [0, 40];
  var ankle_joint_1_disp_T = translateByOffset(ankle_joint_1_disp);
  ankle_joints[0] = transformPoint(ankle_joints[0], ankle_joint_1_disp_T)
  ankle_joints[0] = transformPoint(ankle_joints[0], leg_disp_T)
  ankle_joints[0] = transformPoint(ankle_joints[0], hip_angle_1_T);
  ankle_joints[0] = transformPoint(ankle_joints[0], torso_T);
  ankle_joints[0] = transformPoint(ankle_joints[0], hip_left_disp_T);
  drawCircle(ctx, ankle_joints[0][0], ankle_joints[0][1], ankle_joint_r);

  // draw foot poly
  foot_poly = transformPolygon(foot_poly, ankle_joint_1_disp_T);
  foot_poly = transformPolygon(foot_poly, leg_disp_T);
  foot_poly = transformPolygon(foot_poly, hip_angle_1_T);
  foot_poly = transformPolygon(foot_poly, torso_T);
  foot_poly = transformPolygon(foot_poly, hip_left_disp_T);
  drawPolygon(ctx, foot_poly);


  // left hip
  hip_angle_1_T = rotationAboutPoint(hip_angles[1], [hip_joint_1_disp[0] + hip_joints[1][0], hip_joint_1_disp[1] + hip_joints[1][1]]);

  leg_poly = leg_poly_copy;
  foot_poly = foot_poly_copy;

  var leg_offset = [120, 0];
  var leg_offset_T = translateByOffset(leg_offset);

  // leg poly
  leg_poly = transformPolygon(leg_poly, leg_disp_T);
  leg_poly = transformPolygon(leg_poly, hip_angle_1_T);
  leg_poly = transformPolygon(leg_poly, torso_T);
  leg_poly = transformPolygon(leg_poly, hip_left_disp_T);
  leg_poly = transformPolygon(leg_poly, leg_offset_T);
  drawPolygon(ctx, leg_poly);

  // hip joint
  hip_joints[1] = transformPoint(hip_joints[1], torso_T);
  hip_joints[1] = transformPoint(hip_joints[1], hip_left_disp_T);
  hip_joints[1] = transformPoint(hip_joints[1], leg_offset_T);
  drawCircle(ctx, hip_joints[1][0], hip_joints[1][1], hip_joint_r);

  // transform foot poly
  var ankle_1_angle = ankle_angles[1];
  var ankle_1_angle_T = rotationAboutPoint(ankle_1_angle, ankle_joints[1]);
  var foot_offset = [-40, 0];
  var foot_offset_T = translateByOffset(foot_offset);
  foot_poly = transformPolygon(foot_poly, foot_offset_T);
  foot_poly = transformPolygon(foot_poly, ankle_1_angle_T);

  // ankle joint
  var ankle_joint_1_disp = [0, 40];
  var ankle_joint_1_disp_T = translateByOffset(ankle_joint_1_disp);
  ankle_joints[1] = transformPoint(ankle_joints[1], ankle_joint_1_disp_T)
  ankle_joints[1] = transformPoint(ankle_joints[1], leg_disp_T)
  ankle_joints[1] = transformPoint(ankle_joints[1], hip_angle_1_T);
  ankle_joints[1] = transformPoint(ankle_joints[1], torso_T);
  ankle_joints[1] = transformPoint(ankle_joints[1], hip_left_disp_T);
  ankle_joints[1] = transformPoint(ankle_joints[1], leg_offset_T);
  drawCircle(ctx, ankle_joints[1][0], ankle_joints[1][1], ankle_joint_r);

  // draw foot poly
  foot_poly = transformPolygon(foot_poly, ankle_joint_1_disp_T);
  foot_poly = transformPolygon(foot_poly, leg_disp_T);
  foot_poly = transformPolygon(foot_poly, hip_angle_1_T);
  foot_poly = transformPolygon(foot_poly, torso_T);
  foot_poly = transformPolygon(foot_poly, hip_left_disp_T);
  foot_poly = transformPolygon(foot_poly, leg_offset_T);
  drawPolygon(ctx, foot_poly);
}


/**        BOILERPLATE DRAWING CODE        **/
/**   You do not need to modify this code  **/
function drawAxis(ctx)
{
  drawLineSegment(ctx, 0, 0, 100, 0, "red");
  drawLineSegment(ctx, 0, 0, 0, 100, "green");
  ctx.fillText("0,0", 4, 12);
  ctx.fillText("100,0", 98, 10);
  ctx.fillText("0,100", 5, 100);
}

// This function is called to draw the current frame. It is called whenever the
// sliders are changed.
function draw() 
{
  // you do not need to modify this function
  // this is help function
  // Boilerplate code to setup the canvas
  var canvas = document.getElementById('canvas');
  if (!canvas.getContext)
  {
    alert("Your browser is too old! Please upgrade to a canvas-capable browser.");
  }
  var ctx = canvas.getContext('2d');
  // clear canvas so we can draw a new frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // set global line width and smooth lines
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  // draw a small axis to demonstrate the inverted coordinate system
  drawAxis(ctx);
  // draw the current Penguin
  drawPenguin(ctx);
}
/**     END OF BOILERPLATE DRAWING CODE       **/
