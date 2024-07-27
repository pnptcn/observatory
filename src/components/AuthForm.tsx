import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore } from "@/features/auth"
import { Loader2 } from "lucide-react"

const loginSchema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
	password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

const signupSchema = loginSchema.extend({
	confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords don't match",
	path: ["confirmPassword"],
})

type LoginFormValues = z.infer<typeof loginSchema>
type SignupFormValues = z.infer<typeof signupSchema>

const AuthForm: React.FC = () => {
	const [activeTab, setActiveTab] = React.useState<"login" | "signup">("login")
	const { login, signup, loginWithGoogle, isAuthenticated, isLoading } = useAuthStore()

	const loginForm = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	})

	const signupForm = useForm<SignupFormValues>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	})

	const onLoginSubmit = async (values: LoginFormValues) => {
		await login(values.email, values.password)
	}

	const onSignupSubmit = async (values: SignupFormValues) => {
		await signup(values.email, values.password)
	}

	if (isAuthenticated) {
		return <div>You are logged in!</div>
	}

	return (
		<div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
			<div className="flex items-center justify-center py-12">
				<Card className="w-[350px]">
					<CardHeader>
						<CardTitle>Authentication</CardTitle>
						<CardDescription>Login or create a new account</CardDescription>
					</CardHeader>
					<CardContent>
						<Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "signup")}>
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="login">Login</TabsTrigger>
								<TabsTrigger value="signup">Sign Up</TabsTrigger>
							</TabsList>
							<TabsContent value="login">
								<Form {...loginForm}>
									<form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
										<FormField
											control={loginForm.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email</FormLabel>
													<FormControl>
														<Input placeholder="m@example.com" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={loginForm.control}
											name="password"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Password</FormLabel>
													<FormControl>
														<Input type="password" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<Button type="submit" className="w-full" disabled={isLoading}>
											{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
											Login
										</Button>
									</form>
								</Form>
							</TabsContent>
							<TabsContent value="signup">
								<Form {...signupForm}>
									<form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
										<FormField
											control={signupForm.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email</FormLabel>
													<FormControl>
														<Input placeholder="m@example.com" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={signupForm.control}
											name="password"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Password</FormLabel>
													<FormControl>
														<Input type="password" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={signupForm.control}
											name="confirmPassword"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Confirm Password</FormLabel>
													<FormControl>
														<Input type="password" {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}

										/>
										<Button type="submit" className="w-full" disabled={isLoading}>
											{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
											Sign Up
										</Button>
									</form>
								</Form>
							</TabsContent>
						</Tabs>
					</CardContent>
					<CardFooter>
						<Button variant="outline" className="w-full" onClick={loginWithGoogle} disabled={isLoading}>
							{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
							Login with Google
						</Button>
					</CardFooter>
				</Card>
			</div>
			<div className="hidden bg-muted lg:block">
				<img
					src="/api/placeholder/1920/1080"
					alt="Placeholder"
					className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
				/>
			</div>
		</div>
	)
}

export default AuthForm


