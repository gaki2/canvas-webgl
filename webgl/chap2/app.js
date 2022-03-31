// const { glMatrix } = require("./gl-matrix");

var vertexShaderText = [
  "precision mediump float;",
  "",
  "attribute vec3 vertPosition;",
  "attribute vec3  vertColor;",
  "varying vec3 fragColor;",
  "uniform mat4 mWorld;",
  "uniform mat4 mView;",
  "uniform mat4 mProj;",
  "",
  "void main()",
  "{",
  "  fragColor = vertColor;",
  "  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);",
  "}",
].join("\n");

var fragmentShaderText = [
  "precision mediump float;",
  "",
  "varying vec3 fragColor;",
  "void main()",
  "{",
  "  gl_FragColor = vec4(fragColor, 1.0);",
  "}",
].join("\n");

function init() {
  this.canvas = document.createElement("canvas");
  document.body.appendChild(this.canvas);
  this.gl = this.canvas.getContext("webgl");
  if (!this.gl) {
    console.log("WebGL not supported. failing back on experimental.");
    gl = canvas.getContext("experimental-webgl");
  }
  if (!this.gl) {
    alert("Your browser does not support WebGL");
  }
  this.canvas.width = document.body.clientWidth;
  this.canvas.height = document.body.clientHeight;

  //viewport 는 resize 시 수정해주면됨
  this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  this.gl.clearColor(0.75, 0.85, 0.8, 1.0);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  this.gl.enable(this.gl.DEPTH_TEST);
  this.gl.enable(this.gl.CULL_FACE);
  this.gl.cullFace(this.gl.BACK);
  this.gl.frontFace(this.gl.CCW);
  let vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
  let fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
  this.gl.shaderSource(vertexShader, vertexShaderText);
  this.gl.shaderSource(fragmentShader, fragmentShaderText);

  this.gl.compileShader(vertexShader);
  if (!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)) {
    console.error(
      "ERROR compiling vertex shader!",
      this.gl.getShaderInfoLog(vertexShader)
    );
  }
  this.gl.compileShader(fragmentShader);
  if (!this.gl.getShaderParameter(fragmentShader, this.gl.COMPILE_STATUS)) {
    console.error(
      "ERROR compiling fragment shader",
      this.gl.getShaderInfoLog(fragmentShader)
    );
  }

  this.program = this.gl.createProgram();
  this.gl.attachShader(this.program, vertexShader);
  this.gl.attachShader(this.program, fragmentShader);
  this.gl.linkProgram(this.program);
  if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
    console.error(
      "ERROR linking program!",
      this.gl.getProgramInfoLog(this.program)
    );
  }
  this.gl.validateProgram(this.program);
  if (!this.gl.getProgramParameter(this.program, this.gl.VALIDATE_STATUS)) {
    console.error(
      "ERROR validating program!",
      this.gl.getProgramInfoLog(this.program)
    );
  }

  let boxVertices = [
    // X, Y, Z           R, G, B
    // Top
    -1.0, 1.0, -1.0, 0.5, 0.5, 0.5, -1.0, 1.0, 1.0, 0.5, 0.5, 0.5, 1.0, 1.0,
    1.0, 0.5, 0.5, 0.5, 1.0, 1.0, -1.0, 0.5, 0.5, 0.5,

    // Left
    -1.0, 1.0, 1.0, 0.75, 0.25, 0.5, -1.0, -1.0, 1.0, 0.75, 0.25, 0.5, -1.0,
    -1.0, -1.0, 0.75, 0.25, 0.5, -1.0, 1.0, -1.0, 0.75, 0.25, 0.5,

    // Right
    1.0, 1.0, 1.0, 0.25, 0.25, 0.75, 1.0, -1.0, 1.0, 0.25, 0.25, 0.75, 1.0,
    -1.0, -1.0, 0.25, 0.25, 0.75, 1.0, 1.0, -1.0, 0.25, 0.25, 0.75,

    // Front
    1.0, 1.0, 1.0, 1.0, 0.0, 0.15, 1.0, -1.0, 1.0, 1.0, 0.0, 0.15, -1.0, -1.0,
    1.0, 1.0, 0.0, 0.15, -1.0, 1.0, 1.0, 1.0, 0.0, 0.15,

    // Back
    1.0, 1.0, -1.0, 0.0, 1.0, 0.15, 1.0, -1.0, -1.0, 0.0, 1.0, 0.15, -1.0, -1.0,
    -1.0, 0.0, 1.0, 0.15, -1.0, 1.0, -1.0, 0.0, 1.0, 0.15,

    // Bottom
    -1.0, -1.0, -1.0, 0.5, 0.5, 1.0, -1.0, -1.0, 1.0, 0.5, 0.5, 1.0, 1.0, -1.0,
    1.0, 0.5, 0.5, 1.0, 1.0, -1.0, -1.0, 0.5, 0.5, 1.0,
  ];

  let boxIndices = [
    // Top
    0, 1, 2, 0, 2, 3,

    // Left
    5, 4, 6, 6, 4, 7,

    // Right
    8, 9, 10, 8, 10, 11,

    // Front
    13, 12, 14, 15, 14, 12,

    // Back
    16, 17, 18, 16, 18, 19,

    // Bottom
    21, 20, 22, 22, 20, 23,
  ];

  let boxVertexBufferObject = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, boxVertexBufferObject);
  this.gl.bufferData(
    this.gl.ARRAY_BUFFER,
    new Float32Array(boxVertices),
    this.gl.STATIC_DRAW
  );

  let boxIndexBufferObject = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
  this.gl.bufferData(
    this.gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(boxIndices),
    this.gl.STATIC_DRAW
  );

  let positionAttribLocation = this.gl.getAttribLocation(
    this.program,
    "vertPosition"
  );
  let colorAttribLocation = this.gl.getAttribLocation(
    this.program,
    "vertColor"
  );

  this.gl.vertexAttribPointer(
    positionAttribLocation,
    3,
    this.gl.FLOAT,
    this.gl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT,
    0
  );
  this.gl.vertexAttribPointer(
    colorAttribLocation,
    3,
    this.gl.FLOAT,
    this.gl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT,
    3 * Float32Array.BYTES_PER_ELEMENT
  );

  this.gl.enableVertexAttribArray(positionAttribLocation);
  this.gl.enableVertexAttribArray(colorAttribLocation);
  this.gl.useProgram(this.program);

  let matWorldUniformLocation = this.gl.getUniformLocation(
    this.program,
    "mWorld"
  );
  let matViewUniformLocation = this.gl.getUniformLocation(
    this.program,
    "mView"
  );
  let matProjUniformLocation = this.gl.getUniformLocation(
    this.program,
    "mProj"
  );

  let worldMatrix = new Float32Array(16);
  let viewMatrix = new Float32Array(16);
  let projMatrix = new Float32Array(16);
  glMatrix.mat4.identity(worldMatrix);
  glMatrix.mat4.lookAt(viewMatrix, [0, 0, -9], [0, 0, 0], [0, 1, 0]);
  glMatrix.mat4.perspective(
    projMatrix,
    glMatrix.glMatrix.toRadian(45),
    this.canvas.width / this.canvas.height,
    0.1,
    10
  );

  let xRotationMatrix = new Float32Array(16);
  let yRotationMatrix = new Float32Array(16);

  this.gl.uniformMatrix4fv(matWorldUniformLocation, this.gl.FALSE, worldMatrix);
  this.gl.uniformMatrix4fv(matViewUniformLocation, this.gl.FALSE, viewMatrix);
  this.gl.uniformMatrix4fv(matProjUniformLocation, this.gl.FALSE, projMatrix);
  // main render

  let angle = 0;
  let identityMatrix = new Float32Array(16);
  glMatrix.mat4.identity(identityMatrix);
  let loop = function () {
    angle = (performance.now() / 1000 / 6) * 2 * Math.PI;
    glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle, [1, 0, 0]);
    glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle / 2, [0, 1, 0]);
    glMatrix.mat4.mul(worldMatrix, xRotationMatrix, yRotationMatrix);
    this.gl.uniformMatrix4fv(
      matWorldUniformLocation,
      this.gl.FALSE,
      worldMatrix
    );

    this.gl.clearColor(0.75, 0.85, 0.8, 1.0);
    this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
    this.gl.drawElements(
      this.gl.TRIANGLES,
      boxIndices.length,
      this.gl.UNSIGNED_SHORT,
      0
    );
    requestAnimationFrame(loop.bind(this));
  };

  requestAnimationFrame(loop.bind(this));
}

window.onload = () => {
  new init();
};
