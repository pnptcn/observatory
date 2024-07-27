import React from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../features/auth"

export async function loader() {
    const handleAuthentication = useAuthStore.getState().handleAuthentication
    try {

    	await handleAuthentication()
    return redirect("/")
	} catch (error) {
		console.error("Authentication error:", error)
		return redirect("/login")
	}
}

export function Component() {
	return <div>Processing authentication...</div>
}

Component.displayName = "AuthCallback"

