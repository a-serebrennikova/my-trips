export type NotificationType = "info" | "success" | "error";

export interface NotificationPayload {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

interface ShowNotificationInput {
  message: string;
  type?: NotificationType;
  duration?: number;
}

type NotificationListener = (payload: NotificationPayload) => void;

const listeners = new Set<NotificationListener>();

const createNotificationId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const emitNotification = ({
  message,
  type = "info",
  duration,
}: ShowNotificationInput): string => {
  const payload: NotificationPayload = {
    id: createNotificationId(),
    message,
    type,
    duration,
  };

  listeners.forEach((listener) => listener(payload));

  return payload.id;
};

export const subscribeToNotifications = (listener: NotificationListener) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const notify = (input: ShowNotificationInput) => emitNotification(input);

export const notifyInfo = (message: string, duration?: number) =>
  emitNotification({ message, type: "info", duration });

export const notifySuccess = (message: string, duration?: number) =>
  emitNotification({ message, type: "success", duration });

export const notifyError = (message: string, duration?: number) =>
  emitNotification({ message, type: "error", duration });

export const getErrorMessage = (
  error: unknown,
  fallbackMessage = "Something went wrong"
) => {
  if (!error) {
    return fallbackMessage;
  }

  if (typeof error === "string") {
    return error;
  }

  if (
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  return fallbackMessage;
};

export const notifyApiError = (
  error: unknown,
  fallbackMessage = "Something went wrong",
  duration?: number
) => notifyError(getErrorMessage(error, fallbackMessage), duration);
