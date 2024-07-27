import "./globals.css"
import React from "react"
import ReactDOM from "react-dom/client"
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom"

const router = createBrowserRouter([
    {
        path: "/",
        lazy: () => import("./routes/root"),
        children: [
            {
                index: true,
                lazy: () => import("./routes/index"),
            },
            {
                path: "login",
                lazy: () => import("./routes/login"),
            },
            {
                path: "callback",
                lazy: () => import("./routes/callback"),
            },
        ],
    },
])

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)
