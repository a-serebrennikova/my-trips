import { Trip } from "@/src/types";
import { Card } from "../common/Card";

export const NotesBlock = ({ notes }: { notes: Required<Trip["notes"]> }) => {
  return (
    <Card>
      {notes && (
        <>
          <p className="card-title">Notes:</p>
          <p className="text-standard">{notes}</p>
        </>
      )}
    </Card>
  );
};
