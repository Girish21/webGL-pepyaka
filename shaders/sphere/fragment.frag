uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vColor;

void main() {
  vec3 skyColor = vec3(1., 1., .547);
  vec3 groundColor = vec3(.562, .275, .111);
  vec3 light = vec3(0.);
  vec3 lightDirection = normalize(vec3(0., -1., -1.));

  light = mix(skyColor, groundColor, dot(lightDirection, vNormal));

  gl_FragColor = vec4(vColor * light, 1.);
}
