// "use client";

import { TripCard } from "@/components/trip/TripCard";
import { useAuthStore } from "@/lib/authStore";
import { fetchUserData } from "@/lib/travelApi";
import { redirect } from "next/navigation";

// TODO надо бы получать пользователя из сессии, но для демо пока так
export default async function MePage() {
  const currentUser = {
    id: "u1",
    name: "Анастасия",
    avatarColor: "#2563eb",
    homeCity: "Москва",
    password: '',
    email: ''
  }; //useAuthStore((state) => state.currentUser);

  const { trips } = await fetchUserData(currentUser.id);
  
  if (!currentUser) {
    redirect("/login");
  }


  return (
    <div>
      <p>ИМЯ {currentUser.name}</p>
      <div className="grid gap-4 md:grid-cols-2">
        {trips.map((trip) => {
          return <TripCard key={trip.id} trip={trip} author={currentUser} />;
        })}
      </div>
    </div>
  );
}
