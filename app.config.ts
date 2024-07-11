import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import reactRefresh from "@vitejs/plugin-react";
import { createApp } from "vinxi";
import { config } from "vinxi/plugins/config";
import tsconfigPaths from "vite-tsconfig-paths";

// Application config
export default createApp({
	server: {
		experimental: {
			asyncContext: true,
		},
	},
	routers: [
		// Public folder for images
		{
			name: "public",
			type: "static",
			dir: "./public",
			base: "/",
		},
		// Trpc server
		{
			name: "server",
			base: "/trpc",
			type: "http",
			handler: "./src/events/trpc.ts",
			target: "server",
			plugins: () => [
				tsconfigPaths(),
				config("custom", {
					define: {
						"process.env.R2_KEY_ID": JSON.stringify(process.env.R2_KEY_ID),
						"process.env.R2_ENDPOINT": JSON.stringify(process.env.R2_ENDPOINT),
						"process.env.R2_ACCESS_KEY": JSON.stringify(process.env.R2_ACCESS_KEY),
						"process.env.DATABASE_URL": JSON.stringify(process.env.DATABASE_URL),
						"process.env.DATABASE_TOKEN": JSON.stringify(process.env.DATABASE_TOKEN),
						"process.env.VITE_PUSHER_KEY": JSON.stringify(process.env.VITE_PUSHER_KEY),
						"process.env.PUSHER_SECRET": JSON.stringify(process.env.PUSHER_SECRET),
					},
				}),
			],
		},
		// React vite app
		{
			name: "client",
			type: "spa",
			handler: "index.html",
			target: "browser",
			plugins: () => [
				tsconfigPaths(),
				reactRefresh(),
				TanStackRouterVite(),
				config("custom", {
					define: {
						"import.meta.env.VITE_SITE_URL": JSON.stringify(process.env.VITE_SITE_URL),
						"import.meta.env.VITE_R2_URL": JSON.stringify(process.env.VITE_R2_URL),
						"import.meta.env.VITE_PUSHER_KEY": JSON.stringify(
							process.env.VITE_PUSHER_KEY
						),
					},
				}),
			],
		},
		// Auth event handler for Google OAuth
		{
			name: "auth",
			type: "http",
			base: "/auth",
			handler: "./src/events/auth.ts",
			target: "server",
			plugins: () => [
				tsconfigPaths(),
				config("custom", {
					define: {
						"process.env.VITE_SITE_URL": JSON.stringify(process.env.VITE_SITE_URL),
						"process.env.GOOGLE_CLIENT_ID": JSON.stringify(
							process.env.GOOGLE_CLIENT_ID
						),
						"process.env.GOOGLE_CLIENT_SECRET": JSON.stringify(
							process.env.GOOGLE_CLIENT_SECRET
						),
						"process.env.DATABASE_URL": JSON.stringify(process.env.DATABASE_URL),
						"process.env.DATABASE_TOKEN": JSON.stringify(process.env.DATABASE_TOKEN),
					},
				}),
			],
		},
	],
});
