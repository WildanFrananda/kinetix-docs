import { GLSL_TURN, glslPose } from "./gl_layer";

const INK_HELPERS = `
uniform float uLight;
vec4 over(vec4 top,vec4 under){return top+under*(1.-top.a);}
vec4 inkFor(vec3 seen,float cover){vec3 absorbed=1.-seen;float a=max(max(absorbed.r,max(absorbed.g,absorbed.b)),cover);return vec4(vec3(a)-absorbed,a);}
vec4 finish(vec4 ink,vec2 frag){ink.rgb=min(ink.rgb,vec3(ink.a));float n=(hash12(frag)-.5)/255.*smoothstep(0.,1.5/255.,ink.a);return clamp(ink+vec4(n),0.,1.);}
`;

function buildBackFragment(plateZ: number): string {
  return `${glslPose("Dial")}
${INK_HELPERS}
uniform vec3 uAccent;
uniform vec2 uPortXY[4];
uniform vec2 uPipeStart[4];
uniform float uActivePort;
uniform float uLockFrac;
uniform float uOn;
const float PLATE_Z = ${plateZ.toFixed(3)};
void main(){
  vec2 vb = viewOf(gl_FragCoord.xy);
  vec3 p = onFloor(vb, PLATE_Z);
  float distCenter = length(p.xy);
  vec3 q = toDial(p);
  float ptrAng = atan(q.y, q.x);
  float sectorMask = exp(-abs(ptrAng) * 2.2) * smoothstep(32.5, 36.0, distCenter) * (1.0 - smoothstep(42.0, 56.0, distCenter));

  float traceSum = 0.0;
  float travelSum = 0.0;
  for(int i = 0; i < 4; i++){
    vec2 a = uPipeStart[i];
    vec2 b = uPortXY[i];
    vec2 ab = b - a;
    float l2 = max(dot(ab, ab), 1e-4);
    float t = clamp(dot(p.xy - a, ab) / l2, 0.0, 1.0);
    float d = length(p.xy - a - ab * t);
    float sel = 1.0 - smoothstep(0.0, 0.6, abs(uActivePort - float(i)));
    float groove = (1.0 - smoothstep(0.6, 2.2, d)) * (0.25 + 0.75 * sel);
    float wave = exp(-pow(fract(t - uTime * 0.85) - 0.5, 2.0) * 32.0) * sel * groove;
    traceSum = max(traceSum, groove);
    travelSum = max(travelSum, wave);
  }

  vec2 luv = clamp((p.xy - vec2(40.0, 29.0)) / vec2(26.0, 18.0), -1.0, 1.0);
  float lockGlow = (1.0 - smoothstep(0.2, 1.0, length(luv))) * uLockFrac;

  float darkEmit = clamp(sectorMask * 0.42 + traceSum * 0.35 + travelSum * 0.75 + lockGlow * 0.48, 0.0, 1.0);
  vec3 dCol = mix(uAccent, vec3(1.0, 0.84, 0.62), travelSum * 0.65) * darkEmit;
  vec4 dark = vec4(dCol, darkEmit * 0.88);

  float cavityMask = max(traceSum, lockGlow * 0.85);
  vec3 lightPigment = mix(vec3(0.86, 0.84, 0.80), mix(vec3(0.76, 0.25, 0.05), vec3(0.96, 0.46, 0.16), travelSum), clamp(traceSum * 0.65 + travelSum + lockGlow * 0.5, 0.0, 1.0));
  vec4 light = inkFor(mix(vec3(1.0), lightPigment, clamp(cavityMask * 0.82, 0.0, 1.0)), 0.0);

  gl_FragColor = finish(mix(dark, light, uLight) * uOn, gl_FragCoord.xy);
}`;
}

const FRONT_FRAG = `${GLSL_TURN}
${INK_HELPERS}
uniform vec3 uAccent;
uniform vec2 uReticleVb;
uniform float uReticleR;
uniform float uReticleFace;
uniform vec2 uPortVb;
uniform float uPortR;
uniform vec2 uVaultVb;
uniform float uLockFrac;
uniform float uLockPulse;
uniform float uOn;
uniform vec4 uSpark[18];
uniform float uSparkHeat[18];

vec4 lensGlow(vec2 vb, vec2 center, float radius, vec3 hue, float strength) {
  float px = uView.x / uCanvas.x;
  float d = length(vb - center);
  float body = 1.0 - smoothstep(radius - 0.6 * px, radius + 0.6 * px, d);
  float core = 1.0 - smoothstep(radius * 0.25, radius * 0.58 + 0.5 * px, d);
  vec3 seen = mix(hue * 0.72, vec3(1.0, 0.94, 0.86), core);
  vec4 lightLens = inkFor(seen, 0.9) * body * strength;
  vec3 darkHue = mix(hue, vec3(1.0, 0.92, 0.82), core) * body * strength;
  vec4 darkLens = vec4(darkHue, body * strength);
  return mix(darkLens, lightLens, uLight);
}

void main(){
  vec2 vb = viewOf(gl_FragCoord.xy);
  float px = uView.x / uCanvas.x;
  float soft = 0.7 * px;

  vec4 ret = lensGlow(vb, uReticleVb, uReticleR, uAccent, smoothstep(0.02, 0.3, uReticleFace));
  vec4 port = lensGlow(vb, uPortVb, uPortR, uAccent, 0.88 + 0.12 * sin(uTime * 3.5));
  vec4 vault = lensGlow(vb, uVaultVb, uPortR * 1.9, vec3(0.95, 0.42, 0.14), 0.35 + 0.65 * uLockFrac + 0.35 * uLockPulse);

  vec4 sparks = vec4(0.0);
  float w = max(0.35 + 0.6 * px, 1.2 * px);
  for(int i = 0; i < 18; i++){
    float heat = uSparkHeat[i];
    if(heat <= 0.0) continue;
    vec4 s = uSpark[i];
    vec2 a = s.zw;
    vec2 b = s.xy;
    vec2 ab = b - a;
    float l2 = max(dot(ab, ab), 1e-6);
    float t = clamp(dot(vb - a, ab) / l2, 0.0, 1.0);
    float dist = length(vb - a - ab * t);
    float cover = 1.0 - smoothstep(w * 0.5 - 0.5 * px, w * 0.5 + 0.5 * px, dist);
    if(cover <= 0.0) continue;
    float alpha = 0.86 * smoothstep(0.0, 0.3, t) * smoothstep(0.12, 0.45, heat) * cover;
    vec3 col = mix(uAccent, vec3(1.0, 0.92, 0.74), t * heat);
    sparks = over(vec4(col * alpha, alpha), sparks);
  }

  vec4 combined = over(sparks, over(port, over(vault, ret)));
  vec4 masked = combined * (1.0 - coverOf(vb, soft));
  gl_FragColor = finish(masked * uOn, gl_FragCoord.xy);
}`;

export { FRONT_FRAG, buildBackFragment };
