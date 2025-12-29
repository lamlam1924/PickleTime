import { useState, useEffect } from "react";
import { facilityApi } from "../services/api";

const useFacilityById = (id) => {
    const [facility, setFacility] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFacility = async () => {
            try {
                const data = await facilityApi.getFacilityById(id);
                setFacility(data);
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
