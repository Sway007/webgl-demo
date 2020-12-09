import "./App.scss";

import React, { useEffect } from "react";
import {
  createShader,
  createProgram,
  setGeometry,
  setNormals,
} from "./utils/webgl-utils";
import { m4 } from "./utils/matrix";
import sourceShaderVertex from "./assets/shader.vert";
import sourceShaderFrag from "./assets/shader.frag";
import Slider from "@material-ui/core/Slider";

const canvasSize = [500, 500];

function App() {
  let gl: WebGLRenderingContext | null;
  let program: WebGLProgram | null;
  let positionBuffer: WebGLBuffer | null;
  let normalBuffer: WebGLBuffer | null;

  const translate = [170, 150, 0],
    rotation = [0, 0, 0],
    rotationCur = rotation.slice(),
    scale = [1, 1, 1];

  let matrixRotationAcc = m4.createRotationX(0);

  const init = (gl: WebGLRenderingContext) => {
    const shaderVertex = createShader(gl, gl.VERTEX_SHADER, sourceShaderVertex);
    const shaderFrag = createShader(gl, gl.FRAGMENT_SHADER, sourceShaderFrag);
    if (!shaderVertex || !shaderFrag) return;
    program = createProgram(gl, shaderVertex, shaderFrag);
    gl.useProgram(program);
    // debugger

    gl.clear(gl.COLOR_BUFFER_BIT); // 清空颜色缓冲区
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height); // 设置ClipSpace到设备(Canvas)坐标空间的映射范围

    positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setGeometry(gl);

    normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    setNormals(gl);

    console.log("init");
  };

  const getMatrix = (): number[] => {
    const matrixScale = m4.createScaleMatrix(scale[0], scale[1], scale[2]);
    const matrixRotation = m4.multipleArr([
      m4.createRotationX(rotation[0]),
      m4.createRotationY(rotation[1]),
      m4.createRotationZ(rotation[2]),
      matrixRotationAcc,
    ]);
    const matrixTranslate = m4.createTranslateMatrix(
      translate[0],
      translate[1],
      translate[2]
    );
    const ms = [
      matrixScale,
      matrixRotation,
      matrixTranslate,
      m4.projection(canvasSize[0], canvasSize[1], 400),
    ];
    return m4.multipleArr(ms);
  };

  const draw = () => {
    // debugger
    if (!program || !gl) return;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const normalLocation = gl.getAttribLocation(program, "a_normal");
    const matrixLocation = gl.getUniformLocation(program, "u_matrix");
    const fudgeLocation = gl.getUniformLocation(program, "u_fudgeFactor");
    const colorLocation = gl.getUniformLocation(program, "u_color");
    const reverseLightDirection = gl.getUniformLocation(
      program,
      "u_reverseLightDirection"
    );

    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    let size = 3,
      type = gl.FLOAT,
      normalize = false,
      stride = 0,
      offset = 0;
    gl.vertexAttribPointer(
      positionLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    gl.enableVertexAttribArray(normalLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    type = gl.FLOAT;
    normalize = false;
    gl.vertexAttribPointer(
      normalLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    const translateMatrix = getMatrix();
    // 为全局变量u_*赋值
    gl.uniformMatrix4fv(matrixLocation, false, translateMatrix);
    gl.uniform1f(fudgeLocation, 2);
    gl.uniform4fv(colorLocation, [0.2, 1, 0.2, 1]); // 光照颜色
    gl.uniform3fv(reverseLightDirection, m4.normalize([0.5, 0.7, 1]));
    const primitiveType = gl.TRIANGLES;
    gl.drawArrays(primitiveType, 0, 16 * 6);
  };

  useEffect(() => {
    if (!gl) {
      const canvas = document.getElementById("canvas") as HTMLCanvasElement;
      gl = canvas?.getContext("webgl") || null;
    }
    if (!gl) return;
    init(gl);
    draw();
    console.log("update component!");
  });

  const updateState = (
    arr: number[], // 变换的种类
    idx: number, // 变换的维度
    e: any,
    v: number | number[]
  ) => {
    if (Array.isArray(v)) return;
    if (arr === rotationCur) {
      const offset = v - rotationCur[idx];
      // console.log(offset)
      let m: number[];
      if (idx === 0) m = m4.createRotationX(offset);
      else if (idx === 1) m = m4.createRotationY(offset);
      else m = m4.createRotationZ(offset);
      matrixRotationAcc = m4.multiply(matrixRotationAcc, m);
    }
    arr[idx] = v;
    draw();
  };

  return (
    <div>
      <h1>WebGL测试</h1>
      <div
        style={{
          width: canvasSize[0],
          height: canvasSize[1],
          position: "relative",
        }}
      >
        <div className="slider-box">
          translate-x
          <Slider
            className="slider"
            max={canvasSize[0]}
            min={-100}
            valueLabelDisplay="on"
            getAriaValueText={(v) => `${v}`}
            defaultValue={translate[0]}
            onChange={updateState.bind(null, translate, 0)}
          />
          translate-y
          <Slider
            className="slider"
            max={canvasSize[1]}
            min={-200}
            valueLabelDisplay="on"
            getAriaValueText={(v) => `${v}`}
            defaultValue={translate[1]}
            onChange={updateState.bind(null, translate, 1)}
          />
          translate-z
          <Slider
            className="slider"
            max={canvasSize[1]}
            min={-300}
            step={1}
            valueLabelDisplay="on"
            getAriaValueText={(v) => `${v}`}
            defaultValue={translate[2]}
            onChange={updateState.bind(null, translate, 2)}
          />
          rotation-x
          <Slider
            className="slider"
            max={360}
            min={0}
            valueLabelDisplay="on"
            getAriaValueText={(v) => `${v}`}
            defaultValue={0}
            onChange={updateState.bind(null, rotationCur, 0)}
          />
          rotation-y
          <Slider
            className="slider"
            max={360}
            min={0}
            valueLabelDisplay="on"
            getAriaValueText={(v) => `${v}`}
            defaultValue={0}
            onChange={updateState.bind(null, rotationCur, 1)}
          />
          rotation-z
          <Slider
            className="slider"
            max={360}
            min={0}
            valueLabelDisplay="on"
            getAriaValueText={(v) => `${v}`}
            defaultValue={0}
            onChange={updateState.bind(null, rotationCur, 2)}
          />
          scale-x
          <Slider
            className="slider"
            max={3}
            min={-1}
            step={0.05}
            valueLabelDisplay="on"
            getAriaValueText={(v) => `${v}`}
            defaultValue={1}
            onChange={updateState.bind(null, scale, 0)}
          />
          scale-y
          <Slider
            className="slider"
            max={3}
            min={-1}
            step={0.05}
            valueLabelDisplay="on"
            getAriaValueText={(v) => `${v}`}
            defaultValue={1}
            onChange={updateState.bind(null, scale, 1)}
          />
          scale-z
          <Slider
            className="slider"
            max={3}
            min={-1}
            step={0.05}
            valueLabelDisplay="on"
            getAriaValueText={(v) => `${v}`}
            defaultValue={1}
            onChange={updateState.bind(null, scale, 2)}
          />
        </div>
        <canvas
          style={{ border: "5px solid red" }}
          width={canvasSize[0]}
          height={canvasSize[1]}
          id="canvas"
        ></canvas>
      </div>
    </div>
  );
}

export default App;
