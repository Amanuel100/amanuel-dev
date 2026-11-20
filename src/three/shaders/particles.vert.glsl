uniform float uTime;
uniform float uPixelRatio;
attribute float aSize;
varying float vMix;
void main(){
  vec3 p=position;p.x+=sin(uTime*0.08+position.y)*0.1;p.y+=cos(uTime*0.06+position.x)*0.12;
  vec4 mv=modelViewMatrix*vec4(p,1.0);
  gl_Position=projectionMatrix*mv;gl_PointSize=clamp(aSize*uPixelRatio*(8.0/max(1.0,-mv.z)),1.0,5.0);
  vMix=fract(position.x*0.31+position.z*0.17);
}
