var vertexShaderText = [
  "precision mediump float;",
  "",
  "attribute vec2 vertPosition;",
  "attribute vec3 vertColor;",
  "varying vec3 fragColor;",
  "",
  "void main()",
  "{",
  "  fragColor = vertColor;",
  "  gl_Position = vec4(vertPosition, 0.0, 1.0);",
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

  let triangleVertices = [
    // X, Y R G B
    0.0, 0.5, 1.0, 1.0, 0.0, -0.5, -0.5, 0.7, 0.0, 1.0, 0.5, -0.5, 0.1, 1.0,
    0.6,
  ];
  let triangleVertexBufferObject = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, triangleVertexBufferObject);
  this.gl.bufferData(
    this.gl.ARRAY_BUFFER,
    new Float32Array(triangleVertices),
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
    2,
    this.gl.FLOAT,
    this.gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT,
    0
  );
  this.gl.vertexAttribPointer(
    colorAttribLocation,
    3,
    this.gl.FLOAT,
    this.gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT,
    2 * Float32Array.BYTES_PER_ELEMENT
  );

  this.gl.enableVertexAttribArray(positionAttribLocation);
  this.gl.enableVertexAttribArray(colorAttribLocation);
  // main render
  this.gl.useProgram(this.program);
  this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
}

class App {
  constructor() {
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
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();

    this.gl.clearColor(0.75, 0.85, 0.8, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
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

    let triangleVertices = [
      // X, Y R G B
      0.0, 0.5, 1.0, 1.0, 0.0, -0.5, -0.5, 0.7, 0.0, 1.0, 0.5, -0.5, 0.1, 1.0,
      0.6,
    ];
    let triangleVertexBufferObject = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, triangleVertexBufferObject);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(triangleVertices),
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
      2,
      this.gl.FLOAT,
      this.gl.FALSE,
      5 * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    this.gl.vertexAttribPointer(
      colorAttribLocation,
      3,
      this.gl.FLOAT,
      this.gl.FALSE,
      5 * Float32Array.BYTES_PER_ELEMENT,
      2 * Float32Array.BYTES_PER_ELEMENT
    );

    this.gl.enableVertexAttribArray(positionAttribLocation);
    this.gl.enableVertexAttribArray(colorAttribLocation);
    // main render
    this.gl.useProgram(this.program);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;
    this.gl.viewport(0, 0, this.stageWidth, this.stageHeight);
  }

  vertexShader(vertPosition, vertColor) {
    return {
      fragColor: vertColor,
      gl_Position: [vertPosition.x, vertPosition.y, 0.0, 1.0],
    };
  }
}

window.onload = () => {
  new init();
};
