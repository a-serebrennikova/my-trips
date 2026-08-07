import Image from "next/image";
import { LeadText } from "../common/Typography";
import { RedirectLink } from "./RedirectLink";
import { Card } from "../common/Card";

export const AppInfo = () => {
  return (
    <Card>
      <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
        <div className="flex flex-col gap-3">
          <p className="pill self-start">PERSONAL TRAVEL DIARY</p>
          <h2 className="page-title">
            Keep all your <span className="text-teal-600">best trips</span> in
            one place.
          </h2>

          <LeadText className="mt-4 text-standard text-slate-600">
            Add cities, impressions, favorite cafes, and share them with
            friends.
            <br />
            Every trip is its own story with likes, notes, and comments.
          </LeadText>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {/* <RedirectLink
              className="inline-flex items-center justify-center rounded-full bg-teal-600 px-6 py-2.5 text-small font-semibold text-white transition hover:bg-teal-500"
              signedInLabel="Go to profile"
              signedOutLabel="Sign in"
            /> */}
            <RedirectLink
              className="inline-flex items-center justify-center gap-2 rounded-full border border-teal-200 bg-white px-5 py-2.5 text-small font-semibold text-teal-700 transition hover:bg-teal-50"
              signedInHref="/trips"
              signedInLabel="View all trips →"
            />
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <Image
            src="/main-pic.png"
            alt="Travel illustration"
            width={400}
            height={240}
            className="h-auto w-full max-w-sm object-contain sm:max-w-md"
            priority
          />
        </div>
      </div>
    </Card>
  );
};
