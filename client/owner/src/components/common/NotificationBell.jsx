import {useState, useEffect, useRef} from "react";
import {AnimatePresence, motion} from "framer-motion";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {formatDistanceToNow} from "date-fns";
import {vi} from "date-fns/locale";
import {Bell, Send, CheckCircle2, XCircle, Inbox, Trash2, Eye} from "lucide-react";
import axiosInstance from "../../hooks/useAxiosInstance";
import {useNavigate} from "react-router-dom";
import {useNotifications} from "@hooks/useNotifications.js";

const TYPE_CONFIG = {
    1: {icon: Send, color: "text-info", bg: "bg-info/10"},
    2: {icon: CheckCircle2, color: "text-success", bg: "bg-success/10"},
    3: {icon: XCircle, color: "text-error", bg: "bg-error/10"},
    4: {icon: Bell, color: "text-warning", bg: "bg-warning/10"},
};

const NotificationBell = ({userId}) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {notifications: realtimeNotifs, setNotifications: setRealtime} = useNotifications(userId);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [hasNewNotification, setHasNewNotification] = useState(false);
    const prevCountRef = useRef(0);

    // Lấy lịch sử từ API
    const {data: historyData = [], isLoading: isLoadingHistory} = useQuery({
        queryKey: ["notifications", userId],
        queryFn: () => axiosInstance.get("/notifications").then(res => res.data),
        enabled: !!userId, // GỌI NGAY KHI CÓ USERID
        staleTime: 5 * 60 * 1000,
    });

    // Merge realtime + lịch sử
    const allNotifications = [
        ...realtimeNotifs,
        ...historyData
    ].filter((notif, index, self) =>
        index === self.findIndex(n => n.id === notif.id)
    ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const unreadCount = allNotifications.filter(n => !n.read).length;

    // Rung chuông
    useEffect(() => {
        const currentCount = realtimeNotifs.length;
        const prevCount = prevCountRef.current;

        if (currentCount > prevCount && !isOpen) {
            setHasNewNotification(true);
            const timer = setTimeout(() => setHasNewNotification(false), 5000);
            return () => clearTimeout(timer);
        }

        prevCountRef.current = currentCount;
    }, [realtimeNotifs, isOpen]);

    const ringAnimation = hasNewNotification ? {
        rotate: [0, -15, 15, -15, 15, -10, 10, -5, 5, 0],
        transition: {duration: 0.8, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut"}
    } : {};

    // Click ngoài
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
        };
        if (isOpen) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [isOpen]);

    // Mutation: đánh dấu đã đọc
    const markReadMutation = useMutation({
        mutationFn: (ids) => axiosInstance.post("/notifications/mark-read", { ids }),
        onSuccess: async (data, ids) => {
            setRealtime(prev => prev.map(notif =>
                ids.includes(notif.id) ? { ...notif, read: true } : notif
            ));

            await queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
        }
    });

    // Mutation: xóa
    const deleteMutation = useMutation({
        mutationFn: (ids) => axiosInstance.delete("/notifications", {data: {ids}}),
        onSuccess: async (data, ids) => {
            setRealtime(prev => prev.map(notif =>
                ids.includes(notif.id) ? { ...notif, read: true } : notif
            ));

            await queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
        }
    });

    const handleMarkRead = (ids) => markReadMutation.mutate(ids);
    const handleDelete = (ids) => deleteMutation.mutate(ids);

    const handleClickNotif = (notif) => {
        if (!notif.read) handleMarkRead([notif.id]);
        if (notif.requestId) navigate(`/owner-requests/${notif.requestId}`);
    };

    const getIcon = (typeId) => {
        const config = TYPE_CONFIG[typeId] || TYPE_CONFIG[4];
        const Icon = config.icon;
        return <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bg}`}>
            <Icon className={`w-5 h-5 ${config.color}`}/>
        </div>;
    };

    return (
        <div className="relative">
            <motion.button
                className="btn btn-ghost btn-circle relative"
                animate={ringAnimation}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className="w-6 h-6"/>
                <AnimatePresence>
                    {unreadCount > 0 && (
                        <motion.div
                            initial={{scale: 0}} animate={{scale: 1}} exit={{scale: 0}}
                            className="absolute -top-1 -right-1 badge badge-error text-white text-xs h-5 min-w-5 rounded-full font-bold"
                        >
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={dropdownRef}
                        initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -20}}
                        className="absolute right-0 mt-3 w-96 bg-base-100 rounded-2xl shadow-2xl z-50 overflow-hidden border border-base-300"
                        style={{maxHeight: '80vh'}}
                    >
                        <div
                            className="bg-gradient-to-r from-primary to-secondary p-4 text-white flex justify-between items-center">
                            <h3 className="text-lg font-bold">Thông báo</h3>
                            <div className="flex gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={() => handleMarkRead(allNotifications.filter(n => !n.read).map(n => n.id))}
                                        className="text-xs bg-white text-primary px-2 py-1 rounded-full hover:bg-gray-100">
                                        Đánh dấu tất cả
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(allNotifications.filter(n => n.read).map(n => n.id))}
                                    className="text-xs bg-white text-error px-2 py-1 rounded-full hover:bg-gray-100">
                                    <Trash2 className="w-3 h-3"/>
                                </button>
                            </div>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {isLoadingHistory ? (
                                <div className="p-8 text-center">
                                    <span className="loading loading-spinner loading-md"></span>
                                    <p className="text-sm mt-2 text-base-content/60">Đang tải thông báo...</p>
                                </div>
                            ) : allNotifications.length === 0 ? (
                                <div className="p-8 text-center text-base-content/60">
                                    <Inbox className="w-12 h-12 mx-auto mb-3 opacity-50"/>
                                    <p>Chưa có thông báo</p>
                                </div>
                            ) : (
                                allNotifications.map((notif, idx) => (
                                    <motion.div
                                        key={notif.id}
                                        initial={{opacity: 0, x: -20}}
                                        animate={{opacity: 1, x: 0}}
                                        transition={{delay: idx * 0.05}}
                                        className={`flex gap-3 p-4 hover:bg-base-200 border-b border-base-300 last:border-0 cursor-pointer
                    ${!notif.read ? 'bg-blue-50 dark:bg-blue-900/20 font-medium' : 'text-base-content/60'}`}
                                        onClick={() => handleClickNotif(notif)}
                                    >
                                        {getIcon(notif.typeId)}
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-semibold text-sm truncate ${!notif.read ? 'text-base-content' : 'text-base-content/50'}`}>
                                                {notif.title}
                                            </p>
                                            <p className={`text-xs mt-1 line-clamp-2 ${!notif.read ? 'text-base-content/80' : 'text-base-content/40'}`}>
                                                {notif.message}
                                            </p>
                                            {notif.requestId && (
                                                <p className="text-xs text-primary mt-1 flex items-center gap-1">
                                                    <Eye className="w-3 h-3"/> ID: #{notif.requestId}
                                                </p>
                                            )}
                                            <p className="text-xs text-base-content/50 mt-2">
                                                {formatDistanceToNow(new Date(notif.timestamp), {
                                                    addSuffix: true,
                                                    locale: vi
                                                })}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete([notif.id]);
                                            }}
                                            className="text-error hover:bg-error/10 p-1 rounded"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                        {!notif.read && <div
                                            className="w-2 h-2 bg-error rounded-full animate-pulse self-center"></div>}
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;