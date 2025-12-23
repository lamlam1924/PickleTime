// @hooks/customer/useNotifications.js
import { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import {useQueryClient} from "@tanstack/react-query";
import axiosInstance from "@hooks/useAxiosInstance.js";

export const useNotifications = (userId) => {
    const [notifications, setNotifications] = useState([]);
    const connectionRef = useRef(null);
    const hasJoinedGroup = useRef(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!userId) {
            setNotifications([]);
            return;
        }

        // Nếu đã có kết nối → chỉ join group
        if (connectionRef.current && connectionRef.current.state !== signalR.HubConnectionState.Disconnected) {
            if (!hasJoinedGroup.current) {
                connectionRef.current.invoke("JoinUserGroup", Number(userId))
                    .then(() => hasJoinedGroup.current = true)
                    .catch(() => {});
            }
            return;
        }

        // Tạo kết nối mới
        let token = null;
        // Ưu tiên token từ localStorage
        const lsToken = localStorage.getItem("accessToken");
        if (lsToken) token = lsToken;
        if (!token) {
            const persisted = localStorage.getItem("persist:root");
            if (persisted) {
                try {
                    const parsed = JSON.parse(persisted);
                    token = JSON.parse(parsed.auth)?.token;
                } catch {}
            }
        }
        if (!token) {
            const authHeader = axiosInstance.defaults.headers?.Authorization;
            if (authHeader) token = authHeader.replace("Bearer ", "");
        }

        if (!token) {
            console.warn("No token for SignalR");
            return;
        }

        const connection = new signalR.HubConnectionBuilder()
            // Use relative path to go through Vite proxy and avoid CORS
            .withUrl("/notificationHub", { accessTokenFactory: () => token })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Warning)
            .build();

        connectionRef.current = connection;
        hasJoinedGroup.current = false;

        connection.on("ReceiveNotification", (notif) => {
            setNotifications(prev => [{
                id: notif.id,
                typeId: notif.typeId,
                title: notif.title,
                message: notif.message,
                requestId: notif.requestId,
                read: false,
                timestamp: notif.timestamp || new Date().toISOString()
            }, ...prev]);
            queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
        });

        connection.onreconnected(() => {
            if (userId) connection.invoke("JoinUserGroup", Number(userId)).catch(() => {});
        });

        const start = async () => {
            try {
                await connection.start();
                console.log("SignalR connected");
                await connection.invoke("JoinUserGroup", Number(userId));
                hasJoinedGroup.current = true;
            } catch (err) {
                console.error("SignalR error:", err);
            }
        };

        void start();

    }, [userId, queryClient]);

    return { notifications, setNotifications };
};