import { api } from "@/trpc/react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

// Initialize the join route
export const Route = createFileRoute("/_app/$groupId/_layout/join")({
	component: Join,
});

function Join() {
	// Get the group ID from the route
	const { groupId } = Route.useParams();
	const navigate = Route.useNavigate();

	// Initiate the join mutation
	const { mutate } = api.groups.join.useMutation({
		onSuccess: () => {
			// Navigate to the chat page on success
			navigate({
				to: "/$groupId/chat",
				params: { groupId },
			});
		},
	});

	// On component mount, join the group
	useEffect(() => {
		mutate({ groupId });
	}, [groupId]);

	return null;
}
