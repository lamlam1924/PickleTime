// src/components/admin/OwnerRequests/OwnerRequestSearch.jsx
import React, { useState } from "react";
import { Search } from "lucide-react";

const OwnerRequestSearch = ({ handleSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSearch(searchTerm.trim());
    };

    return (
        <form onSubmit={handleSubmit} className="form-control w-full max-w-xs">
            <label className="label">
                <span className="label-text">Tìm kiếm</span>
            </label>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Nhập tên hoặc email..."
                    className="input input-bordered w-full pr-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="absolute top-2 right-2 btn btn-ghost btn-circle">
                    <Search className="h-5 w-5" />
                </button>
            </div>
        </form>
    );
};

export default OwnerRequestSearch;