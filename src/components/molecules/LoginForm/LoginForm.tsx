import React, { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "../../atoms/Button";
import { Input } from "../../atoms/Input";
import { useAuth } from "../../../contexts/AuthContext";

export const LoginFormComponent: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { login, isLoading } = useAuth();

  const validateForm = (): boolean => {
    let isValid = true;

    // Reset errors
    setUsernameError("");
    setPasswordError("");
    setError("");

    // Validate username
    if (!username.trim()) {
      setUsernameError("El usuario es requerido");
      isValid = false;
    } else if (username.trim().length < 3) {
      setUsernameError("El usuario debe tener al menos 3 caracteres");
      isValid = false;
    }

    // Validate password
    if (!password.trim()) {
      setPasswordError("La contraseña es requerida");
      isValid = false;
    } else if (password.trim().length < 4) {
      setPasswordError("La contraseña debe tener al menos 4 caracteres");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await login(username.trim(), password.trim());
    if (!success) {
      setError("Credenciales inválidas. Por favor, intenta de nuevo.");
    }
  };

  const handleForgotPassword = () => {
    alert(
      "Funcionalidad de recuperación de contraseña no implementada en esta demo."
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-rick-background px-6">
      <div className="bg-rick-surface p-14 rounded-[14.23px] w-full max-w-[612px] shadow-rick-lg relative overflow-hidden">
        {/* Logo */}
        <div className="flex justify-center mb-11 px-10 md:px-[84.7px]">
          <img src="/Rick_and_Morty.svg" alt="Rick and Morty Logo" />
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <Input
            type="text"
            label="Usuario"
            placeholder=""
            value={username}
            onChange={setUsername}
            disabled={isLoading}
            error={usernameError}
          />

          <Input
            type="password"
            label="Contraseña"
            placeholder=""
            value={password}
            onChange={setPassword}
            disabled={isLoading}
            error={passwordError}
          />

          {error && (
            <div className="bg-rick-error/20 text-rick-error p-3 rounded-lg border-l-4 border-rick-error text-sm text-center">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="large"
            loading={isLoading}
            disabled={isLoading}
            extraClasses="mt-2"
          >
            Iniciar sesión
          </Button>
        </form>

        {/* Forgot Password */}
        <div className="text-center mt-11 text-rick-text text-sm">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-rick-text-secondary text-[24.91px] font-semibold hover:text-rick-secondary transition-colors duration-200"
          >
            ¿Olvidaste tu usuario o contraseña?
          </button>
        </div>
      </div>
    </div>
  );
};
