import { useState, useEffect } from "react";
import axiosInstance from "./useAxiosInstance";

const useFacilityById = (id) => {
    const [facility, setFacility] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFacility = async () => {
            try {
                const response = await axiosInstance.get(`/api/facilities/${id}`);
                setFacility(response.data);
            } catch (error) {
                console.error("Failed to fetch facility:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFacility();
    }, [id]);

    return { facility, loading };
};

export default useFacilityById;
