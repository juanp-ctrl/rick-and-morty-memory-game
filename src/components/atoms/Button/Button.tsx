import React from "react";
import type { ButtonProps } from "../../../types";

const getVariantClasses = (variant: ButtonProps["variant"]) => {
  switch (variant) {
    case "secondary":
      return "text-black font-semibold border-gray-400 px-[80px] bg-rick-blue border-rick-green";
    case "tertiary":
      return "bg-rick-green text-[#233A59] border-rick-blue";
    default:
      return "bg-rick-primary text-white font-semibold hover:bg-rick-primary border-rick-button";
  }
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  disabled = false,
  loading = false,
  onClick,
  children,
  type = "button",
  extraClasses,
}) => {
  const isDisabled = disabled || loading;

  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-lg btn-hover-effect border-b-4 border-l-4 shadow-rick-button px-20";
  const variantClasses = getVariantClasses(variant);
  const stateClasses = isDisabled ? "opacity-60 cursor-not-allowed" : "";

  const className =
    `${baseClasses} ${variantClasses} py-3 text-2xl tracking-widest leading-6 ${stateClasses}`.trim();

  return (
    <button
      type={type}
      className={`${className} ${extraClasses}`}
      disabled={isDisabled}
      onClick={onClick}
    >
      {loading ? (
        <div className="relative">
          <span className="opacity-0">{children}</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full spinner"></div>
          </div>
        </div>
      ) : (
        children
      )}
    </button>
  );
};
