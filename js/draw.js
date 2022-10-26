// Vertex shader program
var VERTEX_SHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Normal;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  // Shading calculation to make the arm look three-dimensional
  '  vec3 lightDirection = normalize(vec3(0.1, 0.2, 0.3));\n' + // Light direction
  '  vec4 color = vec4(0.8, 0.9, 0.2, 0.7);\n' +  // Robot color
  '  vec3 normal = normalize((u_NormalMatrix * a_Normal).xyz);\n' +
  '  float nDotL = max(dot(normal, lightDirection), 0.0);\n' +
  '  v_Color = vec4(color.rgb * nDotL + vec3(0.1), color.a);\n' +
  '}\n';

// Fragment shader program
var FRAGMENT_SHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

var g_stepingAngle = 3.5; 
var g_step = 0.1;
var g_scale_step = 0.1;

var g_rightUpperArmAngle = 90.0;   
var g_rightLowerArmAngle = 0.0; 
var g_rightPalmAngle = 0.0;  
var g_rightFingerAngle = 0.0;

var g_leftUpperArmAngle = 90.0;  
var g_leftLowerArmAngle = 0.0;
var g_leftPalmAngle = 0.0;  
var g_leftFingerAngle = 0.0;

var g_deltaX = 0.0;
var g_deltaY = 0.0;
var g_deltaZ = 0.0;

var legHeight = 5.0;
var legWidth = 1.5;
var legDepth = 1.5;

var bodyHeight = 10.0;
var bodyWidth = 8.0;
var bodyDepth = 6.0;

var neckHeight = 1.0;
var neckWidth = 1.5;
var neckDepth = 1.5;

var headHeight = 3.0;
var headWidth = 4.0;
var headDepth = 3.0;

var antennaHeight = 5.0;
var antennaWidth = 0.2;
var antennaDepth = 0.2;

var antennaHeadHeight = 0.4;
var antennaHeadWidth = 0.4;
var antennaHeadDepth = 0.4;

var posHeight = -10.0;

var upperArmWidth = 1.0;
var upperArmHeight = 1.0;
var lowerArmWidth = 0.6;
var lowerArmHeight = 0.6;
var rightUpperArmLength = 5.0;
var rightLowerArmLength = 5.0;
var leftUpperArmLength = 5.0;
var leftLowerArmLength = 5.0;

var PalmLength = 1;
var PalmWidth = 0.6;
var PalmDepth = 2;

var FingerWidth = 0.4;
var FingerLength = 1;
var FingerDepth = 0.4;

