import { useEffect, useRef, useState } from "react"
import { useEditor } from "./context"

const EditorContainer = () => {
    const { editor } = useEditor()!
    const containerRef = useRef<HTMLDivElement>(null)
    const [isVisible, setIsVisible] = useState<boolean>(true)

    useEffect(() => {
        if (containerRef.current && editor) {
            containerRef.current.innerHTML = ""
            containerRef.current.appendChild(editor)
        }
    }, [editor, isVisible])
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting)
            },
            { threshold: 0.1 }
        )

        if (containerRef.current) {
            observer.observe(containerRef.current)
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current)
            }
        }
    }, [])

    return <div className="editor-container" ref={containerRef}></div>
}

export default EditorContainer
