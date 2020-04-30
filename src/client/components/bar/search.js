import React, { useState } from "react";
import { UsersSearchQuery } from "../queries/SearchQuery";
import { SearchList } from "./searchList";

export const SearchBar = () => {
  const [text, changeText] = useState("");

  return (
    <div className="search">
      <input
        type="text"
        onChange={() => {
          changeText(event.target.value);
        }}
        value={text}
      />
      <UsersSearchQuery variables={{ text }}>
        <SearchList />
      </UsersSearchQuery>
    </div>
  );
};
