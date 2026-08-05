"use client";

import { Button, Dialog, Flex } from "@radix-ui/themes";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  confirmColor?: "gray" | "red";
  isConfirming?: boolean;
  onConfirm: () => void | Promise<void>;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  confirmColor = "red",
  isConfirming = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content maxWidth="420px">
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description size="2" mb="4" className="text-slate-600">
          {description}
        </Dialog.Description>

        <Flex gap="3" justify="end">
          <Button
            variant="soft"
            color="gray"
            onClick={() => onOpenChange(false)}
            disabled={isConfirming}
          >
            {cancelLabel}
          </Button>
          <Button
            color={confirmColor}
            onClick={onConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? `${confirmLabel}...` : confirmLabel}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
