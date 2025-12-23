// src/components/admin/OwnerRequests/RejectedOwnerRequests.jsx
import React from "react";
import useOwnerRequests from "@hooks/admin/useOwnerRequests";
import OwnerRequestsSkeleton from "@components/admin/OwnerRequests/OwnerRequestSkeleton";
import OwnerRequestSearch from "@components/admin/OwnerRequests/OwnerRequestSearch";
import OwnerRequestCard from "@components/admin/OwnerRequests/OwnerRequestsCard";

const RejectedOwnerRequests = () => {
    const {
        rejectedRequests,
        loading,
        requestId: processingId,
        handleSearch,
        handleReconsider,
    } = useOwnerRequests();

    if (loading) return <OwnerRequestsSkeleton />;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center text-primary">
                Yêu cầu bị từ chối
            </h1>

            <div className="mb-6">
                <OwnerRequestSearch handleSearch={handleSearch} />
            </div>

            {rejectedRequests.length === 0 ? (
                <div className="alert alert-info shadow-lg">
                    <span>Hiện không có yêu cầu nào bị từ chối.</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rejectedRequests.map((request) => (
                        <OwnerRequestCard
                            key={request.requestId}
                            request={request}
                            onReconsider={handleReconsider}
                            isProcessing={processingId === request.requestId}
                            isRejected={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default RejectedOwnerRequests;