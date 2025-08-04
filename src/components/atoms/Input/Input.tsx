import React, { useState } from "react";
import type { InputProps } from "../../../types";

export const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder,
  value,
  onChange,
  disabled = false,
  error,
  label,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;
  const hasError = Boolean(error);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const inputClasses = `
    w-full px-4 py-3 text-base border-2 rounded-lg bg-rick-surface text-rick-text
    placeholder-rick-text/60 transition-all duration-200 ease-in-out
    focus:border-rick-primary focus:ring-4 focus:ring-rick-primary/20
    disabled:bg-rick-text/10 disabled:cursor-not-allowed disabled:opacity-60
    ${
      hasError
        ? "border-rick-error focus:border-rick-error focus:ring-rick-error/20"
        : "border-[#212C31]"
    }
  `.trim();

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="font-bold text-rick-text text-xl">{label}</label>
      )}
      <div className="relative w-full">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={inputClasses}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={handleTogglePassword}
            disabled={disabled}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 focus:outline-2 focus:outline-rick-primary focus:outline-offset-2 focus:rounded-sm transition-opacity duration-200"
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            {showPassword ? (
              <img
                src="/ico_eye_closed.svg"
                alt="Ocultar contraseña"
                className="color-black"
              />
            ) : (
              <img
                src="/ico_eye.svg"
                alt="Ver contraseña"
                className="color-black"
              />
            )}
          </button>
        )}
      </div>
      {error && (
        <span className="text-rick-error text-xs font-medium">{error}</span>
      )}
    </div>
  );
};
