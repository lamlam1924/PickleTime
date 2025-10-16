import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../useAxiosInstance";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

const useOwnerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [allRejectedRequests, setAllRejectedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestId, setRequestId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();

  const currentPath = location.pathname.split("/").pop();

  const handleSearch = useCallback(
    (term) => {
      setSearchTerm(term);
      if (term === "") {
        setRequests(allRequests);
        setRejectedRequests(allRejectedRequests);
        return;
      }
      setSearchTerm(term);
      const filtered =
        currentPath === "new"
          ? requests.filter(
              (request) =>
                request.name.toLowerCase().includes(term.toLowerCase()) ||
                request.email.toLowerCase().includes(term.toLowerCase())
            )
          : rejectedRequests.filter(
              (request) =>
                request.name.toLowerCase().includes(term.toLowerCase()) ||
                request.email.toLowerCase().includes(term.toLowerCase())
            );

      if (currentPath === "new") {
        setRequests(filtered);
      } else if (currentPath === "rejected") {
        setRejectedRequests(filtered);
      }
    },
    [allRequests, allRejectedRequests]
  );

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/api/admin/OwnerRequests/list");
      const data = await response.data; // mảng request từ backend

      // Lọc theo trạng thái
      const pendingRequests = data.filter(r => r.statusName.toLowerCase() === "pending");
      const rejected = data.filter(r => r.statusName.toLowerCase() === "rejected");
      
      setRequests(pendingRequests);
      setAllRequests(pendingRequests);
      setRejectedRequests(rejected);
      setAllRejectedRequests(rejected);

    } catch (err) {
      console.error("[ERROR] Failed to fetch owner requests:", err);
      toast.error(err.response.data.message|| "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    setRequestId(id);
    try {
      const response = await axiosInstance.put(
        `/api/admin/OwnerRequests/${id}/accept`
      );
      const result = await response.data;
       toast.success(result.message);
      setRequests(requests.filter((request) => request.requestId !== id));
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message);
    } finally {
      setRequestId("");
    }
  };

  const handleReject = async (id) => {
    setRequestId(id);
    try {
      const response = await axiosInstance.delete(
        `/api/admin/OwnerRequests/${id}`
      );
      const result = await response.data;
      toast.success(result.message);
      setRequests(requests.filter((request) => request.requestId !== id));
    } catch (err) {
      console.error(err, "delete error");
      toast.error(err.response?.data?.message);
    } finally {
      setRequestId("");
    }
  };

  const handleReconsider = async (id) => {
    setRequestId(id);
    try {
      const response = await axiosInstance.put(
        `/api/admin/OwnerRequests/reconsider/${id}`
      );
      const result = await response.data;
      toast.success(result.message);
      setRejectedRequests(
        rejectedRequests.filter((request) => request.requestId !== id)
      );
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    } finally {
      setRequestId("");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    loading,
    handleAccept,
    handleReject,
    requestId,
    rejectedRequests,
    handleReconsider,
    searchTerm,
    handleSearch,
  };
};

export default useOwnerRequests;
