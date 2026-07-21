import Link from "next/link";
import { LoginForm } from "@/components/login/LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-md py-2">
      <div className="glass-card space-y-6 p-6 sm:p-8">
        <Link
          href={"/"}
          className="text-xs font-medium text-sky-700 hover:text-sky-600"
        >
          ← Back to home
        </Link>
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">
            AUTHORIZATION
          </p>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            Sign in
          </h1>
          <p className="max-w-md text-sm text-slate-600">
            Enter your email and password to sign in. Test account credentials
            are available in README.
          </p>
        </header>

        <LoginForm />
      </div>
    </div>
  );
}
