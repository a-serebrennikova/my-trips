import { ReactNode } from "react";

interface IProp {
  title: string;
  action?: ReactNode;
}

export const Divider = ({ title, action }: IProp) => {
  return (
    <div className="mt-4 mb-4 flex items-center gap-3 text-teal-700">
      <div className="inline-flex items-center gap-2">
        <p className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-title">
          {title}
        </p>
      </div>
      <span aria-hidden="true" className="h-px flex-1 bg-teal-100" />
      {action}
    </div>
  );
};
