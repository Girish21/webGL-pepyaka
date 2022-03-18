uniform float uTime;

void main() {
  vec3 p = position;
  p.y += .1 * (sin(p.y * 10. + uTime * 5.) * .5 + .5);
  p.z += .05 * (sin(p.z * 10. + uTime) * .5 + .5);

  vec4 mvMatrix = modelViewMatrix * vec4(p, 1.);

  gl_PointSize = 10. * (1. / -mvMatrix.z);
  gl_Position = projectionMatrix * mvMatrix;
}
