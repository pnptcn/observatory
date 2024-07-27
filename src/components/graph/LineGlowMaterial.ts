import * as THREE from 'three';
import { extend } from '@react-three/fiber';

class ImprovedLineGlowMaterial extends THREE.ShaderMaterial {
    constructor() {
        super({
            uniforms: {
                glowColor: { value: new THREE.Color('white') },
                glowIntensity: { value: 2.0 },
                glowRange: { value: 0.8 },
                viewVector: { value: new THREE.Vector3(0, 0, 1) }
            },
            vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        
        void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform vec3 glowColor;
        uniform float glowIntensity;
        uniform float glowRange;
        uniform vec3 viewVector;
        
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        
        void main() {
            vec3 viewDirection = normalize(viewVector - vWorldPosition);
            float intensity = pow(glowRange - clamp(dot(vNormal, viewDirection), 0.0, 1.0), 3.0);
            intensity = smoothstep(0.0, 1.0, intensity) * glowIntensity;
            gl_FragColor = vec4(glowColor, intensity);
        }
      `,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide
        });
    }

    updateViewVector(camera: THREE.Camera) {
        this.uniforms.viewVector.value.copy(camera.position);
    }
}

extend({ ImprovedLineGlowMaterial });

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'improvedLineGlowMaterial': any
        }
    }
}

export default ImprovedLineGlowMaterial;
