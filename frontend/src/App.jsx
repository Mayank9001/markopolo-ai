import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import UserTable from "./components/UserTable";

const App = () => {
  const [search, setSearch] = useState("");
  return (
    <div className="p-4">
      <SearchBar onSearch={setSearch} />
      <UserTable search={search} />
    </div>
  );
};

export default App;
