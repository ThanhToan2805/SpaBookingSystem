import { useEffect } from "react";
import * as signalR from "@microsoft/signalr";

export function useBookingHub(userId, handlers = {}) {
  useEffect(() => {
    if (!userId) return;

    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5012/api";
    if (!baseUrl) {
      console.error("VITE_API_BASE_URL is not set");
      return;
    }

    const apiRoot = baseUrl.replace(/\/api\/?$/, "");

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${apiRoot}/hubs/booking`, {
        withCredentials: false,
        accessTokenFactory: () => localStorage.getItem("token") ?? ""
      })
      .withAutomaticReconnect()
      .build();

    // Đăng ký handler
    connection.on("BookingCreated", (payload) => {
      console.log("[SignalR] BookingCreated:", payload);
      handlers.onCreated && handlers.onCreated(payload);
    });

    connection.on("BookingUpdated", (payload) => {
      console.log("[SignalR] BookingUpdated:", payload);
      handlers.onUpdated && handlers.onUpdated(payload);
    });

    connection.on("BookingCancelled", (payload) => {
      console.log("[SignalR] BookingCancelled:", payload);
      handlers.onCancelled && handlers.onCancelled(payload);
    });

    connection.on("BookingRescheduled", (payload) => {
      console.log("[SignalR] BookingURescheduled:", payload);
      handlers.onRescheduled && handlers.onRescheduled(payload);
    });

    // Start connection + join group theo user
    connection
      .start()
      .then(() => {
        return connection.invoke("JoinUserGroup", String(userId));
      })
      .catch((err) => console.error("SignalR start error:", err));

    return () => {
      // leave group rồi stop connection
      connection
        .invoke("LeaveUserGroup", String(userId))
        .catch(() => {})
        .finally(() => {
          connection.stop();
        });
    };
  }, [userId]);
}