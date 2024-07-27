import React, { useRef, useMemo, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import ImprovedLineGlowMaterial from "./LineGlowMaterial"

interface LinkComponentProps {
    sourcePos: THREE.Vector3
    targetPos: THREE.Vector3
}

const LinkComponent: React.FC<LinkComponentProps> = ({ sourcePos, targetPos }) => {
    const ref = useRef<THREE.LineSegments>(null!)
    const materialRef = useRef<ImprovedLineGlowMaterial>(null!)
    const { camera } = useThree()

    const positions = useMemo(() => new Float32Array([
        sourcePos.x, sourcePos.y, sourcePos.z,
        targetPos.x, targetPos.y, targetPos.z,
    ]), [sourcePos, targetPos])

    useEffect(() => {
        if (ref.current) {
            ref.current.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
        }
    }, [positions])

    useFrame(() => {
        if (ref.current) {
            ref.current.geometry.attributes.position.needsUpdate = true
        }
        if (materialRef.current) {
            materialRef.current.updateViewVector(camera)
        }
    })

    return (
        <lineSegments ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={2} array={positions} itemSize={3} />
            </bufferGeometry>
            <improvedLineGlowMaterial
                ref={materialRef}
                glowColor={new THREE.Color("hotpink")}
                glowIntensity={1.5}
                glowRange={0.5}
            />
        </lineSegments>
    )
}

export default LinkComponent
