import {useEffect, useState} from "react";
import AdvancedSearchFilter from "@components/search/AdvancedSearchFilter.jsx";
import useFacilityData from "@hooks/useFacilityData.jsx";
import FacilityCardSkeleton from "@components/ui/FacilityCardSkeleton.jsx";
import FacilityCard from "@components/turf/FacilityCard.jsx";

const Facility = () => {
    const { turfs= [], loading, error } = useFacilityData();
    const [filteredTurfs, setFilteredTurfs] = useState([]);

    useEffect(() => setFilteredTurfs(turfs), [turfs]);
    
    const applyFilters = (filters) => {
        let filtered = [...turfs];

        // Search term filter
        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(
                (turf) =>
                    turf.facilityName.toLowerCase().includes(searchLower) ||
                    turf.address.toLowerCase().includes(searchLower) ||
                    turf.description?.toLowerCase().includes(searchLower)
            );
        }

        // Location filters
        if (filters.province) {
            filtered = filtered.filter((turf) => turf.province === filters.province);
        }
        if (filters.district) {
            filtered = filtered.filter((turf) =>
                turf.district.toLowerCase().includes(filters.district.toLowerCase())
            );
        }

        // Rating filter
        if (filters.minRating > 0) {
            filtered = filtered.filter((turf) => (turf.rating || 0) >= filters.minRating);
        }

        // Court type filter (need to check if facility has courts of this type)
        if (filters.courtTypes.length > 0) {
            filtered = filtered.filter((turf) => {
                // Assuming courts data is available in turf object
                if (!turf.courts || turf.courts.length === 0) return false;
                return turf.courts.some((court) =>
                    filters.courtTypes.some((type) => 
                        court.type?.toLowerCase().includes(type.toLowerCase())
                    )
                );
            });
        }

        // Indoor/Outdoor filter
        if (filters.isIndoor !== null) {
            filtered = filtered.filter((turf) => {
                if (!turf.courts || turf.courts.length === 0) return false;
                return turf.courts.some((court) => court.isIndoor === filters.isIndoor);
            });
        }

        // Lighting filter
        if (filters.hasLighting) {
            filtered = filtered.filter((turf) => {
                if (!turf.courts || turf.courts.length === 0) return false;
                return turf.courts.some((court) => court.hasLighting);
            });
        }

        // Sorting
        switch (filters.sortBy) {
            case "rating":
                filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case "name":
                filtered.sort((a, b) => a.facilityName.localeCompare(b.facilityName));
                break;
            case "newest":
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            default: // relevance
                break;
        }

        setFilteredTurfs(filtered);
    };

    const handleReset = () => {
        setFilteredTurfs(turfs);
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 ">
            <h1 className="text-3xl font-bold text-center mb-8">Tìm sân chơi lý tưởng</h1>
            <AdvancedSearchFilter onFilterChange={applyFilters} onReset={handleReset} />
            
            {/* Results count */}
            <div className="mb-4 text-sm text-gray-600">
                Tìm thấy <span className="font-semibold">{filteredTurfs.length}</span> cơ sở
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading
                    ? Array.from({ length: 3 }).map((_, index) => (
                        <FacilityCardSkeleton key={`skeleton-${index}`} />
                    ))
                    : (filteredTurfs.length > 0 ? filteredTurfs : turfs).map((turf) => (
                        <FacilityCard key={turf.facilityId} turf={turf} />
                    ))}
            </div>

            {/* No results message */}
            {!loading && filteredTurfs.length === 0 && turfs.length > 0 && (
                <div className="text-center py-12">
                    <p className="text-lg text-gray-500 mb-2">Không tìm thấy cơ sở phù hợp</p>
                    <p className="text-sm text-gray-400">Thử điều chỉnh bộ lọc của bạn</p>
                </div>
            )}
        </div>
    );
};

export default Facility;
