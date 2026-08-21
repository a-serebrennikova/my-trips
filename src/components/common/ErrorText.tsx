import { Text } from "@radix-ui/themes";

type ErrorTextProps = {
    error?: string | null;
};

export const ErrorText = ({ error }: ErrorTextProps) => {
    if (!error) return null;
    return (
        <Text as="p" size="1" className="text-red-600">
            {error}
        </Text>
    );
};