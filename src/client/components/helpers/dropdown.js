import React, { useState, useEffect } from "react";

export const Dropdown = ({ trigger, children }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const handleClick = () => {
    setShow(prevShow => !prevShow);
    // if (show) {
    //   document.addEventListener("click", handleClick);
    // } else {
    //   document.removeEventListener("click", handleClick);
    // }
  };

  return (
    <div className="dropdown">
      <div>
        <div className="trigger" onClick={handleClick}>
          {trigger}
        </div>
        {show && <div className="content">{children}</div>}
      </div>
    </div>
  );
};
