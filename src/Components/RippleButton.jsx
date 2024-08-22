import React, { useState } from "react";

const RippleButton = ({ className, name, open ,disabled}) => {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
    };

    setRipples((prevRipples) => [...prevRipples, newRipple]);
    open();
  };

  return (
    <button className={`ripple-container ${className}`} disabled={disabled} onClick={handleClick}>
      {ripples.map((ripple, index) => (
        <span
          key={index}
          className="ripple"
          style={{
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}
      {name}
    </button>
  );
};

export default RippleButton;
