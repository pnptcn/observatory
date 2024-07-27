import Papa from "papaparse"
import * as THREE from "three"
import NetworkGraph, { Node, Link } from "@/components/graph/NetworkGraph"

interface ParsedData {
    nodes: Node[]
    links: Link[]
}

export const csvParser = (file: File): Promise<ParsedData> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: (result) => {
                if (result.errors.length) {
                    return reject(result.errors)
                }

                const parsedNodes: Node[] = []
                const parsedLinks: Link[] = []

                result.data.forEach((item: any) => {
                    if (!!item.positionX && !!item.positionY && !!item.positionZ) {
                        parsedNodes.push({
                            id: item.id,
                            label: item.label,
                            color: item.color,
                            visible: item.visible,
                            position: new THREE.Vector3(item.positionX, item.positionY, item.positionZ),
                        })
                    } else if (!!item.source && !!item.target) {
                        parsedLinks.push({
                            id: item.id,
                            source: item.source,
                            target: item.target,
                        })
                    }
                })

                resolve({ nodes: parsedNodes, links: parsedLinks })
            },
            error: (error) => reject(error),
        })
    })
}

export const networkGraphPresenter = (data: ParsedData): JSX.Element => {
    return <NetworkGraph nodes={data.nodes} links={data.links} />
}

