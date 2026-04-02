"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginForm() {
  const { t } = useTranslation();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const emailValue = email.trim();
    if (!emailValue || !password.trim()) {
      setError(t("LoginPage.requiredFields"));
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailValue,
          password,
        }),
      });

      if (!res.ok) {
        let message = "";
        try {
          const data = await res.json();
          message = data?.message || data?.error || "";
        } catch { }

        if (res.status === 401 || res.status === 400) {
          setError(message || t("LoginPage.invalidCredentials"));
        } else {
          setError(message || t("LoginPage.unexpectedError"));
        }
        return;
      }

      window.location.href = "/dashboard";
    } catch {
      setError(t("LoginPage.unexpectedError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Email */}
      <div className="space-y-1.5">
        <Label
          htmlFor="email"
          className="text-sm font-medium text-gray-700 dark:text-[#e8e0d8]"
        >
          {t("LoginPage.email")}
        </Label>
        <Input
          id="email"
          type="email"
          placeholder={t("LoginPage.emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          autoComplete="email"
          autoFocus
          className="
            h-10
            bg-orange-50 dark:bg-[#302826]
            border-orange-200 dark:border-[#C96442]/25
            focus:border-[#F2651A] dark:focus:border-[#C96442]
            focus:ring-[#F2651A]/20 dark:focus:ring-[#C96442]/20
            placeholder:text-orange-300/70 dark:placeholder:text-[#C96442]/30
            text-gray-800 dark:text-[#f0ebe5]
          "
          aria-describedby={error ? "login-error" : undefined}
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label
          htmlFor="password"
          className="text-sm font-medium text-gray-700 dark:text-[#e8e0d8]"
        >
          {t("LoginPage.password")}
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder={t("LoginPage.passwordPlaceholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            autoComplete="current-password"
            className="
              h-10 pr-10
              bg-orange-50 dark:bg-[#302826]
              border-orange-200 dark:border-[#C96442]/25
              focus:border-[#F2651A] dark:focus:border-[#C96442]
              focus:ring-[#F2651A]/20 dark:focus:ring-[#C96442]/20
              placeholder:text-orange-300/70 dark:placeholder:text-[#C96442]/30
              text-gray-800 dark:text-[#f0ebe5]
            "
            aria-describedby={error ? "login-error" : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F2651A]/60 hover:text-[#F2651A] transition-colors"
            aria-label={
              showPassword
                ? t("LoginPage.hidePassword")
                : t("LoginPage.showPassword")
            }
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div
          id="login-error"
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 px-3 py-2.5 text-sm text-red-600 dark:text-red-400"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isLoading}
        className="
          w-full h-10
          bg-[#F2651A] hover:bg-[#D4561A]
          dark:bg-[#F2651A] dark:hover:bg-[#FF7A32]
          text-white font-semibold rounded-md
          transition-all duration-200
          shadow-md shadow-[#F2651A]/30
          hover:shadow-lg hover:shadow-[#F2651A]/40
          disabled:opacity-60
        "
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            {t("LoginPage.signingIn")}
          </span>
        ) : (
          t("LoginPage.signIn")
        )}
      </Button>
    </form>
  );
}