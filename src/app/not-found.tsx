import { Card } from "../components/common/Card";

export default function NotFound() {
  return (
    <Card className="flex flex-col flex-1 items-center justify-center gap-4 p-8 text-center">
      <h1 className="page-title">Page not found</h1>
    </Card>
  );
}
