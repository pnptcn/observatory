import React, { useEffect, useRef, useState } from "react";
import '@blocksuite/presets/themes/affine.css';
import { createEmptyDoc, PageEditor, EdgelessEditor } from '@blocksuite/presets';
import { Text } from '@blocksuite/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BlockSuiteEditor: React.FC = () => {
    const [activeTab, setActiveTab] = useState<any>("editorTab")
    const editorRef = useRef<HTMLDivElement | null>(null);
    const edgelessRef = useRef<HTMLDivElement | null>(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (!initialized) {
            const doc = createEmptyDoc().init();
            const editor = new PageEditor();
            const edgeless = new EdgelessEditor();

            editor.doc = doc;
            edgeless.doc = doc;

            if (editorRef.current) editorRef.current.appendChild(editor);
            if (edgelessRef.current) edgelessRef.current.appendChild(edgeless);

            // Update block node with some initial text content
            const paragraphs = doc.getBlockByFlavour('affine:paragraph');
            if (paragraphs.length > 0) {
                const paragraph = paragraphs[0];
                doc.updateBlock(paragraph, { text: new Text('Hello World!') });
            }

            setInitialized(true);
        }
    }, [initialized]);

    return (
        <Tabs 
            defaultValue="editorTab" 
            onValueChange={(value: any) => {
                setActiveTab(value)
            }} 
            className="w-full"
        >
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="editorTab">Editor</TabsTrigger>
                <TabsTrigger value="edgelessTab">Edgeless</TabsTrigger>
            </TabsList>
            <TabsContent value="editorTab">
                <div ref={editorRef} style={{ 
                    width: "100%", 
                    height: "100vh",
                    display: activeTab === "editorTab" ? "block" : "none"
                }}></div>
            </TabsContent>
            <TabsContent value="edgelessTab">
                <div ref={edgelessRef} style={{ 
                    width: "100%", 
                    height: "100vh",
                    display: activeTab === "edgelessTab" ? "block" : "none"
                }}></div>
            </TabsContent>
        </Tabs>
    );
}

export default BlockSuiteEditor;

