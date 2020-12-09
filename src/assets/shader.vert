attribute vec4 a_position;
attribute vec3 a_normal;

uniform mat4 u_matrix;
uniform float u_fudgeFactor;

varying vec3 v_normal;

void main() {
    vec4 position = u_matrix * a_position;
    
    // 设置fudge因子
    float zToDivideBy = 1.0 + position.z * u_fudgeFactor;
    gl_Position = vec4(position.xyz, zToDivideBy);

    v_normal = a_normal;
}