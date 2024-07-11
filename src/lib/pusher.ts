import PusherClient from "pusher-js";

// Initialize the Pusher client
export const pusherClient = new PusherClient(import.meta.env.VITE_PUSHER_KEY!, {
	cluster: "us2",
});
