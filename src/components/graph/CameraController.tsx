import React, { useEffect } from "react"
import { useSpring } from "@react-spring/three"
import { useThree } from "@react-three/fiber"
import * as THREE from "three"

const calculateCameraPosition = (nodes: any[]) => {
    const boundingBox = new THREE.Box3()
    nodes.forEach((node) => {
        boundingBox.expandByPoint(node.position)
    })
    const size = boundingBox.getSize(new THREE.Vector3())
    const center = boundingBox.getCenter(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const fov = 75 * (Math.PI / 180)
    let cameraZ = Math.abs(maxDim / 2 * Math.tan(fov / 2))
    cameraZ *= 2
    return [center.x, center.y, cameraZ]
}

interface CameraControllerProps {
    nodes: any[]
    layoutChanged: boolean
}

const CameraController: React.FC<CameraControllerProps> = ({ nodes, layoutChanged }) => {
    const { camera } = useThree()
    const [spring, api] = useSpring(() => ({
        position: [0, 0, 10],
        config: { mass: 1, tension: 170, friction: 26 },
    }))

    useEffect(() => {
        if (layoutChanged) {
            const newCameraPosition = calculateCameraPosition(nodes)
            api.start({ position: newCameraPosition })
        }
    }, [nodes, layoutChanged, api])

    useEffect(() => {
        const [x, y, z] = spring.position.get()
        camera.position.set(x, y, z)
        camera.lookAt(0, 0, 0)
    }, [spring.position])

    return null
}

export default CameraController

