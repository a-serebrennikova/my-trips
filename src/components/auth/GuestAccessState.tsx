import Link from "next/link";
import { Card } from "@/src/components/common/Card";

export function GuestAccessState({
  title = "Need to login",
  description = "This page is available only for authenticated users.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Card className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="page-title">{title}</h1>
      <p className="text-standard">{description}</p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-full bg-teal-600 px-5 py-2.5 font-semibold text-white transition hover:bg-teal-500"
      >
        Go to home
      </Link>
    </Card>
  );
}
