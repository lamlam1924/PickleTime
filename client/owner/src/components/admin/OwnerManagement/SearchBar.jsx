import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({ searchTerm, handleSearch }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Tìm theo tên, email, hoặc số điện thoại..."
        className="input input-bordered w-full pr-10"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <Search className="absolute top-3 right-3 h-5 w-5 text-gray-400" />
    </div>
  );
};

export default SearchBar;
