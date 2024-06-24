import { buttonVariants } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
	component: () => {
		return (
			<div className="flex justify-center items-center w-screen h-screen flex-col gap-8">
				<h1>Login</h1>
				<a href="/auth/google" className={buttonVariants({})}>
					Google
				</a>
			</div>
		);
	},
});
