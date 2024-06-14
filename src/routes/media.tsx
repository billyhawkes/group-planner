import { buttonVariants } from "@/components/ui/button";
import { api, apiUtils } from "@/trpc/react";
import { createFileRoute } from "@tanstack/react-router";
import { Upload } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/media")({
	component: Media,
});

function Media() {
	const [file, setFile] = useState<File | null>(null);
	const { data: media } = api.media.find.useQuery();
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
			await createMedia({ id });
			apiUtils.media.find.invalidate();
		},
	});

	return (
		<div className="grid grid-cols-3 gap-4 w-full">
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
				<div key={media.id} className="relative w-full h-48">
					<img
						src={`https://pub-b11394b4c35a4dfda20ed9a385a16ab3.r2.dev/test-images/${media.id}`}
						className="object-cover w-full h-full rounded-md"
					/>
				</div>
			))}
		</div>
	);
}
