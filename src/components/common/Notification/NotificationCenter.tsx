"use client";

import React, { useEffect, useState } from "react";
import { Notification } from "./Notification";
import {
  NotificationPayload,
  subscribeToNotifications,
} from "./notificationBus";

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToNotifications((payload) => {
      setNotifications((prev) => [...prev, payload]);
    });

    return unsubscribe;
  }, []);

  const handleClose = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  if (!notifications.length) {
    return null;
  }

  return (
    <div className="notification-center" aria-live="polite" aria-atomic="true">
      {notifications.map((item) => (
        <Notification
          key={item.id}
          message={item.message}
          type={item.type}
          duration={item.duration}
          onClose={() => handleClose(item.id)}
        />
      ))}
    </div>
  );
};
