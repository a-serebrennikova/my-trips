import { TopTrips } from "../components/main/TopTrips";
import { AppInfo } from "../components/main/AppInfo";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 rounded-4xl p-3">
      <AppInfo />
      <TopTrips />
    </div>
  );
}
