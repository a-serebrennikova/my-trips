import { Avatar } from "@radix-ui/themes";
import { Card } from "../common/Card";
import { getNameLetter } from "@/src/utils/getNameLetter";
import type { Comment } from "@/src/types";

export const CommentsBlock = ({ comments }: { comments: Comment[] }) => {
  return (
    <Card className="gap-2 bg-(--orange-a3)">
      <p className="card-title">Comments:</p>
      {comments.map(({ id, author, message }) => (
        <div key={id} className="flex gap-2 items-start">
          <Avatar fallback={getNameLetter(author.name)} color="grass" />
          <div className="flex flex-col">
            <p className="text-standard font-semibold">{author.name}</p>
            <p className="text-standard">{message}</p>
          </div>
        </div>
      ))}
    </Card>
  );
};
