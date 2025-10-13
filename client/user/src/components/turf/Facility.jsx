import {useEffect, useState} from "react";
import FacilityCard from "./FacilityCard.jsx";
import FacilityCardSkeleton from "../ui/FacilityCardSkeleton.jsx";
import useFacilityData from "../../hooks/useFacilityData.jsx";
import SearchFacility from "../search/SearchFacility.jsx";

const Facility = () => {
    const { turfs= [], loading, error } = useFacilityData();
    const [filteredTurfs, setFilteredTurfs] = useState([]);

    useEffect(() => setFilteredTurfs(turfs), [turfs]);
    
    const handleSearch = (searchTerm) => {
        const filtered = turfs.filter(
            (turf) =>
                turf.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                turf.address.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTurfs(filtered);
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 ">
            <h1 className="text-3xl font-bold text-center mb-8">Tìm sân chơi lý tưởng</h1>
            <SearchFacility onSearch={handleSearch} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading
                    ? Array.from({ length: 3 }).map((_, index) => (
                        <FacilityCardSkeleton key={`skeleton-${index}`} />
                    ))
                    : (filteredTurfs.length > 0 ? filteredTurfs : turfs).map((turf) => (
                        <FacilityCard key={turf.facilityId} turf={turf} />
                    ))}
            </div>
        </div>
    );
};

export default Facility;
