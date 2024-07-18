import { buttonVariants } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<div className="flex flex-1 justify-center items-center flex-col gap-8 p-4">
			{/* Site description */}
			<div className="bg-black p-4 rounded-xl">
				<Users size={100} className="text-white" />
			</div>
			<h1 className="text-center">All-In-One Group Planner</h1>
			<p className="text-center">
				This app lets you chat, share photos, and plan events with anyone all in one place
			</p>
			{/* Login button */}
			<a href="/auth/google" className={buttonVariants()} data-cy="login">
				Login with Google
			</a>
		</div>
	);
}
