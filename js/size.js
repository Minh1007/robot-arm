function drawscene(gl){
    resize(gl.canvas);
    gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
}

function resize(canvas){
  var displayWidth  = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;
  if (canvas.width  != displayWidth || canvas.height != displayHeight) {  
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
}