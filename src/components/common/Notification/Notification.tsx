import React, { useEffect } from "react";
import { useState } from "react";

interface NotificationProps {
  message: string;
  type?: "info" | "success" | "error";
  onClose: () => void;
  duration?: number;
}

export const Notification: React.FC<NotificationProps> = ({
  message,
  type = "info",
  onClose,
  duration = 3000,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const title =
    type === "error" ? "Error" : type === "success" ? "Success" : "Info";

  return (
    <div
      className={`notification notification-${type} ${isVisible ? "notification-enter" : ""}`}
      role={type === "error" ? "alert" : "status"}
    >
      <div className="flex flex-col gap-2">
        <p>{title}</p>
        <span>{message}</span>
      </div>
      <button type="button" onClick={onClose} className="close-btn">
        &times;
      </button>
    </div>
  );
};
