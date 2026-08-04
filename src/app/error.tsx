"use client";

import { Button } from "@radix-ui/themes";
import { Card } from "../components/common/Card";

type ErrorPageProps = {
  reset: () => void;
};

export default function Error({ reset }: ErrorPageProps) {
  return (
    <Card className="flex flex-col flex-1items-center justify-center gap-4 p-8 text-center">
      <h1 className="page-title">Error</h1>
      <Button onClick={reset}>Try again</Button>
    </Card>
  );
}