var mirrorflag = 0;
var mirrorcount = 0;
var mirrorangle = 0;
function initVertexBuffers(gl) {
  // Coordinates Cube which length of one side is 1 with the origin on the center of the bottom)
  var vertices = new Float32Array([
    0.5, 1.0, 0.5, -0.5, 1.0, 0.5, -0.5, 0.0, 0.5,  0.5, 0.0, 0.5, // v0-v1-v2-v3 front
    0.5, 1.0, 0.5,  0.5, 0.0, 0.5,  0.5, 0.0,-0.5,  0.5, 1.0,-0.5, // v0-v3-v4-v5 right
    0.5, 1.0, 0.5,  0.5, 1.0,-0.5, -0.5, 1.0,-0.5, -0.5, 1.0, 0.5, // v0-v5-v6-v1 up
   -0.5, 1.0, 0.5, -0.5, 1.0,-0.5, -0.5, 0.0,-0.5, -0.5, 0.0, 0.5, // v1-v6-v7-v2 left
   -0.5, 0.0,-0.5,  0.5, 0.0,-0.5,  0.5, 0.0, 0.5, -0.5, 0.0, 0.5, // v7-v4-v3-v2 down
    0.5, 0.0,-0.5, -0.5, 0.0,-0.5, -0.5, 1.0,-0.5,  0.5, 1.0,-0.5  // v4-v7-v6-v5 back
  ]);

  // Normal
  var normals = new Float32Array([
    0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
    1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
    0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
   -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
    0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
    0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
  ]);

  // Indices of the vertices
  var indices = new Uint8Array([
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
  ]);

  // Write the vertex property to buffers (coordinates and normals)
  if (!initArrayBuffer(gl, 'a_Position', vertices, gl.FLOAT, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal', normals, gl.FLOAT, 3)) return -1;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

function initArrayBuffer(gl, attribute, data, type, num) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}
// Coordinate transformation matrix
var g_bodyMatrix = new Matrix4(), g_bodyMvpMatrix = new Matrix4();
function drawRobotBody(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
  // Clear color and depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  var drawRobotBodyFlag = "RobotBody";
  //Draw a robot right leg
  g_bodyMatrix.setTranslate(-bodyWidth / 4, posHeight, 0.0);  
  g_bodyMatrix.translate(g_deltaX,g_deltaY,g_deltaZ);    
  drawBox(gl, n, legWidth, legHeight, legDepth, viewProjMatrix, u_MvpMatrix, u_NormalMatrix,drawRobotBodyFlag);
  //Draw a robot left leg
  g_bodyMatrix.setTranslate( bodyWidth / 4, posHeight, 0.0);  
  g_bodyMatrix.translate(g_deltaX,g_deltaY,g_deltaZ);    
  drawBox(gl, n, legWidth, legHeight, legDepth, viewProjMatrix, u_MvpMatrix, u_NormalMatrix,drawRobotBodyFlag);
  //Draw a robot body
  g_bodyMatrix.setTranslate(0.0, posHeight + legHeight, 0.0);
  g_bodyMatrix.translate(g_deltaX,g_deltaY,g_deltaZ);  
  drawBox(gl, n, bodyWidth, bodyHeight, bodyDepth, viewProjMatrix, u_MvpMatrix, u_NormalMatrix,drawRobotBodyFlag);
  //Draw a robot neck
  g_bodyMatrix.setTranslate(0.0, posHeight + legHeight + bodyHeight, 0.0);
  g_bodyMatrix.translate(g_deltaX,g_deltaY,g_deltaZ);  
  drawBox(gl, n, neckWidth, neckHeight, neckDepth, viewProjMatrix, u_MvpMatrix, u_NormalMatrix,drawRobotBodyFlag);
  //Draw a robot head
  g_bodyMatrix.setTranslate(0.0, posHeight + legHeight + bodyHeight + neckHeight, 0.0);
  g_bodyMatrix.translate(g_deltaX,g_deltaY,g_deltaZ);  
  drawBox(gl, n, headWidth, headHeight, headDepth, viewProjMatrix, u_MvpMatrix, u_NormalMatrix,drawRobotBodyFlag);  
  /*
  //Draw a robot antenna
  g_bodyMatrix.setTranslate(0.0, posHeight + legHeight + bodyHeight + neckHeight + headHeight, 0.0);
  g_bodyMatrix.translate(-(headWidth - antennaWidth) / 2 , 0 , 0);  
  g_bodyMatrix.translate(g_deltaX,g_deltaY,g_deltaZ);  
  
  //mirroring action with antenna  
  if (mirrorcount % 2 == 0 ) sign = 0;
  else sign = -1;
  g_bodyMatrix.rotate(mirrorangle,0,1,0);
  g_bodyMatrix.translate( sign * (headWidth - antennaWidth) ,0,0);    

  drawBox(gl, n, antennaWidth, antennaHeight, antennaDepth, viewProjMatrix, u_MvpMatrix, u_NormalMatrix,drawRobotBodyFlag);  
  //Draw a robot antenna head
  g_bodyMatrix.setTranslate(0.0, posHeight + legHeight + bodyHeight + neckHeight + headHeight + antennaHeight, 0.0);
  g_bodyMatrix.translate(-(headWidth + antennaHeadWidth) / 2 , -antennaHeadHeight , 0);  
  g_bodyMatrix.translate(g_deltaX,g_deltaY,g_deltaZ);  
  
  //mirroring action with antenna  
  if (mirrorcount % 2 == 0 ) sign = 0;
  else sign = -1;    
  g_bodyMatrix.rotate(mirrorangle,0,1,0);
  g_bodyMatrix.translate( sign * (headWidth + antennaWidth) ,0,0);    
    
  drawBox(gl, n, antennaHeadWidth, antennaHeadHeight, antennaHeadDepth, viewProjMatrix, u_MvpMatrix, u_NormalMatrix,drawRobotBodyFlag);    
  */
}

var g_rightArmMatrix = new Matrix4(), g_rightArmMvpMatrix = new Matrix4();
function drawRightArm(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {  
  var drawBoxRightArmFlag = "RightArm";
  
  g_rightArmMatrix.setTranslate(0.0, posHeight + legHeight + bodyHeight + neckHeight, 0.0);
  g_rightArmMatrix.translate(g_deltaX,g_deltaY,g_deltaZ);
  g_rightArmMatrix.translate(0, 0.0 - neckHeight, 0.0);
  //Draw a right upper arm
  g_rightArmMatrix.translate(-(bodyWidth + upperArmWidth) / 2, -upperArmHeight/2 ,0.0 );    
  g_rightArmMatrix.rotate(g_rightUpperArmAngle, 1.0, 0.0, 0.0); 
  drawBox(gl, n, upperArmWidth, rightUpperArmLength, upperArmHeight, viewProjMatrix, u_MvpMatrix, u_NormalMatrix,drawBoxRightArmFlag); // Draw  
  //Draw a right lower arm  
  g_rightArmMatrix.translate(0.0, rightUpperArmLength, 0.0);       
  g_rightArmMatrix.rotate(g_rightLowerArmAngle, 0.0, 0.0, 1.0);  
  drawBox(gl, n, lowerArmWidth, rightLowerArmLength, lowerArmHeight, viewProjMatrix, u_MvpMatrix, u_NormalMatrix,drawBoxRightArmFlag); // Draw
  //Draw a right palm
  g_rightArmMatrix.translate(0.0, rightLowerArmLength, 0.0);      
  g_rightArmMatrix.rotate(g_rightPalmAngle, 0.0, 1.0, 0.0);  
  drawBox(gl, n, PalmWidth, PalmLength, PalmDepth, viewProjMatrix, u_MvpMatrix, u_NormalMatrix,drawBoxRightArmFlag);  
  
  //Move to center of fingers
  g_rightArmMatrix.translate(0.0 , PalmLength , 0.0);
  // Draw a right hand finger1
  pushMatrix(g_rightArmMatrix);    
    g_rightArmMatrix.translate(0.0, 0.0, PalmLength/2);
    g_rightArmMatrix.rotate(g_rightFingerAngle, 1.0, 0.0, 0.0);  
    drawBox(gl, n, FingerWidth,FingerLength,FingerDepth, viewProjMatrix, u_MvpMatrix, u_NormalMatrix,drawBoxRightArmFlag);
  g_rightArmMatrix = popMatrix();

  // Draw a right hand finger2
  g_rightArmMatrix.translate(0.0, 0.0, -PalmLength/2);
  g_rightArmMatrix.rotate(-g_rightFingerAngle, 1.0, 0.0, 0.0); 
  drawBox(gl, n, FingerWidth,FingerLength,FingerDepth, viewProjMatrix, u_MvpMatrix, u_NormalMatrix,drawBoxRightArmFlag);

}

var g_leftArmMatrix = new Matrix4(), g_leftArmMvpMatrix = new Matrix4();
function drawLeftArm(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix) {
  var drawBoxLeftArmFlag = "LeftArm";
  
  g_leftArmMatrix.setTranslate(0.0, posHeight + legHeight + bodyHeight + neckHeight, 0.0);
  g_leftArmMatrix.translate(g_deltaX,g_deltaY,g_deltaZ);
  g_leftArmMatrix.translate(0, 0.0 - neckHeight, 0.0);
  //Draw a left upper arm
  g_leftArmMatrix.translate( (bodyWidth + upperArmWidth) / 2, -upperArmHeight/2 , 0.0 ); 
  g_leftArmMatrix.rotate(g_leftUpperArmAngle, 1.0, 0.0, 0.0); 
  drawBox(gl, n, upperArmWidth, leftUpperArmLength, upperArmHeight, viewProjMatrix, u_MvpMatrix, u_NormalMatrix,drawBoxLeftArmFlag); // Draw  
  //Draw a left lower arm  
  g_leftArmMatrix.translate(0.0, leftUpperArmLength, 0.0);   
  g_leftArmMatrix.rotate(g_leftLowerArmAngle, 0.0, 0.0, 1.0); 
  drawBox(gl, n, lowerArmWidth, leftLowerArmLength, lowerArmHeight, viewProjMatrix, u_MvpMatrix, u_NormalMatrix,drawBoxLeftArmFlag); // Draw
  //Draw a left palm
  g_leftArmMatrix.translate(0.0, leftLowerArmLength, 0.0);   
  g_leftArmMatrix.rotate(g_leftPalmAngle, 0.0, 1.0, 0.0); 
  drawBox(gl, n, PalmWidth, PalmLength, PalmDepth, viewProjMatrix, u_MvpMatrix, u_NormalMatrix,drawBoxLeftArmFlag);
  
  //Move to center of fingers
  g_leftArmMatrix.translate(0.0 , PalmLength , 0.0);
  // Draw a left hand finger1
  pushMatrix(g_leftArmMatrix);    
    g_leftArmMatrix.translate(0.0, 0.0, PalmLength/2);
    g_leftArmMatrix.rotate(g_leftFingerAngle, 1.0, 0.0, 0.0);  
    drawBox(gl, n, FingerWidth,FingerLength,FingerDepth, viewProjMatrix, u_MvpMatrix, u_NormalMatrix,drawBoxLeftArmFlag);
  g_leftArmMatrix = popMatrix();

  // Draw a left hand finger2
  g_leftArmMatrix.translate(0.0, 0.0, -PalmLength/2);
  g_leftArmMatrix.rotate(-g_leftFingerAngle, 1.0, 0.0, 0.0); 
  drawBox(gl, n,FingerWidth,FingerLength,FingerDepth, viewProjMatrix, u_MvpMatrix, u_NormalMatrix,drawBoxLeftArmFlag);

}

var g_matrixStack = []; // Array for storing a matrix
function pushMatrix(m) { // Store the specified matrix to the array
  var m2 = new Matrix4(m);
  g_matrixStack.push(m2);
}

function popMatrix() { // Retrieve the matrix from the array
  return g_matrixStack.pop();
}

var g_normalMatrix = new Matrix4();  // Coordinate transformation matrix for normals

function drawBox(gl, n, width, height, depth, viewProjMatrix, u_MvpMatrix, u_NormalMatrix,RobotPartFlag) {
  //var colorUniformLocation = gl.getUniformLocation(gl.program,'u_Color');  
  //var armColor = [0.5, 0.8, 0.5, 0.7];
  //var bodyColor = [0.8, 0.5, 0.2, 0.7];
  if (RobotPartFlag == "RobotBody"){
    pushMatrix(g_bodyMatrix);   // Save the model matrix
      // Scale a cube and draw
      g_bodyMatrix.scale(width, height, depth);
      // Calculate the model view project matrix and pass it to u_MvpMatrix
      g_bodyMvpMatrix.set(viewProjMatrix);
      g_bodyMvpMatrix.multiply(g_bodyMatrix);
      gl.uniformMatrix4fv(u_MvpMatrix, false, g_bodyMvpMatrix.elements);
      // Calculate the normal transformation matrix and pass it to u_NormalMatrix
      g_normalMatrix.setInverseOf(g_bodyMatrix);
      g_normalMatrix.transpose();
      gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
      // Draw
      //gl.uniform4fv(colorUniformLocation,bodyColor);
      gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    g_bodyMatrix = popMatrix();   // Retrieve the model matrix
  }
  else if (RobotPartFlag == "RightArm"){
    pushMatrix(g_rightArmMatrix);   // Save the model matrix
      // Scale a cube and draw
      g_rightArmMatrix.scale(width, height, depth);
      // Calculate the model view project matrix and pass it to u_MvpMatrix
      g_rightArmMvpMatrix.set(viewProjMatrix);
      g_rightArmMvpMatrix.multiply(g_rightArmMatrix);
      gl.uniformMatrix4fv(u_MvpMatrix, false, g_rightArmMvpMatrix.elements);
      // Calculate the normal transformation matrix and pass it to u_NormalMatrix
      g_normalMatrix.setInverseOf(g_rightArmMatrix);
      g_normalMatrix.transpose();
      gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
      // Draw
      //gl.uniform4fv(colorUniformLocation,armColor);      
      gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    g_rightArmMatrix = popMatrix();   // Retrieve the model matrix
  }  
  else if (RobotPartFlag == "LeftArm"){
    pushMatrix(g_leftArmMatrix);   // Save the model matrix
      // Scale a cube and draw
      g_leftArmMatrix.scale(width, height, depth);
      // Calculate the model view project matrix and pass it to u_MvpMatrix
      g_leftArmMvpMatrix.set(viewProjMatrix);
      g_leftArmMvpMatrix.multiply(g_leftArmMatrix);
      gl.uniformMatrix4fv(u_MvpMatrix, false, g_leftArmMvpMatrix.elements);
      // Calculate the normal transformation matrix and pass it to u_NormalMatrix
      g_normalMatrix.setInverseOf(g_leftArmMatrix);
      g_normalMatrix.transpose();      
      gl.uniformMatrix4fv(u_NormalMatrix, false, g_normalMatrix.elements);
      
      //gl.uniform4fv(colorUniformLocation,armColor);
      gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    g_leftArmMatrix = popMatrix();   // Retrieve the model matrix
  }
}

function on_keydown(ev) {
  switch (ev.keyCode) {
    case 40: // Up arrow key -> the positive rotation of right lower arm
      if (g_rightLowerArmAngle < 90.0) g_rightLowerArmAngle += g_stepingAngle;
      break;
    case 38: // Down arrow key -> the negative rotation of right lower arm
      if (g_rightLowerArmAngle > 0.0) g_rightLowerArmAngle -= g_stepingAngle;
      break;
    case 39: // Right arrow key -> the positive rotation of right upper arm
      if (g_rightUpperArmAngle < 180 ) g_rightUpperArmAngle = (g_rightUpperArmAngle + g_stepingAngle) % 360;
      break;
    case 37: // Left arrow key -> the negative rotation of right upper arm
      if (g_rightUpperArmAngle > 0) g_rightUpperArmAngle = (g_rightUpperArmAngle - g_stepingAngle) % 360;
      break;
    case 85: // 'u'key -> the positive rotation of right palm
      g_rightPalmAngle = (g_rightPalmAngle + g_stepingAngle) % 360;
      break; 
    case 73: // 'i'key -> the negative rotation of right palm
      g_rightPalmAngle = (g_rightPalmAngle - g_stepingAngle) % 360;
      break;
    case 79: // 'o'key -> the positive rotation of right finger1
      if (g_rightFingerAngle < 60.0)  g_rightFingerAngle = (g_rightFingerAngle + g_stepingAngle) % 360;
      break;
    case 80: // 'p'key -> the nagative rotation of right finger2
      if (g_rightFingerAngle > -60.0) g_rightFingerAngle = (g_rightFingerAngle - g_stepingAngle) % 360;
      break;
    case 87: // 'w' key -> the positive rotation of left lower arm
      if (g_leftLowerArmAngle < 0.0) g_leftLowerArmAngle += g_stepingAngle;
      break;
    case 83: // 's' key -> the negative rotation of left lower arm
      if (g_leftLowerArmAngle > -90.0) g_leftLowerArmAngle -= g_stepingAngle;
      break;
    case 68: // 'd' key -> the positive rotation of left upper arm
      if (g_leftUpperArmAngle < 180) g_leftUpperArmAngle = (g_leftUpperArmAngle + g_stepingAngle) % 360;
      break;
    case 65: // 'a' key -> the negative rotation of left upper arm      
      if (g_leftUpperArmAngle > 0) g_leftUpperArmAngle = (g_leftUpperArmAngle - g_stepingAngle) % 360;
      break;
    case 90: // 'z' key -> the positive rotation of left palm
      g_leftPalmAngle = (g_leftPalmAngle + g_stepingAngle) % 360;
      break; 
    case 88: // 'x' key -> the negative rotation of left palm
      g_leftPalmAngle = (g_leftPalmAngle - g_stepingAngle) % 360;
      break;
    case 86: // 'v' key -> the positive rotation of left finger1
      if (g_leftFingerAngle < 60.0)  g_leftFingerAngle = (g_leftFingerAngle + g_stepingAngle) % 360;
      break;
    case 67: // 'c' key -> the nagative rotation of left finger2
      if (g_leftFingerAngle > -60.0) g_leftFingerAngle = (g_leftFingerAngle - g_stepingAngle) % 360;
      break;      
    case 82: // 'r' key -> x-axis translation
      g_deltaX += g_step;
      break;
    case 84: // 't' key -> y-axis translation
      g_deltaY += g_step;
      break;
    case 89: // 'y' key -> z-axis translation
      g_deltaZ += g_step;    
      break;
    case 70: // 'f' key -> right upper arm length increase
      rightUpperArmLength += g_scale_step;
      break;
    case 71: // 'g' key -> right lower arm length increase 
      rightLowerArmLength += g_scale_step;
      break;
    case 72: // 'h' key -> left upper arm length increase
      leftUpperArmLength += g_scale_step;
      break;
    case 74: // 'j' key -> left lower arm length increase
      leftLowerArmLength += g_scale_step;
      break;
    default: return; 
  }
  drawRobot();
}

function drawRobot(){
  drawRobotBody(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
  drawRightArm(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
  drawLeftArm(gl, n, viewProjMatrix, u_MvpMatrix, u_NormalMatrix);
}


function onclickbtn(str){
  switch (str) {
    case '8': // Up arrow key -> the positive rotation of right lower arm
      if (g_rightLowerArmAngle < 90.0) g_rightLowerArmAngle += g_stepingAngle;
      break;
    case '2': // Down arrow key -> the negative rotation of right lower arm
      if (g_rightLowerArmAngle > 0.0) g_rightLowerArmAngle -= g_stepingAngle;
      break;
    case '6': // Right arrow key -> the positive rotation of right upper arm
      if (g_rightUpperArmAngle < 180 ) g_rightUpperArmAngle = (g_rightUpperArmAngle + g_stepingAngle) % 360;
      break;
    case '4': // Left arrow key -> the negative rotation of right upper arm
      if (g_rightUpperArmAngle > 0) g_rightUpperArmAngle = (g_rightUpperArmAngle - g_stepingAngle) % 360;
      break;
    case 'u': // 'u'key -> the positive rotation of right palm
      g_rightPalmAngle = (g_rightPalmAngle + g_stepingAngle) % 360;
      break; 
    case 'i': // 'i'key -> the negative rotation of right palm
      g_rightPalmAngle = (g_rightPalmAngle - g_stepingAngle) % 360;
      break;
    case 'o': // 'o'key -> the positive rotation of right finger1
      if (g_rightFingerAngle < 60.0)  g_rightFingerAngle = (g_rightFingerAngle + g_stepingAngle) % 360;
      break;
    case 'p': // 'p'key -> the nagative rotation of right finger2
      if (g_rightFingerAngle > -60.0) g_rightFingerAngle = (g_rightFingerAngle - g_stepingAngle) % 360;
      break;
    case 'w': // 'w' key -> the positive rotation of left lower arm
      if (g_leftLowerArmAngle < 0.0) g_leftLowerArmAngle += g_stepingAngle;
      break;
    case 's': // 's' key -> the negative rotation of left lower arm
      if (g_leftLowerArmAngle > -90.0) g_leftLowerArmAngle -= g_stepingAngle;
      break;
    case 'd': // 'd' key -> the positive rotation of left upper arm
      if (g_leftUpperArmAngle < 180) g_leftUpperArmAngle = (g_leftUpperArmAngle + g_stepingAngle) % 360;
      break;
    case 'a': // 'a' key -> the negative rotation of left upper arm      
      if (g_leftUpperArmAngle > 0) g_leftUpperArmAngle = (g_leftUpperArmAngle - g_stepingAngle) % 360;
      break;
    case 'z': // 'z' key -> the positive rotation of left palm
      g_leftPalmAngle = (g_leftPalmAngle + g_stepingAngle) % 360;
      break; 
    case 'x': // 'x' key -> the negative rotation of left palm
      g_leftPalmAngle = (g_leftPalmAngle - g_stepingAngle) % 360;
      break;
    case 'v': // 'v' key -> the positive rotation of left finger1
      if (g_leftFingerAngle < 60.0)  g_leftFingerAngle = (g_leftFingerAngle + g_stepingAngle) % 360;
      break;
    case 'c': // 'c' key -> the nagative rotation of left finger2
      if (g_leftFingerAngle > -60.0) g_leftFingerAngle = (g_leftFingerAngle - g_stepingAngle) % 360;
      break;      
    case 'r': // 'r' key -> x-axis translation
      g_deltaX += g_step;
      break;
    case 't': // 't' key -> y-axis translation
      g_deltaY += g_step;
      break;
    case 'y': // 'y' key -> z-axis translation
      g_deltaZ += g_step;    
      break;
    case 'f': // 'f' key -> right upper arm length increase
      rightUpperArmLength += g_scale_step;
      break;
    case 'g': // 'g' key -> right lower arm length increase 
      rightLowerArmLength += g_scale_step;
      break;
    case 'h': // 'h' key -> left upper arm length increase
      leftUpperArmLength += g_scale_step;
      break;
    case 'j': // 'j' key -> left lower arm length increase
      leftLowerArmLength += g_scale_step;
      break;
    default: return; 
  }
  drawRobot(gl , n , viewProjMatrix , u_MvpMatrix , u_NormalMatrix);
}
