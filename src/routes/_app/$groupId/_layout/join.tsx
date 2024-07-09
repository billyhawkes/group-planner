import { api } from "@/trpc/react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_app/$groupId/_layout/join")({
	component: Join,
});

function Join() {
	const { groupId } = Route.useParams();
	const navigate = Route.useNavigate();
	const { mutate } = api.groups.join.useMutation({
		onSuccess: () => {
			navigate({
				to: "/$groupId/chat",
				params: { groupId },
			});
		},
	});

	useEffect(() => {
		mutate({ groupId });
	}, [groupId]);

	return null;
}
