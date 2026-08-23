import { User } from "@/src/types";
import { EmailIcon } from "./icons/Email";
import { LocationPinIcon } from "./icons/LocationPin";

interface IProps {
  email: User["email"];
  homeCity: User["homeCity"];
}
export const ContactInfo = ({ email, homeCity }: IProps) => {
  return (
    <div className="flex flex-col gap-1 max-sm:items-start">
      <div className="flex items-center gap-2">
        <EmailIcon className="h-4 w-4" />
        <span className="text-standard text-slate-700">{email}</span>
      </div>
      <div className="flex items-center gap-2">
        <LocationPinIcon className="h-4 w-4" />
        <span className="text-standard text-slate-700">{homeCity}</span>
      </div>
    </div>
  );
};
