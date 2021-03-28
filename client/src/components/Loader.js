import React, { memo } from "react";

/**
 * Simple loading spinner component with optional message
 * @param {String} [message] an optional loading message to display with the spinner
 */
const Loader = ({ message }) => {
  return (
    <div className="Loader">
      <div className="lds-dual-ring"></div>
      {message !== "" && <h4 className="Loader__message">{message}</h4>}
    </div>
  );
};

export default memo(Loader);
