import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

function Button({ active, className = "", children, ...props }: ButtonProps) {
  return (
    <button
      className={`flex items-center justify-center transition-colors cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
