var viewProjMatrix = new Matrix4();
var u_MvpMatrix = null;
var u_NormalMatrix = null;
var n = 2;
var gl = null;

function main() {
  var canvas = document.getElementById('webgl');  
  gl = getGL3DContext(canvas);
  if (!gl) return;  
  
  if (!initShadersProgram(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE)) return;
  n = initVertexBuffers(gl);
  
  if (n < 0) return;
  
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  //gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
  gl.enable(gl.DEPTH_TEST);

  u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if (!u_MvpMatrix || !u_NormalMatrix) return;
  
  viewProjMatrix.setPerspective(50.0, canvas.width / canvas.height, 1.0, 100.0);
  //eyepoint pos set
  viewProjMatrix.lookAt(20.0, 20.0, 30.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);

  // Register a keydown event handler to be called on key pressed
  document.onkeydown = function(ev){ 
    on_keydown(ev);
  };
  drawscene(gl);
  // draw a robot
  drawRobot();
}
