import { registerForPushNotificationsAsync } from "../utils/registerForPushNotificationsAsync";
import { useAuth } from "../context/AuthContext";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import apiClient from "../config/apiConfig";

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		showPlaySound: true,
		showSetBadge: true,
	}),
});

export const usePushNotifications = () => {
	const { uuid } = useAuth();

	// Sotre token on backend
	const storeTokenOnBackend = async (token) => {
		if (!uuid || !token) return;

		try {
			await apiClient.post(`/api/notifications/register`, {
				user_id: uuid,
				push_token: token,
			});
			console.log("Push token stored on backend")
		} catch (error) {
			console.error("Failed to store push token to backend")
		}
	}

	// Listen for foreground notifications
	const setupForegroundListener = () => {
		const subscription = Notifications.addNotificationReceivedListener(
			(notification) => {
				console.log("Notification receieved:", notification)
			}
		);
		return subscription;
	};

	// User taps notification
	const setupNotificationResponseListener = () => {
		const subscription = Notifications.addNotificationResponseReceivedListener(
			(response) => {
				const data = response.notification.request.content.data;
				console.log("User tapped notification:", data)
			}
		);
		return subscription
	};

	// Main initialization
	useEffect(() => {
		const initPushNotifications = async () => {
			try {
				const token = await registerForPushNotificationsAsync();

				await storeTokenOnBackend(token)

				const foregroundListener = setupForegroundListener();
				const responseListener = setupNotificationResponseListener();

				return () => {
					foregroundListener.remove();
					responseListener.remove();
				};
			} catch (error) {
				console.error("Push notification setup error:", error)
			}
		};

		if (uuid) {
			initPushNotifications();
		}
	}, [uuid]);
};