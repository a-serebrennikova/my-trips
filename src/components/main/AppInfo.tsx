import Image from "next/image";
import { LeadText } from "../common/Typography";
import { Card } from "../common/Card";
import { AnimatedText } from "./AnimatedText";
import Link from "next/link";
import { Flex } from "@radix-ui/themes";

export const AppInfo = () => {
  return (
    <Card>
      <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
        <Flex direction="column" justify="between" gap="2">
          <div className="flex flex-col gap-3">
            <p className="pill self-start">PERSONAL TRAVEL DIARY</p>
            <div className="lg:min-h-10 sm:min-h-7 max-sm:min-h-14">
              <AnimatedText />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <LeadText className="mt-4 text-standard text-slate-600">
              Add cities, impressions, favorite cafes, and share them with
              friends.
              <br />
              Every trip is its own story with likes, notes, and comments.
            </LeadText>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/trips"
                className="hover:text-blue-600"
              >
                <span aria-hidden>View all trips →</span>
              </Link>
            </div>
          </div>
        </Flex>
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
