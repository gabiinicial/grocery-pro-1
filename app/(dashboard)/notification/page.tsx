"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useApp } from "../../shared/context/app-context";
import { getNotifications, markAsRead } from "../../shared/services/notification.service";
import type { Notification } from "../../shared/types/notification";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Hace ${hrs} h`;
  return `Hace ${Math.floor(hrs / 24)} días`;
}

export default function NotificationPage() {
  const { refreshNotifications } = useApp();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getNotifications()
      .then((data) => setNotifications(data))
      .catch(() => setError("No se pudieron cargar las notificaciones."))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      refreshNotifications();
    } catch {
      // silently ignore
    }
  };

  return (
    <div className="p-4 rounded-md space-y-4 w-full">
      <h2 className="text-lg font-bold text-gray-700">Notificaciones</h2>

      {loading && (
        <div className="flex items-center gap-2 text-gray-500 py-6 justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
          <span className="text-sm">Cargando notificaciones...</span>
        </div>
      )}

      {!loading && error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {!loading && !error && notifications.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-10">No tienes notificaciones.</p>
      )}

      {!loading &&
        !error &&
        notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => !n.isRead && handleMarkRead(n.id)}
            className={`flex justify-between flex-col border p-2 rounded-lg cursor-pointer transition ${
              n.isRead
                ? "border-slate-400 bg-transparent hover:bg-slate-100"
                : "border-orange-400 bg-orange-300/20 hover:bg-orange-400/40"
            }`}
          >
            <h3 className="font-medium text-slate-900">{n.title}</h3>
            <p className="text-gray-500">{n.message}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-amber-950 text-sm">{timeAgo(n.createdAt)}</p>
              {!n.isRead && (
                <span className="text-xs text-orange-600 font-medium">Marcar como leída</span>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}
