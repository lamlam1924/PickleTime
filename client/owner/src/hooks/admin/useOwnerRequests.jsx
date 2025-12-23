// src/hooks/admin/useOwnerRequests.jsx
import {useState, useEffect, useCallback} from "react";
import axiosInstance from "../useAxiosInstance";
import toast from "react-hot-toast";
import {useLocation} from "react-router-dom";

const useOwnerRequests = () => {
    const [requests, setRequests] = useState([]);
    const [allRequests, setAllRequests] = useState([]);
    const [rejectedRequests, setRejectedRequests] = useState([]);
    const [allRejectedRequests, setAllRejectedRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [requestId, setRequestId] = useState(null); // ← Thống nhất tên

    const location = useLocation();
    const currentPath = location.pathname.split("/").pop();

    // Reset khi đổi tab
    useEffect(() => {
        if (!Array.isArray(allRequests) || !Array.isArray(allRejectedRequests)) return;
        if (currentPath === "new") setRequests(allRequests);
        else if (currentPath === "rejected") setRejectedRequests(allRejectedRequests);
    }, [currentPath, allRequests, allRejectedRequests]);

    // Tìm kiếm an toàn
    const handleSearch = useCallback(
        (term) => {
            const lower = term.trim().toLowerCase();
            if (!Array.isArray(allRequests) || !Array.isArray(allRejectedRequests)) return;

            if (lower === "") {
                setRequests(allRequests);
                setRejectedRequests(allRejectedRequests);
                return;
            }

            const safeLower = (str) => (typeof str === "string" ? str.toLowerCase() : "");
            const filter = (list) =>
                list.filter((r) => {
                    const fullName = safeLower(r.fullName);
                    const email = safeLower(r.email);
                    return fullName.includes(lower) || email.includes(lower);
                });

            if (currentPath === "new") setRequests(filter(allRequests));
            else if (currentPath === "rejected") setRejectedRequests(filter(allRejectedRequests));
        },
        [allRequests, allRejectedRequests, currentPath]
    );

    // Lấy dữ liệu + sanitize
    const fetchRequests = async () => {
        setLoading(true);
        try {
            const {data = []} = await axiosInstance.get("/AdminOwnerRequests/list");
            const sanitize = (item) => ({
                ...item,
                fullName: item.fullName || item.FullName || "",
                email: item.email || item.Email || "",
            });
            const sanitizedData = data.map(sanitize);

            const pending = sanitizedData.filter((r) => Number(r.statusId) === 1);
            const rejected = sanitizedData.filter((r) => Number(r.statusId) === 3);

            setAllRequests(pending);
            setRequests(pending);
            setAllRejectedRequests(rejected);
            setRejectedRequests(rejected);
        } catch (err) {
            console.error("[ERROR] Fetch:", err);
            toast.error("Không thể tải danh sách");
            setAllRequests([]);
            setRequests([]);
            setAllRejectedRequests([]);
            setRejectedRequests([]);
        } finally {
            setLoading(false);
        }
    };

    // Hành động chung
    const callAction = async (id, endpoint, msg) => {
        if (!id) return;
        setRequestId(id);
        try {
            await axiosInstance.put(`/AdminOwnerRequests/${id}/${endpoint}`);
            toast.success(msg);
            await fetchRequests();
        } catch (error) {
            console.error(`${endpoint} error:`, error);
            toast.error(msg.replace("Đã ", "") + " thất bại");
        } finally {
            setRequestId(null);
        }
    };

    const handleAccept = (id) => callAction(id, "accept", "Đã duyệt");
    const handleReject = (id) => callAction(id, "reject", "Đã từ chối");
    const handleReconsider = (id) => callAction(id, "reconsider", "Đã xem xét lại");

    useEffect(() => {
        (async () => {
            await fetchRequests();
        })();
    }, [currentPath]);

    return {
        requests,
        rejectedRequests,
        loading,
        requestId,
        handleSearch,
        handleAccept,
        handleReject,
        handleReconsider,
    };
};

export default useOwnerRequests;