import React from "react"
import "@blocksuite/presets/themes/affine.css"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EditorProvider } from "./provider"
import EditorContainer from "./container"

const BlockSuiteEditor: React.FC = () => {
    return (
        <Tabs
            defaultValue="editorTab"
            className="w-full"
        >
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="editorTab">Editor</TabsTrigger>
                <TabsTrigger value="edgelessTab">Edgeless</TabsTrigger>
            </TabsList>
            <TabsContent value="editorTab">
                <EditorProvider>
                    <EditorContainer />
                </EditorProvider>
            </TabsContent>
            <TabsContent value="edgelessTab">
            </TabsContent>
        </Tabs>
    )
}

export default BlockSuiteEditor

