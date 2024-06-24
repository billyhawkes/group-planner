import { buttonVariants } from "@/components/ui/button";
import { testUsers } from "@/lib/data";
import { api, apiUtils } from "@/trpc/react";
import { createFileRoute } from "@tanstack/react-router";
import { Upload, User } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/$groupId/_layout/media")({
	component: Media,
});

function Media() {
	const { groupId } = Route.useParams();
	const [file, setFile] = useState<File | null>(null);
	const { data: media } = api.media.find.useQuery({
		groupId,
	});
	const { mutate: createMedia } = api.media.create.useMutation();
	const { mutate: getPresignedUrl } = api.media.getPresignedUrl.useMutation({
		onSuccess: async ({ url, id }) => {
			if (!file) return;
			await fetch(url, {
				method: "PUT",
				body: file,
				headers: {
					"Content-Type": file.type,
				},
			});
			await createMedia({ id, groupId });
			apiUtils.media.find.invalidate();
		},
	});

	return (
		<div className="grid grid-cols-3 gap-4 w-full h-min">
			<input
				type="file"
				id="file-upload"
				hidden
				accept="image/png, image/gif, image/jpeg"
				onChange={async (e) => {
					const file = e.target.files?.[0];
					if (!file) return;
					setFile(file);
					getPresignedUrl({
						type: file.type,
						size: file.size,
					});
				}}
			/>
			<label
				htmlFor="file-upload"
				className={buttonVariants({
					variant: "outline",
					className: "flex cursor-pointer items-center justify-center w-full h-48 gap-2",
				})}
			>
				<Upload size={18} />
				Upload
			</label>
			{media?.map((media) => (
				<div key={media.id} className="relative w-full h-48 flex flex-col gap-2">
					<img
						src={`https://pub-b11394b4c35a4dfda20ed9a385a16ab3.r2.dev/test-images/${media.id}`}
						className="object-cover w-full h-full rounded-md"
					/>
					<div className="flex gap-2 items-center absolute top-2 left-2 group">
						<div className="bg-muted rounded-full w-8 h-8 flex justify-center items-center">
							<User size={18} />
						</div>
						<div className="bg-white group-hover:flex hidden animate-in fade-in h-8 items-center px-4 rounded shadow">
							<p className="text-sm">
								{testUsers[Math.floor(Math.random() * testUsers.length)].name}
							</p>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
