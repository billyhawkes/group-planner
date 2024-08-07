import { User } from "@/lib/types";
import { cn } from "@/lib/utils";

// Reusable member component
const Member = ({
	user,
	hightlight,
}: {
	user: User;
	hightlight?: {
		text: string;
		type: "on" | "off" | "idle";
	};
}) => {
	return (
		<div className="flex gap-2 items-center">
			<div className="bg-muted rounded-full w-10 h-10 flex justify-center items-center">
				{/* Show first letter of the user's name or "A" if no name */}
				<p>{user.name ? user.name[0] : "A"}</p>
			</div>
			<div className="flex flex-col gap-0">
				{/* Show name */}
				<p className="font-medium">{user.name}</p>
				{/* Show status and color based on type */}
				<p
					className={cn(
						"text-xs",
						hightlight?.type === "on" && "text-green-600",
						hightlight?.type === "off" && "text-red-500",
						hightlight?.type === "idle" && "text-muted-foreground"
					)}
				>
					{hightlight?.text}
				</p>
			</div>
		</div>
	);
};

export default Member;
