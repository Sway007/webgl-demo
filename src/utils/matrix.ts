interface SinCosPair {
    sin: number,
    cos: number
};

type position3 = [number, number, number];

const getTriangleVal = (angle: number): SinCosPair => {
    const radius = Math.PI * angle/180
    return {
        sin: Math.sin(radius),
        cos: Math.cos(radius)
    }
}

const m3 = {
    multiple (b: number[], a: number[]) {
        var a00 = a[0 * 3 + 0];
        var a01 = a[0 * 3 + 1];
        var a02 = a[0 * 3 + 2];
        var a10 = a[1 * 3 + 0];
        var a11 = a[1 * 3 + 1];
        var a12 = a[1 * 3 + 2];
        var a20 = a[2 * 3 + 0];
        var a21 = a[2 * 3 + 1];
        var a22 = a[2 * 3 + 2];
        var b00 = b[0 * 3 + 0];
        var b01 = b[0 * 3 + 1];
        var b02 = b[0 * 3 + 2];
        var b10 = b[1 * 3 + 0];
        var b11 = b[1 * 3 + 1];
        var b12 = b[1 * 3 + 2];
        var b20 = b[2 * 3 + 0];
        var b21 = b[2 * 3 + 1];
        var b22 = b[2 * 3 + 2];

        return [
            b00 * a00 + b01 * a10 + b02 * a20,
            b00 * a01 + b01 * a11 + b02 * a21,
            b00 * a02 + b01 * a12 + b02 * a22,
            b10 * a00 + b11 * a10 + b12 * a20,
            b10 * a01 + b11 * a11 + b12 * a21,
            b10 * a02 + b11 * a12 + b12 * a22,
            b20 * a00 + b21 * a10 + b22 * a20,
            b20 * a01 + b21 * a11 + b22 * a21,
            b20 * a02 + b21 * a12 + b22 * a22,
        ];
    },
    
    multipleArr (ms: number[][]) {
        return ms.reduce((pre, cur) => this.multiple(pre, cur))
    },

    createRotationMatrix (angle: number) {
        const {cos, sin} = getTriangleVal(angle)
        return [
            cos, sin, 0,
            -sin, cos, 0,
            0, 0, 1
        ]
    },
    
    createTranslateMatrix:  (x: number, y: number) => [
        1, 0, 0,
        0, 1, 0,
        x, y, 1
    ],

    createScaleMatrix: (scaleX: number, scaleY: number) => [
        scaleX, 0, 0,
        0, scaleY, 0,
        0, 0, 1
    ]
}

const m4 = {
    createTranslateMatrix: (x: number, y: number, z: number) => [
        1, 0, 0, 0,
        0, 1, 0, 0, 
        0, 0, 1, 0, 
        x, y, z, 1,
    ],

    

    createRotationX (angle: number) {
        const {cos: c, sin: s} = getTriangleVal(angle)
        return [
            1, 0, 0, 0, 
            0, c, s, 0,
            0, -s, c, 0, 
            0, 0, 0, 1
        ]
    },

    createRotationY (angle: number) {
        const {cos: c, sin: s} = getTriangleVal(angle)
        return [
            c, 0, s, 0,
            0, 1, 0, 0,
            -s, 0, c, 0, 
            0, 0, 0, 1
        ]
    },

    createRotationZ (angle: number) {
        const {cos: c, sin: s} = getTriangleVal(angle)
        return [
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0, 
            0, 0, 0, 1
        ]
    },

    createScaleMatrix: (scaleX: number, scaleY: number, scaleZ: number) => [
        scaleX, 0, 0, 0,
        0, scaleY, 0, 0,
        0, 0, scaleZ, 0,
        0, 0, 0, 1
    ],

    projection: (width: number, height: number, depth: number) => [
        2/width, 0, 0, 0,
        0, -2/height, 0, 0,
        0, 0, 2/depth, 0,
        -1, 1, 0, 1
    ],
    
    normalize: (v: position3): position3 => {
        const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2])
        if (length > 0.0001) {
            return [
                v[0] / length,
                v[1] / length,
                v[2] / length
            ]
        } else {
            return v
        }
    },

    multiply: function(b: number[], a: number[]) {
        var b00 = b[0 * 4 + 0];
        var b01 = b[0 * 4 + 1];
        var b02 = b[0 * 4 + 2];
        var b03 = b[0 * 4 + 3];
        var b10 = b[1 * 4 + 0];
        var b11 = b[1 * 4 + 1];
        var b12 = b[1 * 4 + 2];
        var b13 = b[1 * 4 + 3];
        var b20 = b[2 * 4 + 0];
        var b21 = b[2 * 4 + 1];
        var b22 = b[2 * 4 + 2];
        var b23 = b[2 * 4 + 3];
        var b30 = b[3 * 4 + 0];
        var b31 = b[3 * 4 + 1];
        var b32 = b[3 * 4 + 2];
        var b33 = b[3 * 4 + 3];
        var a00 = a[0 * 4 + 0];
        var a01 = a[0 * 4 + 1];
        var a02 = a[0 * 4 + 2];
        var a03 = a[0 * 4 + 3];
        var a10 = a[1 * 4 + 0];
        var a11 = a[1 * 4 + 1];
        var a12 = a[1 * 4 + 2];
        var a13 = a[1 * 4 + 3];
        var a20 = a[2 * 4 + 0];
        var a21 = a[2 * 4 + 1];
        var a22 = a[2 * 4 + 2];
        var a23 = a[2 * 4 + 3];
        var a30 = a[3 * 4 + 0];
        var a31 = a[3 * 4 + 1];
        var a32 = a[3 * 4 + 2];
        var a33 = a[3 * 4 + 3];
     
        return [
          b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
          b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
          b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
          b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
          b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
          b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
          b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
          b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
          b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
          b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
          b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
          b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
          b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
          b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
          b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
          b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ];
      },

    multipleArr (ms: number[][]) {
        return ms.reduce((pre, cur) => this.multiply(pre, cur))
    }
}

export { m3, m4 }