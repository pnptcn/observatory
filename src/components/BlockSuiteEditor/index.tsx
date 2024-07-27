import React, { useEffect, useRef } from "react"
import { createEmptyPage, DocCollection, Schema } from "@blocksuite/store"
import { AffineEditorContainer } from "@blocksuite/editor"
import "@blocksuite/editor/themes/affine.css"
import { CSVAnalysisSchema } from "./blocks/CSVAnalysisBlock"

const BlockSuiteEditor: React.FC = () => {
    const editorRef = useRef<AffineEditorContainer | null>(null)

    useEffect(() => {
        const schema = new Schema()
        schema.register(CSVAnalysisSchema)

        const collection = new DocCollection({ schema })
        const page = createEmptyPage(collection)

        const editor = new AffineEditorContainer()
        editor.page = page
        editor.slots.docLinkClicked.on(({ docId }) => {
            console.log("Doc link clicked:", docId)
        })

        if (editorRef.current) {
            editorRef.current.appendChild(editor)
        }

        return () => {
            editor.remove()
        }
    }, [])

    return <div ref={editorRef} style={{ width: "100%", height: "100vh" }} />
}

export default BlockSuiteEditor

