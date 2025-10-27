import { useSelector, useDispatch } from "react-redux";
import { setTurfs, setLoading, setError } from "../redux/slices/turfSlice";
import axiosInstance from "../hooks/useAxiosInstance";
import { useEffect } from "react";

const useFacilityData = () => {
  const dispatch = useDispatch();
  const { turfs, loading } = useSelector((state) => state.turf);

  useEffect(() => {
    const fetchTurfData = async () => {
      try {
        dispatch(setLoading(true));
        // Fetch your turf data here
<<<<<<<< HEAD:client/owner/src/hooks/useTurfData.jsx
        const response = await axiosInstance.get("/user/turf/all");
        const data = await response.data.turfs;
========
        const response = await axiosInstance.get("api/facilities/all");
        const data = await response.data;
>>>>>>>> feature/search/thanhlam:client/owner/src/hooks/useFacilityData.jsx
        dispatch(setTurfs(data));
      } catch (err) {
        dispatch(setError(err.message));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchTurfData();
  }, []);

  return { turfs, loading };
};

export default useFacilityData;
