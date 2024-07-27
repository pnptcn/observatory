import React, { useMemo } from "react"
import { a } from "@react-spring/three"
import { Html } from "@react-three/drei"
import * as THREE from "three"

interface NodeComponentProps {
    node: any
    position: any
    scale: any
    onPointerOver: () => void
    onPointerOut: () => void
    onClick: () => void
    hoveredNode: number | null
}

const NodeComponent: React.FC<NodeComponentProps> = ({ node, position, scale, onPointerOver, onPointerOut, onClick, hoveredNode }) => {
    const isHovered = hoveredNode === node.id

    const glowMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                glowColor: { value: new THREE.Color(isHovered ? "hotpink" : node.color) },
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
                uniform vec3 viewVector;
                
                varying vec3 vNormal;
                varying vec3 vWorldPosition;
                
                void main() {
                    float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
                    gl_FragColor = vec4(glowColor, intensity * 0.5);
                }
            `,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        })
    }, [node.color, isHovered])

    return (
        <a.group position={position} scale={scale}>
            <mesh
                onPointerOver={onPointerOver}
                onPointerOut={onPointerOut}
                onClick={onClick}
            >
                <sphereGeometry args={[0.1, 32, 32]} />
                <meshStandardMaterial
                    color={isHovered ? "hotpink" : node.color}
                    emissive={isHovered ? "hotpink" : "black"}
                    emissiveIntensity={isHovered ? 0.5 : 0.1}
                    transparent
                    opacity={0.8}
                />
            </mesh>
            <mesh scale={1.2}>
                <sphereGeometry args={[0.1, 32, 32]} />
                <shaderMaterial attach="material" args={[glowMaterial]} />
            </mesh>
            <Html position={[0.15, 0.15, 0]}>
                <div style={{ color: isHovered ? "hotpink" : "white", fontSize: "12px" }}>{node.label}</div>
            </Html>
        </a.group>
    )
}

export default NodeComponent
