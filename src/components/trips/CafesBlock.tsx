import { Place } from "@/src/types";
import { Card } from "../common/Card";
import { Badge } from "@radix-ui/themes";

interface IProps {
  cafes: Place[];
}

export const CafesBlock = ({ cafes }: IProps) => {
  return (
    <Card className="flex-1">
      <div className="flex flex-col gap-2">
        <p className="card-title">Cafes:</p>
        <div className="flex flex-wrap gap-3">
          {cafes.map(({ city, id, name, note }) => (
            <div key={id} className="flex flex-wrap gap-1">
              <Badge size="2" color="lime">
                {city}
              </Badge>
              <Badge size="2" color="amber">
                {name}
              </Badge>
              <p className="text-standard">{note}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
