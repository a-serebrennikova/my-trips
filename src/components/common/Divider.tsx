import { ReactNode } from "react";

interface IProp {
  title: string;
  action?: ReactNode;
}

export const Divider = ({ title, action }: IProp) => {
  return (
    <div className="mt-4 mb-4 flex items-center gap-3">
      <div className="inline-flex items-center gap-2">
        <p className="text-3xl page-title sm:text-title">
          {title}
        </p>
      </div>
      <span className="h-px flex-1 bg-teal-100" />
      {action}
    </div>
  );
};
