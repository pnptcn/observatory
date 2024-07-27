import React, { useState, useEffect, useRef } from "react"
import * as THREE from "three"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stars } from "@react-three/drei"
import { EffectComposer, DepthOfField, Bloom, Noise, Vignette } from "@react-three/postprocessing"
import { useSprings } from "@react-spring/three"
import CameraController from "./CameraController"
import LinkComponent from "./LinkComponent"
import NodeComponent from "./NodeComponent"
import "./LineGlowMaterial"
import {
    applyRandomLayout,
    applyGridLayout,
    applyCircleLayout,
    applyConcentricLayout,
    applySpiralLayout,
    applyTreeLayout,
    applyRadialLayout,
    applyForceDirectedLayout,
    applySphereLayout,
    applyCylinderLayout,
    applyHelixLayout,
} from "./layouts"

export interface Node {
    id: number
    label: string
    color: string
    visible: boolean
    position: THREE.Vector3
}

export interface Link {
    id: number
    source: number
    target: number
}

interface NetworkGraphProps {
    nodes: Node[]
    links: Link[]
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ nodes, links }) => {
    const [layout, setLayout] = useState<string>("random")
    const [hoveredNode, setHoveredNode] = useState<number | null>(null)
    const [nodePositions, setNodePositions] = useState<THREE.Vector3[]>(nodes.map(() => new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10)))
    const [layoutChanged, setLayoutChanged] = useState<boolean>(false)
    const layoutRef = useRef<string>(layout)

    useEffect(() => {
        const newNodes = nodes.map((node, index) => ({
            ...node,
            position: nodePositions[index]
        }))
        setNodePositions(newNodes.map(node => node.position))
    }, [nodes, nodePositions])

    useEffect(() => {
        let debounceTimeout: NodeJS.Timeout
        const applyLayout = () => {
            if (layoutRef.current !== layout) {
                layoutRef.current = layout
                const newPositions = nodePositions.map((pos) => pos.clone())
                switch (layout) {
                    case "random":
                        applyRandomLayout(newPositions)
                        break
                    case "grid":
                        applyGridLayout(newPositions)
                        break
                    case "circle":
                        applyCircleLayout(newPositions)
                        break
                    case "concentric":
                        applyConcentricLayout(newPositions)
                        break
                    case "spiral":
                        applySpiralLayout(newPositions)
                        break
                    case "tree":
                        applyTreeLayout(newPositions)
                        break
                    case "radial":
                        applyRadialLayout(newPositions)
                        break
                    case "force-directed":
                        applyForceDirectedLayout(newPositions, links)
                        break
                    case "sphere":
                        applySphereLayout(newPositions)
                        break
                    case "cylinder":
                        applyCylinderLayout(newPositions)
                        break
                    case "helix":
                        applyHelixLayout(newPositions)
                        break
                    default:
                        break
                }
                setNodePositions(newPositions)
                setLayoutChanged(true)
                clearTimeout(debounceTimeout)
                debounceTimeout = setTimeout(() => {
                    setLayoutChanged(false)
                }, 300)
            }
        }

        applyLayout()

        return () => clearTimeout(debounceTimeout)
    }, [layout, links, nodePositions])

    const springs = useSprings(
        nodes.length,
        nodes.map((node, i) => ({
            position: nodePositions[i].toArray(),
            scale: hoveredNode === node.id ? 1.5 : 1,
            config: { mass: 1, tension: 170, friction: 26 },
        }))
    )

    return (
        <>
            <Canvas
                camera={{ position: [0, 0, 10], fov: 75 }}
                style={{ width: "100vw", height: "100vh", background: "#000011" }}
            >
                <fog attach="fog" args={["#000011", 0, 30]} />
                <ambientLight intensity={0.1} />
                <directionalLight position={[10, 10, 10]} intensity={0.5} />
                <pointLight position={[-10, -10, -10]} intensity={0.2} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
                <OrbitControls />
                <EffectComposer>
                    <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
                    <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
                    <Noise opacity={0.02} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer>
                <CameraController nodes={nodes} layoutChanged={layoutChanged} />
                {nodes.map((node, index) => (
                    <NodeComponent
                        key={node.id}
                        node={node}
                        position={springs[index].position}
                        scale={springs[index].scale}
                        onPointerOver={() => setHoveredNode(node.id)}
                        onPointerOut={() => setHoveredNode(null)}
                        onClick={() => console.log("clicked")}
                        hoveredNode={hoveredNode}
                    />
                ))}
                {links.map((link, index) => {
                    const sourceIndex = nodes.findIndex((node) => node.id === link.source)
                    const targetIndex = nodes.findIndex((node) => node.id === link.target)

                    if (sourceIndex === -1 || targetIndex === -1) return null

                    return (
                        <LinkComponent
                            key={index}
                            sourcePos={new THREE.Vector3(...springs[sourceIndex].position.get())}
                            targetPos={new THREE.Vector3(...springs[targetIndex].position.get())}
                        />
                    )
                })}
            </Canvas>
            <div style={{ position: "absolute", top: 10, left: 10, color: "white" }}>
                <select
                    value={layout}
                    onChange={(e) => {
                        setLayout(e.target.value)
                    }}
                >
                    <option value="random">Random Layout</option>
                    <option value="grid">Grid Layout</option>
                    <option value="circle">Circle Layout</option>
                    <option value="concentric">Concentric Layout</option>
                    <option value="spiral">Spiral Layout</option>
                    <option value="tree">Tree Layout</option>
                    <option value="radial">Radial Layout</option>
                    <option value="force-directed">Force-Directed Layout</option>
                    <option value="sphere">Sphere Layout</option>
                    <option value="cylinder">Cylinder Layout</option>
                    <option value="helix">Helix Layout</option>
                </select>
            </div>
        </>
    )
}

export default NetworkGraph
