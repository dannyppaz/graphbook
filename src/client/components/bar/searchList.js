import React, { Component, useState, useEffect } from "react";

export const SearchList = ({ users }) => {
  const checkLength = users => {
    if (users.length > 0) {
      document.addEventListener("click", closeList);
      return true;
    } else {
      return false;
    }
  };

  const closeList = () => {
    setShowList(false);
  };

  const showListFn = users => {
    if (checkLength(users)) {
      setShowList(true);
    } else {
      closeList();
    }
  };

  const [showList, setShowList] = useState(checkLength(users));

  useEffect(() => {
    showListFn(users);
    return () => {
      document.removeEventListener("click", closeList);
    };
  });

  return (
    showList && (
      <div className="result">
        {users.map((user, i) => (
          <div key={user.id} className="user">
            <img src={user.avatar} />
            <span>{user.username}</span>
          </div>
        ))}
      </div>
    )
  );
};
