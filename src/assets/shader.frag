precision mediump float;

varying vec3 v_normal;

// 光的反向方向
uniform vec3 u_reverseLightDirection;
// 光的颜色
uniform vec4 u_color;

void main() {
    // 由于 v_normal 是插值出来的，和有可能不是单位向量
    // 可以用 normalize 将其单位化
    vec3 normal = normalize(v_normal);

    // 算出像素顶点法线方向和光射线夹角余弦值
    float cosVal = dot(normal, u_reverseLightDirection);
    // 定义每个像素的颜色值为光照颜色与cosVal的乘积
    gl_FragColor = vec4(u_color.rgb * cosVal, 1);
}