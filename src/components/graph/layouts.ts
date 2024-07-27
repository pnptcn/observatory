import * as THREE from "three"
import { Link } from "./NetworkGraph"

export const applyRandomLayout = (positions: THREE.Vector3[]) => {
    positions.forEach(position => {
        position.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        )
    })
}

export const applyGridLayout = (positions: THREE.Vector3[]) => {
    const gridSize = Math.ceil(Math.sqrt(positions.length))
    positions.forEach((position, index) => {
        const row = Math.floor(index / gridSize)
        const col = index % gridSize
        position.set(
            (col - gridSize / 2) * 2,
            (row - gridSize / 2) * 2,
            0
        )
    })
}

export const applyCircleLayout = (positions: THREE.Vector3[]) => {
    const radius = 5
    positions.forEach((position, index) => {
        const angle = (index / positions.length) * Math.PI * 2
        position.set(
            radius * Math.cos(angle),
            radius * Math.sin(angle),
            0
        )
    })
}

export const applyConcentricLayout = (positions: THREE.Vector3[]) => {
    const levels = Math.ceil(Math.sqrt(positions.length))
    const nodesPerLevel = Math.ceil(positions.length / levels)
    positions.forEach((position, index) => {
        const level = Math.floor(index / nodesPerLevel)
        const radius = level * 2
        const angle = ((index % nodesPerLevel) / nodesPerLevel) * Math.PI * 2
        position.set(
            radius * Math.cos(angle),
            radius * Math.sin(angle),
            0
        )
    })
}

export const applySpiralLayout = (positions: THREE.Vector3[]) => {
    const spacing = 0.5
    positions.forEach((position, index) => {
        const angle = index * spacing
        const radius = spacing * index
        position.set(
            radius * Math.cos(angle),
            radius * Math.sin(angle),
            0
        )
    })
}

export const applyTreeLayout = (positions: THREE.Vector3[]) => {
    const spacing = 2
    const depthSpacing = 3

    const layoutNode = (index: number, depth: number, offset: number) => {
        if (index >= positions.length) return
        positions[index].set(
            offset * spacing,
            -depth * depthSpacing,
            0
        )
        layoutNode(2 * index + 1, depth + 1, offset - 1)
        layoutNode(2 * index + 2, depth + 1, offset + 1)
    }

    layoutNode(0, 0, 0)
}

export const applyRadialLayout = (positions: THREE.Vector3[]) => {
    const levels = Math.ceil(Math.sqrt(positions.length))
    positions.forEach((position, index) => {
        const level = Math.floor(index / levels)
        const nodesAtLevel = Math.min(positions.length - level * levels, levels)
        const angle = (index % levels) * (Math.PI * 2 / nodesAtLevel)
        const radius = level * 2
        position.set(
            radius * Math.cos(angle),
            radius * Math.sin(angle),
            0
        )
    })
}

export const applyForceDirectedLayout = (positions: THREE.Vector3[], links: Link[]) => {
    const repulsionForce = 1000
    const springLength = 5
    const springStrength = 0.1
    const iterations = 500

    for (let i = 0; i < iterations; i++) {
        positions.forEach((position, index) => {
            links.forEach(link => {
                if (link.source === index || link.target === index) {
                    const otherIndex = link.source === index ? link.target : link.source
                    if (otherIndex >= 0 && otherIndex < positions.length) {
                        const direction = new THREE.Vector3().subVectors(positions[otherIndex], position)
                        const distance = direction.length()
                        direction.normalize()
                        const force = (distance - springLength) * springStrength
                        direction.multiplyScalar(force)
                        position.add(direction)
                    }
                }
            })

            positions.forEach((otherPosition, otherIndex) => {
                if (index !== otherIndex) {
                    const direction = new THREE.Vector3().subVectors(position, otherPosition)
                    let distance = direction.length()
                    if (distance < 0.1) distance = 0.1; // Avoid division by zero
                    direction.normalize()
                    const force = repulsionForce / (distance * distance)
                    direction.multiplyScalar(force)
                    position.add(direction)
                }
            })
        })
    }
}

// 3D Layouts
export const applySphereLayout = (positions: THREE.Vector3[]) => {
    const radius = 5
    const theta = Math.PI * (1 + Math.sqrt(5))

    positions.forEach((position, index) => {
        const y = 1 - (index / (positions.length - 1)) * 2
        const radiusAtY = Math.sqrt(1 - y * y)
        const x = Math.cos(theta * index) * radiusAtY
        const z = Math.sin(theta * index) * radiusAtY
        position.set(x * radius, y * radius, z * radius)
    })
}

export const applyCylinderLayout = (positions: THREE.Vector3[]) => {
    const height = 10
    const radius = 5
    const angleStep = (Math.PI * 2) / positions.length

    positions.forEach((position, index) => {
        const angle = index * angleStep
        const y = (index / positions.length) * height - height / 2
        const x = radius * Math.cos(angle)
        const z = radius * Math.sin(angle)
        position.set(x, y, z)
    })
}

export const applyHelixLayout = (positions: THREE.Vector3[]) => {
    const spacing = 1
    const turns = 3
    const radius = 5
    const angleStep = (Math.PI * 2 * turns) / positions.length

    positions.forEach((position, index) => {
        const angle = index * angleStep
        const y = index * spacing - (positions.length * spacing) / 2
        const x = radius * Math.cos(angle)
        const z = radius * Math.sin(angle)
        position.set(x, y, z)
    })
}
