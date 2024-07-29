import React from "react"
import "./styles.css"
import { ThemeProvider } from "@/components/theme/provider"
import Reveal from "reveal.js"
import { Command } from "@/components/command/Command"
import BlockSuiteEditor from "@/components/BlockSuiteEditor"

const App: React.FC = () => {

    const deck = React.useRef<Reveal.Api>()

    React.useEffect(() => {
        if (deck.current) return

        deck.current = new Reveal({
            hash: true,
            respondToHashChanges: true,
            history: true,
            keyboard: false,
            previewLinks: true,
            transition: "convex",
            display: "flex",
            disableLayout: true
        })
        deck.current.initialize()
    }, [])

    return (
        <ThemeProvider defaultTheme="dark" storageKey="observatory-theme">
            <section>
                <BlockSuiteEditor />
                <Command />
            </section>
        </ThemeProvider>
    )
}

export default App
