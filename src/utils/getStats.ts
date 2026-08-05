import { UserProfileStat } from "../components/common/UserProfileHeader";
import { tagsColor } from "../consts/tags";
import { UserProfileData } from "../db/read-models";

export const getStats = (profileStats: UserProfileData['stats']) => {
  const { countriesCount, likesReceived, tripsCount } = profileStats;

  const stats: UserProfileStat[] = [
    { label: "Trips", value: tripsCount, color: tagsColor.trips },
    { label: "Likes", value: likesReceived, color: tagsColor.likes },
    { label: "Countries", value: countriesCount, color: tagsColor.countries },
  ];

  return stats;
};
