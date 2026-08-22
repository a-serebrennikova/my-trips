import { Trip } from "@/src/types";
import { Flex } from "@radix-ui/themes";

export const NotesBlock = ({ notes }: { notes: Required<Trip["notes"]> }) => {
  return (
    <Flex direction="column" gap="4" className="w-full">
      {notes?.length ? (
        <>
          <p className="card-title">Notes:</p>
          <p className="text-standard">{notes}</p>
        </>
      ) : (
        <>
          <p className="card-title">Notes:</p>
          <Flex direction="column" className="justify-center items-center">
            <p className="text-standard">No notes yet.</p>
          </Flex>
        </>
      )}
    </Flex>
  );
};
