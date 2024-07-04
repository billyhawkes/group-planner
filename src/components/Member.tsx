import { User } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {};

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
				<p>{user.name ? user.name[0] : "A"}</p>
			</div>
			<div className="flex flex-col gap-0">
				<p className="font-medium">{user.name}</p>
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
