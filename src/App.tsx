import React from "react"
import "./styles.css"
import { ThemeProvider } from "@/components/theme/provider"
import Reveal from "reveal.js"
import Upload from "@/components/upload/upload"
import { csvParser, networkGraphPresenter } from "@/components/upload/csvParser"
import { Command } from "@/components/command/Command"

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
            display: "flex"
        })
        deck.current.initialize()
    }, [])

    return (
        <ThemeProvider defaultTheme="dark" storageKey="observatory-theme">
            <section>
                <Upload parser={csvParser} presenter={networkGraphPresenter} />
                <Command />
            </section>
        </ThemeProvider>
    )
}

export default App
