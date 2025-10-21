import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../useAxiosInstance";
import toast from "react-hot-toast";

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/users");
      const result = response.data.data || response.data;
      const usersList = result.users || result;
      
      // Filter out Managers (RoleId = 2 / roleName = 'manager')
      // Only show Customers and Admins in User Management
      const nonManagerUsers = usersList.filter(
        user => user.roleName?.toLowerCase() !== 'manager'
      );
      
      console.log("Fetched users (excluding managers):", nonManagerUsers);
      setUsers(nonManagerUsers);
      setFilteredUsers(nonManagerUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = useCallback(
    (term) => {
      setSearchTerm(term);
      const filtered = users.filter(
        (user) =>
          user.fullName?.toLowerCase().includes(term.toLowerCase()) ||
          user.userName?.toLowerCase().includes(term.toLowerCase()) ||
          user.email?.toLowerCase().includes(term.toLowerCase()) ||
          user.phone?.includes(term) // Search by phone number (exact or partial match)
      );
      setFilteredUsers(filtered);
    },
    [users]
  );

  return { 
    users: filteredUsers, 
    loading, 
    searchTerm, 
    handleSearch, 
    refreshUsers: fetchUsers 
  };
};

export default useUsers;
