varying float vMix;
void main(){float distanceToCenter=length(gl_PointCoord-0.5);float alpha=1.0-smoothstep(0.05,0.5,distanceToCenter);if(alpha<0.01)discard;gl_FragColor=vec4(mix(vec3(0.486,0.227,0.929),vec3(0.133,0.827,0.933),vMix),alpha*0.55);}
