uniform float uTime;
uniform float uTimeOffset;
uniform vec2 uResolution;
uniform float uNoiseScale;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uBorderRadius;
varying vec2 vUv;
#pragma glslify: snoise3D = require('./utils/snoise3D.glsl')
#pragma glslify: snoise4D = require('./utils/snoise4D.glsl')

const float PI = 3.14159265359;

void main(){
  vec2 aspect = uResolution / max(uResolution.x, uResolution.y);
  float time = uTime;
  vec2 st = vUv;
  st -= -0.5;
  st *= aspect;
  st *= mix(0.5,0.7, uNoiseScale);
  st += 0.5;

  float loopedTimeX = cos(time * PI * 2.0 + uTimeOffset);
  float loopedTimeY = sin(time * PI * 2.0 + uTimeOffset);

  float colorFactor = snoise3D(vec3(st, loopedTimeY + loopedTimeX)) * 0.5 + 0.5;
  vec3 color = mix(uColor1, uColor2, colorFactor);

  vec2 alphaUv = vUv - 0.5;
  float borderRadius = min(uBorderRadius, min(uResolution.x, uResolution.y) * 0.5);
  vec2 offset = vec2(borderRadius) / uResolution;
  vec2 alphaXY = smoothstep(vec2(0.5 - offset), vec2(0.5 - offset - 0.001), abs(alphaUv));
  float alpha = min(1.0, alphaXY.x + alphaXY.y);

  vec2 alphaUv2 = abs(vUv - 0.5);
  float radius = borderRadius / max(uResolution.x, uResolution.y);
  alphaUv2 = (alphaUv2 - 0.5) * aspect + radius;
  float roundAlpha = smoothstep(radius + 0.001, radius, length(alphaUv2));

  alpha = min(1.0, alpha + roundAlpha);

  gl_FragColor = vec4(color, alpha);
}