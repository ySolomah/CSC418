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

void main() {
  // Your solution should go here.
  // Only the ambient colour calculations have been provided as an example.
  vec3 normal = normalize(normalInterp);
  vec3 lightVec = normalize(lightPos - vertPos);
  vec3 viewVec = normalize( - vertPos);

  float lambertCoeff = dot(lightVec, normal);
  if(lambertCoeff < 0.0) {
  	lambertCoeff = 0.0;
  }

  vec3 ambientLight = ambientColor * vec3(Ka);
  vec3 diffuseLight = diffuseColor * vec3(Kd) * vec3(lambertCoeff);

  vec3 refVec = vec3(2.0) * vec3(dot(lightVec, normal)) * normal - lightVec;

  float rDotV = dot(refVec, viewVec);
  if(rDotV < 0.0) {
  	rDotV = 0.0;
  }

  vec3 specularLight = vec3(Ks) * vec3(pow(rDotV, shininessVal)) * specularColor;

  //gl_FragColor = vec4(ambientColor, 1.0);
  gl_FragColor = vec4(ambientLight + diffuseLight + specularLight, 1.0);
}
