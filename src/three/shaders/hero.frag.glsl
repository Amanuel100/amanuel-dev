uniform float uTime;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying float vNoise;
void main(){
  vec3 n=normalize(vNormal);vec3 viewDir=normalize(vViewPosition);
  float rim=pow(1.0-max(dot(n,viewDir),0.0),2.2);
  vec3 violet=vec3(0.486,0.227,0.929);vec3 cyan=vec3(0.133,0.827,0.933);
  float band=0.5+0.5*sin(vNoise*7.0+n.y*6.0+uTime*0.12);
  vec3 iridescent=mix(violet,cyan,smoothstep(0.1,0.9,band));
  float light=max(dot(n,normalize(vec3(-0.4,0.8,1.0))),0.0);
  vec3 color=vec3(0.018,0.019,0.04)+iridescent*(0.15+light*0.7+rim*1.8);
  float sheen=pow(max(dot(reflect(-normalize(vec3(-1.0,1.0,2.0)),n),viewDir),0.0),30.0);
  color+=vec3(0.6,0.85,1.0)*sheen*0.7;
  gl_FragColor=vec4(color,1.0);
}
