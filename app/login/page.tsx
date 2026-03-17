import { fetchTravelData } from "../../lib/travelApi";
import Link from "next/link";
import { LoginForm } from "@/components/login/LoginForm";

export default async function LoginPage() {
  const { users } = await fetchTravelData();

  return (
    <div className="glass-card space-y-6 bg-white/95 p-6 sm:p-8">
      <Link
        href={"/"}
        className="text-xs font-medium text-sky-700 hover:text-sky-600"
      >
        ← На главную
      </Link>
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
          АВТОРИЗАЦИЯ
        </p>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          Вход в аккаунт
        </h1>
        <p className="max-w-md text-sm text-slate-600">
          Введите email и пароль для входа в систему. Для демо-версии
          используйте данные из списка ниже.
        </p>
      </header>

      <div className="rounded-xl bg-slate-50 p-4">
        <p className="text-xs font-medium text-slate-600 mb-2">
          Демо пользователи:
        </p>
        <div className="space-y-1 text-xs text-slate-500">
          {users.map((user) => (
            <p key={user.id}>
              <span className="font-medium text-slate-700">{user.email}</span> /{" "}
              {user.password}
            </p>
          ))}
        </div>
      </div>

      <LoginForm users={users} />
    </div>
  );
}
