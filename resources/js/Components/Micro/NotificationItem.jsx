import React from "react";
import { Bell } from "lucide-react";

/**
 * NotificationItem
 * Props:
 *  - notification: objeto da notificação
 *  - onRead: function(notificationId) => void (chamada quando precisa marcar como lida)
 *  - onClose: function() => void (fecha dropdown)
 */
export default function NotificationItem({ notification, onRead, onClose }) {
    const handleClick = () => {
        if (!notification.read && onRead) {
            onRead(notification.id);
        }
        if (onClose) onClose();
        if (notification.data?.url) {
            window.location.href = notification.data.url;
        }
    };

    const getNotificationIcon = (type) => {
        const icons = {
            enrollment_approved: "🎉",
            enrollment_request: "📥",
            course_start: "🚀",
            course_end: "📚",
            student_enrolled_code: "👨‍🎓",
        };
        return icons[type] || "🔔";
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Agora";
        if (diffMins < 60) return `${diffMins}m atrás`;
        if (diffHours < 24) return `${diffHours}h atrás`;
        if (diffDays < 7) return `${diffDays}d atrás`;

        return date.toLocaleDateString("pt-BR");
    };

    const unreadClasses = !notification.read
        ? "bg-blue-50 dark:bg-blue-900/30 border-l-blue-400 dark:border-l-blue-500"
        : "bg-white dark:bg-transparent";

    return (
        <div
            className={`relative p-3 border-b cursor-pointer transition-colors border-l-4 ${unreadClasses} hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600`}
            onClick={handleClick}
        >
            {!notification.read && (
                <span className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded-full bg-blue-600 text-white font-semibold tracking-wide">
                    NOVA
                </span>
            )}
            <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-lg">
                    {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                    <h4
                        className={`text-sm ${
                            notification.read ? "font-medium" : "font-semibold"
                        } text-gray-900 dark:text-gray-100`}
                    >
                        {notification.title}
                    </h4>
                    <p
                        className={`text-sm mt-1 line-clamp-2 ${
                            notification.read
                                ? "text-gray-600 dark:text-gray-400"
                                : "text-gray-700 dark:text-gray-300"
                        }`}
                    >
                        {notification.message}
                    </p>
                    <span className="text-xs text-gray-400 dark:text-gray-500 mt-2 block">
                        {formatTime(notification.created_at)}
                    </span>
                </div>
                {!notification.read && (
                    <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2" />
                )}
            </div>
        </div>
    );
}
