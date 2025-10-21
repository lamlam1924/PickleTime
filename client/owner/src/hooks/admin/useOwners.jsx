// useOwners.jsx
import { useState, useEffect } from "react";
import axiosInstance from "../useAxiosInstance";

const useOwners = () => {
  const [owners, setOwners] = useState({
    all: [],
    filtered: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value === "") {
      setOwners((prev) => {
        console.log(prev, "prev");
        return {
          ...prev,
          filtered: prev.all,
        };
      });
    } else {
      const filtered = owners.all.filter(
        (owner) =>
          owner.fullName?.toLowerCase().includes(value.toLowerCase()) ||
          owner.userName?.toLowerCase().includes(value.toLowerCase()) ||
          owner.email?.toLowerCase().includes(value.toLowerCase()) ||
          owner.phone?.includes(value) // Search by phone number (exact or partial match)
      );
      setOwners((prev) => ({
        ...prev,
        filtered: filtered,
      }));
    }
  };

  const fetchOwners = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/admin/owners/list");
      const result = response.data.data || response.data;
      const ownersList = result.owners || result;
      console.log("Fetched owners:", ownersList);
      setOwners({
        all: ownersList,
        filtered: ownersList,
      });
    } catch (err) {
      console.error("Error fetching owners:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  return { 
    owners: {
      all: owners.all,
      filtered: owners.filtered
    }, 
    loading, 
    searchTerm, 
    handleSearch,
    refreshOwners: fetchOwners 
  };
};

export default useOwners;
