import { Button, buttonVariants } from "@/components/ui/button";
import { api, apiUtils } from "@/trpc/react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Trash, Upload } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/$groupId/_layout/media")({
	component: Media,
});

function Media() {
	const { groupId } = Route.useParams();
	const [file, setFile] = useState<File | null>(null);
	const [openImage, setOpenImage] = useState<string | null>(null);

	const { data: user } = api.users.me.useQuery();
	const { data: media } = api.media.find.useQuery({
		groupId,
	});

	const { mutate: deleteMedia } = api.media.delete.useMutation({
		onSuccess: () => {
			apiUtils.media.find.invalidate();
		},
	});
	const { mutate: createMedia } = api.media.create.useMutation({
		onSuccess: () => {
			apiUtils.media.find.invalidate();
		},
	});
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
						groupId,
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
				<button
					onClick={() => setOpenImage(media.id)}
					key={media.id}
					className="relative w-full h-48 flex flex-col gap-2"
				>
					<img
						src={`${import.meta.env.VITE_R2_URL}/${groupId}/media/${media.id}`}
						className="object-cover w-full h-full rounded-md"
					/>
					<div className="flex gap-2 items-center absolute top-2 left-2 group">
						<div className="bg-muted rounded-full w-8 h-8 flex justify-center items-center">
							<p>{media.user.name ? media.user.name[0] : "A"}</p>
						</div>
						<div className="bg-white group-hover:flex hidden animate-in fade-in h-8 items-center px-4 rounded shadow">
							<p className="text-sm">{media.user.name}</p>
						</div>
					</div>
					{user?.id === media.user.id && (
						<Button
							onClick={(e) => {
								e.stopPropagation();
								deleteMedia({
									id: media.id,
									groupId,
								});
							}}
							className="absolute bottom-2 right-2"
							variant="outline"
							size="icon"
						>
							<Trash size={18} />
						</Button>
					)}
				</button>
			))}
			{openImage && (
				<div
					onClick={() => setOpenImage(null)}
					className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-20 gap-4"
				>
					<Button
						onClick={(e) => {
							e.stopPropagation();
							setOpenImage(
								media?.[media.findIndex((m) => m.id === openImage) - 1]?.id ??
									media?.[media.length - 1]?.id ??
									null
							);
						}}
						variant="outline"
						className="min-w-12 h-12 rounded-full"
						size="icon"
					>
						<ChevronLeft size={24} />
					</Button>
					<img
						src={`${import.meta.env.VITE_R2_URL}/${groupId}/media/${openImage}`}
						className="object-contain max-w-full max-h-full"
					/>
					<Button
						onClick={(e) => {
							e.stopPropagation();
							setOpenImage(
								media?.[media.findIndex((m) => m.id === openImage) + 1]?.id ??
									media?.[0]?.id ??
									openImage
							);
						}}
						variant="outline"
						className="min-w-12 h-12 rounded-full"
						size="icon"
					>
						<ChevronRight size={24} />
					</Button>
				</div>
			)}
		</div>
	);
}
