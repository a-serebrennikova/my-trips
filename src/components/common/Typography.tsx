import { Text } from "@radix-ui/themes";

type LeadTextProps = {
  children: React.ReactNode;
  className?: string;
};

export const LeadText = ({ children, className }: LeadTextProps) => {
  return (
    <Text
      as="p"
      className={`text-standard leading-relaxed text-slate-600 ${className ?? ""}`}
    >
      {children}
    </Text>
  );
};
