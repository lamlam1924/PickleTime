// src/components/admin/OwnerRequests/NewOwnerRequests.jsx
import React from "react";
import useOwnerRequests from "@hooks/admin/useOwnerRequests";
import OwnerRequestsSkeleton from "@components/admin/OwnerRequests/OwnerRequestSkeleton";
import OwnerRequestSearch from "@components/admin/OwnerRequests/OwnerRequestSearch";
import OwnerRequestCard from "@components/admin/OwnerRequests/OwnerRequestsCard";

const NewOwnerRequests = () => {
    const {
        requests,
        loading,
        requestId: processingId,
        handleSearch,
        handleAccept,
        handleReject,
    } = useOwnerRequests();

    if (loading) return <OwnerRequestsSkeleton />;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center text-primary">
                Duyệt yêu cầu chủ sân
            </h1>

            <div className="mb-6">
                <OwnerRequestSearch handleSearch={handleSearch} />
            </div>

            {requests.length === 0 ? (
                <div className="alert alert-info shadow-lg">
                    <span>Hiện chưa có yêu cầu đăng ký chủ sân nào.</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {requests.map((request) => (
                        <OwnerRequestCard
                            key={request.requestId}
                            request={request}
                            onAccept={handleAccept}
                            onReject={handleReject}
                            isProcessing={processingId === request.requestId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default NewOwnerRequests;