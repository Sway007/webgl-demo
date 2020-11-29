attribute vec4 a_position;
attribute vec4 a_color;

uniform mat4 u_matrix;
uniform float u_fudgeFactor;

varying vec4 v_color;

void main() {
    vec4 position = u_matrix * a_position;
    gl_Position = position;
    
    // 设置fudge因子
    // float zToDivideBy = 1.0 + position.z * u_fudgeFactor;
    // gl_Position = vec4(position.xyz, zToDivideBy);

    v_color = a_color;

    // 颜色加入位置因子
    // v_color = vec4(gl_Position.xyz * 0.5 + 0.5, 1);
}