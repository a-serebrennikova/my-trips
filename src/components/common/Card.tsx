import { Card as RadixCard } from "@radix-ui/themes";

export const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const classes = ["card-surface flex! flex-col", className].join(" ");

  return (
    <RadixCard className={classes} size="3">
      {children}
    </RadixCard>
  );
};
