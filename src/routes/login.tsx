import React from "react"
import AuthForm from "@/components/AuthForm"
import { useAuthStore } from "../features/auth"
import { redirect } from "react-router-dom"

export async function loader() {
    const isAuthenticated = useAuthStore.getState().isAuthenticated
    if (isAuthenticated) {
        return redirect("/")
    }
    return null
}

export const Component: React.FC = () => {
    return <AuthForm />
}

Component.displayName = "LoginPage"

