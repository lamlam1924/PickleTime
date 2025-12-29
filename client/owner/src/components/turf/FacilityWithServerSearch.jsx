import { useEffect, useState } from "react";
import AdvancedSearchFilter from "@components/search/AdvancedSearchFilter.jsx";
import useFacilityData from "@hooks/useFacilityData.jsx";
import useAdvancedSearch from "@hooks/useAdvancedSearch.js";
import FacilityCardSkeleton from "@components/ui/FacilityCardSkeleton.jsx";
import FacilityCard from "@components/turf/FacilityCard.jsx";

/**
 * FacilityWithServerSearch - Version with server-side filtering
 * Use this when you have many facilities and need better performance
 */
const FacilityWithServerSearch = () => {
    const { search, loading, error, results } = useAdvancedSearch();
    const [facilities, setFacilities] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        // Initial load
        handleSearch({
            searchTerm: "",
            sortBy: "relevance",
            page: 1,
            pageSize: 12,
        });
    }, []);

    useEffect(() => {
        if (results) {
            setFacilities(results.facilities);
            setTotalPages(results.totalPages);
            setCurrentPage(results.page);
        }
    }, [results]);

    const handleSearch = async (filters) => {
        await search(filters);
    };

    const handleReset = () => {
        handleSearch({
            searchTerm: "",
            sortBy: "relevance",
            page: 1,
            pageSize: 12,
        });
    };

    const handlePageChange = (newPage) => {
        // Re-search with new page number
        // You might want to store current filters in state
        handleSearch({
            ...currentFilters,
            page: newPage,
        });
    };

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="alert alert-error">
                    <span>Error: {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Tìm sân chơi lý tưởng</h1>
            
            <AdvancedSearchFilter onFilterChange={handleSearch} onReset={handleReset} />

            {/* Results count */}
            <div className="mb-4 text-sm text-gray-600">
                Tìm thấy <span className="font-semibold">{results?.totalCount || 0}</span> cơ sở
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading
                    ? Array.from({ length: 6 }).map((_, index) => (
                          <FacilityCardSkeleton key={`skeleton-${index}`} />
                      ))
                    : facilities.map((turf) => <FacilityCard key={turf.facilityId} turf={turf} />)}
            </div>

            {/* No results message */}
            {!loading && facilities.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-lg text-gray-500 mb-2">Không tìm thấy cơ sở phù hợp</p>
                    <p className="text-sm text-gray-400">Thử điều chỉnh bộ lọc của bạn</p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <div className="join">
                        <button
                            className="join-item btn"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            «
                        </button>
                        
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                className={`join-item btn ${currentPage === i + 1 ? "btn-active" : ""}`}
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        
                        <button
                            className="join-item btn"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            »
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FacilityWithServerSearch;
