"use client";

import { Avatar, Flex } from "@radix-ui/themes";
import { getNameLetter } from "@/src/utils/getNameLetter";
import type { Comment } from "@/src/types";
import { CreateComment } from "./CreateComment";
import { Text } from "@radix-ui/themes";
import { IconActionButton } from "../../common/IconActionButton";
import { Trash } from "../../common/icons/Trash";
import { useRouter } from "next/navigation";
import { deleteTripComment } from "@/src/service/tripService";
import {
  notifyError,
  notifyInfo,
} from "../../common/Notification/notificationBus";

export const CommentsBlock = ({
  comments,
  tripId,
  currentUserId,
}: {
  comments: Comment[];
  tripId: string;
  currentUserId: string | null;
}) => {
  const router = useRouter();

  if (!comments.length && !currentUserId) {
    return (
      <div className='flex flex-col flex-1 gap-2'>
        <p className="card-title">Comments:</p>
        <Flex direction="column" className="justify-center items-center">
          <p className="text-standard">No comments yet.</p>
        </Flex>
      </div>
    );
  }

  const deleteComment = async (commentId: string) => {
    try {
      await deleteTripComment(tripId, commentId);
      router.refresh();
      notifyInfo("Comment deleted successfully");
    } catch {
      notifyError("Failed to delete comment");
    }
  };

  return (
     <div className='flex flex-col flex-1 gap-2'>
      <p className="card-title">Comments:</p>
      {comments.map(({ id, author, message }) => (
        <Flex key={id} gap="2" align="center" className="w-full">
          <Flex key={id} gap="2" align="center" className="w-full">
            <Avatar
              src={author.avatarUrl ?? undefined}
              alt={author.name}
              fallback={getNameLetter(author.name)}
              color="grass"
            />
            <div className="flex flex-col">
              <Text className="text-standard font-semibold">{author.name}</Text>
              <Text className="text-standard">{message}</Text>
            </div>
          </Flex>
          {author.id === currentUserId && (
            <IconActionButton
              color="red"
              ariaLabel="Delete comment"
              onClick={() => deleteComment(id)}
            >
              <Trash />
            </IconActionButton>
          )}
        </Flex>
      ))}
      {!!currentUserId && <CreateComment tripId={tripId} />}
    </div>
  );
};
