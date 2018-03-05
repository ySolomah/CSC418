// Fragment shader template for the bonus question

precision mediump float; // It is required to set a floating point precision in all fragment shaders.

// Interpolated values from vertex shader
// NOTE: You may need to edit this section to add additional variables
varying vec3 normalInterp; // Normal
varying vec3 vertPos; // Vertex position
varying vec3 viewVec; // Interpolated view vector

// uniform values remain the same across the scene
// NOTE: You may need to edit this section to add additional variables
uniform float Ka;   // Ambient reflection coefficient
uniform float Kd;   // Diffuse reflection coefficient
uniform float Ks;   // Specular reflection coefficient
uniform float shininessVal; // Shininess

// Material color
uniform vec3 ambientColor;
uniform vec3 diffuseColor;
uniform vec3 specularColor;

uniform vec3 lightPos; // Light position in camera space

uniform sampler2D uSampler;	// 2D sampler for the earth texture

float beckmannDistribution(float x, float roughness) {
  float NdotH = max(x, 0.0001);
  float cos2Alpha = NdotH * NdotH;
  float tan2Alpha = (cos2Alpha - 1.0) / cos2Alpha;
  float roughness2 = roughness * roughness;
  float denom = 3.141592653589793 * roughness2 * cos2Alpha * cos2Alpha;
  return exp(tan2Alpha / roughness2) / denom;
}


void main() {
  // Your solution should go here.
  // Only the ambient colour calculations have been provided as an example.

  vec3 normal = normalize(normalInterp);
  vec3 lightVec = normalize(lightPos - vertPos);

  float lambertCoeff = dot(lightVec, normal);
  if(lambertCoeff < 0.0) {
  	lambertCoeff = 0.0;
  }

  float viewNorm = dot(viewVec, normal);
  if(viewNorm < 0.0) {
  	viewNorm = 0.0;
  }

  vec3 ambientLight = ambientColor * vec3(Ka);
  vec3 diffuseLight = diffuseColor * vec3(Kd) * vec3(lambertCoeff);


  vec3 halfVec = normalize(lightVec + viewVec);


  float halfNorm = dot(normal, halfVec);
  if(halfNorm < 0.0) {
  	halfNorm = 0.0;
  }

  float halfView = dot(viewVec, halfVec);
  if(halfView < 0.001) {
  	halfView = 0.001;
  }

  float weight = 2.0 * halfNorm / halfView;
  float specWeight = 0.0;

  if(lambertCoeff > viewNorm) {
  	specWeight = viewNorm;
  } else {
  	specWeight = lambertCoeff;
  }

  if(specWeight > 1.0) {
  	specWeight = 1.0;
  }

  float beckmannWeight = beckmannDistribution(halfNorm, 0.2);


  float fresnelWeight = pow(1.0 - viewNorm, shininessVal);

  float finalScale = 3.14159 * viewNorm * lambertCoeff;

  if(finalScale < 0.000001) {
  	finalScale = 0.000001;
  }


  float finalSpec = Ks * specWeight * fresnelWeight * beckmannWeight /  finalScale;

  gl_FragColor = vec4(ambientLight + diffuseLight + (vec3(specularColor) * vec3(finalSpec)), 1.0);
}
