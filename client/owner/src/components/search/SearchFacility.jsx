import   { useState } from "react";

const SearchFacility = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-xl ml-auto mb-8 ">
      <input
        type="text"
        placeholder="Bạn muốn chơi ở đâu?"
        className="input input-bordered w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit" className="btn btn-primary ml-2">
        Tìm kiếm
      </button>
    </form>
  );
};

export default SearchFacility;
