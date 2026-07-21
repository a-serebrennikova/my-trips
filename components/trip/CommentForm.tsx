"use client";

import { useAuthStore } from "@/store/authStore";
import { addCommentToTrip } from "@/store/travelApi";
import type { Trip } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";

type CommentFormValues = z.infer<typeof commentSchema>;

const commentSchema = z.object({
  message: z
    .string()
    .min(3, "Comment is too short")
    .max(400, "Maximum 400 characters"),
});

interface Props {
  trip: Trip;
}

export function CommentFrom({ trip }: Props) {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const authToken = useAuthStore((state) => state.authToken);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { message: "" },
  });

  const onSubmit = async (values: CommentFormValues) => {
    if (!authToken) {
      router.push("/login");
      return;
    }

    await addCommentToTrip(trip.id, values.message.trim(), authToken);
    reset({ message: "" });
    router.refresh();
  };

  if (!currentUser) {
    return (
      <div className="mt-3 space-y-2 rounded-2xl border border-sky-100 bg-sky-50/60 p-3">
        <p className="text-xs text-slate-600">
          Only signed-in friends can leave comments.
        </p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="rounded-full bg-sky-600 px-4 py-1.5 text-xs font-semibold text-white"
        >
          Sign in
        </button>
      </div>
    );
  }

  return (
    <form className="mt-3 space-y-2" onSubmit={handleSubmit(onSubmit)}>
      <textarea
        rows={3}
        placeholder="Share your impression or ask a question..."
        className="w-full resize-none rounded-2xl border border-sky-100 bg-sky-50/60 px-3 py-2 text-xs text-slate-800 outline-none ring-sky-400 focus:bg-white focus:ring-2 disabled:opacity-60"
        {...register("message")}
        disabled={isSubmitting}
      />
      {errors.message && (
        <p className="text-[11px] text-rose-500">{errors.message.message}</p>
      )}
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-slate-500">
          Comments are visible to all signed-in friends.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-sky-600 px-4 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-sky-300"
        >
          Send
        </button>
      </div>
    </form>
  );
}
