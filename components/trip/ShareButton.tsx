"use client";

import { useMemo, useState } from "react";

type ShareButtonProps = {
  path: string;
  title: string;
};

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 stroke-current">
      <path d="M12 16V4m0 0 4 4m-4-4-4 4" strokeWidth="1.9" />
      <path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" strokeWidth="1.9" />
    </svg>
  );
}

export function ShareButton({ path, title }: ShareButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "done">("idle");

  const sharePath = useMemo(() => {
    if (path.startsWith("/")) {
      return path;
    }

    return `/${path}`;
  }, [path]);

  const handleShare = async () => {
    if (typeof window === "undefined" || isSubmitting) {
      return;
    }

    const shareUrl = `${window.location.origin}${sharePath}`;

    setIsSubmitting(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: `Check this trip: ${title}`,
          url: shareUrl,
        });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      }

      setStatus("done");
      window.setTimeout(() => setStatus("idle"), 1600);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      disabled={isSubmitting}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <ShareIcon />
      {status === "done" ? "Copied" : "Share"}
    </button>
  );
}
