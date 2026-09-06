import React from "react";
import { Flex, Badge } from "@radix-ui/themes";
import { NoPhoto } from "./NoPhoto";
import { Place } from "@/src/types";
import { Card } from "./Card";
import Carousel from "./Carousel/Carousel";

interface IProps {
  noDataText: string;
  places: Place[];
}

export const PlaceBlock: React.FC<IProps> = ({ places, noDataText }) => {
  return (
    <Card className="flex-1">
      <Flex direction="column" gap="3" className="w-full h-full">
        <Flex
          direction="column"
          align={places.length ? "start" : "center"}
          justify={places.length ? "start" : "center"}
          gap="3"
          className="w-full h-full"
        >
          {places.length ? (
            places.map(({ id, name, note, photos }) => {
              const slidePhotos = photos
                ?.sort((a, b) => a.sortOrder - b.sortOrder)
                .map((photo) => photo.url);

              return (
                <Flex
                  key={id}
                  direction="column"
                  flexGrow="1"
                  className="w-full min-h-60"
                  gap="3"
                >
                  <Badge size="2" color="amber" className="w-fit">
                    {name}
                  </Badge>
                  <p className="text-standard">{note}</p>
                  {photos?.length ? (
                    <Carousel
                      slides={slidePhotos}
                      options={{ loop: true }}
                    />
                  ) : (
                    <div className="flex flex-col flex-1 w-full">
                      <NoPhoto />
                    </div>
                  )}
                </Flex>
              );
            })
          ) : (
            <p className="text-standard">{noDataText}</p>
          )}
        </Flex>
      </Flex>
    </Card>
  );
};
