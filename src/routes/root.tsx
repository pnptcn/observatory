import React from "react"
import { Outlet } from "react-router-dom"
import { Toaster } from "sonner"
import { ThemeProvider } from "@/components/theme/provider"

export const Component: React.FC = () => {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="observatory-theme">
            <Outlet />
            <Toaster />
        </ThemeProvider>
    )
}

Component.displayName = "RootLayout"

