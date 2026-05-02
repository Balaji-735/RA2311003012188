import { Log } from "../logging_middleware/logger";

export const getNotifications = async (token, limit = 10, page = 1, notificationType = "") => {
  try {
    const params = new URLSearchParams({
      limit: String(limit),
      page: String(page),
    });

    if (notificationType) {
      params.set("notification_type", notificationType);
    }

    const res = await fetch(`/notifications?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error("Notifications request failed");
    }

    await Log("frontend", "info", "api", "Notifications fetched successfully");
    return data;
  } catch (err) {
    await Log("frontend", "error", "api", "Notifications request failed");
    throw err;
  }
};
