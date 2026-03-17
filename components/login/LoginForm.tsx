"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";
import type { User } from "@/lib/travelStore";

const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(1, "Введите пароль"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface Props {
  users: User[];
}

export function LoginForm({ users }: Props) {
  const router = useRouter();
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    setLoginError(null);

    const user = users.find(
      (u) => u.email === data.email && u.password === data.password,
    );

    if (user) {
      setCurrentUser(user);
      router.push("/trips");
    } else {
      setLoginError("Неверный email или пароль");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-2.5 text-sm text-slate-800 outline-none ring-sky-400 focus:bg-white focus:ring-2"
            placeholder="example@mail.ru"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700"
          >
            Пароль
          </label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className="w-full rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-2.5 text-sm text-slate-800 outline-none ring-sky-400 focus:bg-white focus:ring-2"
            placeholder="Введите пароль"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        {loginError && <p className="text-sm text-red-500">{loginError}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Вход..." : "Войти"}
      </button>
    </form>
  );
}
