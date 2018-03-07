precision mediump float; // It is required to set a floating point precision in all fragment shaders.

// Interpolated values from vertex shader
varying vec3 normalInterp; // Normal
varying vec3 vertPos; // Vertex position
varying vec3 viewVec; // Interpolated view vector

// uniform values remain the same across the scene
uniform float Ka;   // Ambient reflection coefficient
uniform float Kd;   // Diffuse reflection coefficient
uniform float Ks;   // Specular reflection coefficient
uniform float shininessVal; // Shininess

// Material color
uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;

uniform vec3 lightPos; // Light position in camera space

// HINT: Use the built-in variable gl_FragCoord to get the screen-space coordinates

void main() {
  // Your solution should go here.
  // Only the background color calculations have been provided as an example.
  vec3 normal = normalize(normalInterp);
  vec3 lightVec = normalize(lightPos - vertPos);
  vec3 viewVec = normalize(-vertPos);

  float lambertCoeff = dot(lightVec, normal);
  if(lambertCoeff < 0.0) {
  	lambertCoeff = 0.0;
  }

  vec3 ambientLight = ambientColor * vec3(Ka);
  vec3 diffuseLight = diffuseColor * vec3(Kd) ;
  vec3 size = vec3(lambertCoeff);

  vec3 refVec = vec3(2.0) * vec3(dot(lightVec, normal)) * normal - lightVec;

  float rDotV = dot(refVec, viewVec);
  if(rDotV < 0.0) {
  	rDotV = 0.0;
  }

  vec3 specularLight = vec3(Ks) * vec3(pow(rDotV, shininessVal)) * specularColor;



  vec2 coords = vec2(gl_FragCoord.xy);
  vec3 black = vec3(0.0, 0.0, 0.0);
  float frequency = 0.12;
  vec2 nearest = 2.0*fract(frequency * coords) - 1.0;
  float dist = length(nearest);
  float radius = 1.2 - length( 0.7*lambertCoeff - black) * 0.9;
  gl_FragColor = vec4(mix(black, ambientLight + diffuseLight, step(radius, dist)), 1.0);
}
