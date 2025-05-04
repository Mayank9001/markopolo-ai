import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import UserTable from "./components/UserTable";

const App = () => {
  const [search, setSearch] = useState("");
  return (
    <div className="p-4">
      <SearchBar onSearch={setSearch} />
      <UserTable search={search} />
      <a
        href="https://github.com/Mayank9001"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4"
      >
        <img
          src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
          alt="GitHub"
          className="w-8 h-8 hover:opacity-60 transition"
        />
      </a>
    </div>
  );
};

export default App;
