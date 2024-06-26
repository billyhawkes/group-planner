import { buttonVariants } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<div className="flex justify-center items-center w-screen h-screen flex-col gap-8">
			<h1>All-In-One Group Organizer</h1>
			<p>
				This app lets you chat, share photos, and plan events with anyone all in one place
			</p>
			<a href="/auth/google" className={buttonVariants()}>
				Login with Google
			</a>
		</div>
	);
}
