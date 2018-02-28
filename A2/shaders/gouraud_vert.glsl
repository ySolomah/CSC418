attribute vec3 position; // Given vertex position in object space
attribute vec3 normal; // Given vertex normal in object space
attribute vec3 worldPosition; // Given vertex position in world space

uniform mat4 projection, modelview, normalMat; // Given scene transformation matrices
uniform vec3 eyePos;	// Given position of the camera/eye/viewer

// These will be given to the fragment shader and interpolated automatically
varying vec3 normalInterp; // Normal
varying vec3 vertPos; // Vertex position
varying vec3 viewVec; // Vector from the eye to the vertex
varying vec4 color;

uniform float Ka;   // Ambient reflection coefficient
uniform float Kd;   // Diffuse reflection coefficient
uniform float Ks;   // Specular reflection coefficient
uniform float shininessVal; // Shininess

// Material color
uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;
uniform vec3 lightPos; // Light position in camera space

varying vec3 light;

void main(){
  // Your solution should go here.
  // Only the ambient colour calculations have been provided as an example.

  vec3 worldNormal = normalize(mat3(normalMat) * normal);

  vec4 vertPos4 = modelview * vec4(position, 1.0);
  vertPos = vec3(vertPos4);


  vec3 lightVec = normalize(lightPos - vertPos);
  vec3 viewVec = normalize(eyePos - vertPos);

  float lambertCoeff = dot(lightVec, worldNormal);
  if(lambertCoeff < 0.0) {
  	lambertCoeff = 0.0;
  }

  vec3 ambientLight = ambientColor * vec3(Ka);
  vec3 diffusiveLight = vec3(Kd) * diffuseColor * vec3(lambertCoeff);
  vec3 specularLight = vec3(0.0);

  if(lambertCoeff > 0.0) {

  	vec3 reflectionVec = -normalize(reflect(lightVec, worldNormal));
  	float cosPhi = dot(reflectionVec, viewVec);
  	if(cosPhi < 0.0) {
  		cosPhi = 0.0;
  	}
  	specularLight = vec3(Ks) * specularColor * pow(cosPhi, shininessVal);
  }
  gl_Position = projection * vertPos4;
  light = ambientLight + diffusiveLight + specularLight;
}