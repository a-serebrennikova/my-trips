"use client";

import { createTripComment } from "@/src/service/tripService";
import { Button, TextArea } from "@radix-ui/themes";
import { useState } from "react";
import {
  notifyError,
  notifyInfo,
} from "../../common/Notification/notificationBus";
import { useRouter } from "next/navigation";

interface IProps {
  tripId: string;
}

export const CreateComment = ({ tripId }: IProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (!comment.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createTripComment(tripId, comment);
      router.refresh();
      notifyInfo("Comment added successfully");
      setComment("");
    } catch {
      notifyError("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <TextArea
        placeholder="Write a comment..."
        className="w-full"
        value={comment}
        maxLength={100}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button style={{ width: 150 }} size={"2"} onClick={handleSubmit}>
        {isSubmitting ? "Adding..." : "Add comment"}
      </Button>
    </div>
  );
};
