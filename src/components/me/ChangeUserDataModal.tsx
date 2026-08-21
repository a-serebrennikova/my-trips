"use client";

import type { User } from "@/src/types";
import { MAX_AVATAR_SIZE_BYTES } from "@/src/consts/images";
import { updateUserProfileRequest } from "@/src/service/request";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import {
  notifyError,
  notifySuccess,
} from "../common/Notification/notificationBus";
import { ErrorText } from "../common/ErrorText";
import {
  ProfileFormValues,
  profileFormSchema,
} from "../../schemas/profileSchema";

type ChangeUserDataModalProps = {
  open: boolean;
  user: User;
  onOpenChange: (open: boolean) => void;
};

export const ChangeUserDataModal = ({
  user,
  open,
  onOpenChange,
}: ChangeUserDataModalProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const {
    handleSubmit,
    setValue,
    register,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      avatar: null,
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedAvatar = watch("avatar");

  const avatarStatusText =
    watchedAvatar instanceof File
      ? watchedAvatar.name
      : user.avatarUrl && user.avatarUrl.trim()
        ? "Current avatar"
        : "No file selected";

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setValue("avatar", null);
      return;
    }

    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      setValue("avatar", null);
      event.target.value = "";
      return;
    }

    setValue("avatar", file);
  };

  const submitHandler = handleSubmit(async (values: ProfileFormValues) => {
    const file = values.avatar;
    const name = values.name.trim();
    const email = values.email.trim();

    const hasProfileChanged =
      name !== user.name || email !== user.email || file instanceof File;

    if (!hasProfileChanged) {
      onOpenChange(false);
      return;
    }

    try {
      const payload: Record<string, string> = {};

      if (file instanceof File) {
        const formData = new FormData();
        formData.append("avatar", file);

        if (name !== user.name) {
          formData.append("name", name);
        }

        if (email !== user.email) {
          formData.append("email", email);
        }

        await updateUserProfileRequest(formData);
      } else {
        if (name !== user.name) {
          payload.name = name;
        }

        if (email !== user.email) {
          payload.email = email;
        }

        await updateUserProfileRequest(payload);
      }

      setValue("avatar", null);
      router.refresh();
      notifySuccess("Profile updated successfully");
      onOpenChange(false);
    } catch {
      notifyError("Failed to update profile.");
    }
  });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content maxWidth="520px">
        <Dialog.Title>Edit profile</Dialog.Title>
        <Dialog.Description size="2" mb="4" className="text-slate-600">
          Upload an avatar and update your profile details.
        </Dialog.Description>

        <form onSubmit={submitHandler} className="space-y-4">
          <Flex direction="column" gap="4">
            <div className="space-y-1.5">
              <Text as="label" size="2" weight="medium" className="block">
                Name
              </Text>
              <TextField.Root
                placeholder="Your name"
                color={errors.name ? "red" : undefined}
                {...register("name")}
              />
              <ErrorText error={errors.name?.message} />
            </div>

            <div className="space-y-1.5">
              <Text as="label" size="2" weight="medium" className="block">
                Email
              </Text>
              <TextField.Root
                type="email"
                placeholder="your@email.com"
                color={errors.email ? "red" : undefined}
                {...register("email")}
              />
              <ErrorText error={errors.email?.message} />
            </div>

            <div className="flex flex-col items-center gap-3">
              <Button
                type="button"
                variant="soft"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload photo
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <Text as="p" size="2" className="text-slate-600">
                {avatarStatusText}
              </Text>

              {errors.avatar && <ErrorText error={errors.avatar?.message} />}
            </div>

            <Flex gap="3" justify="end" mt="2">
              <Dialog.Close>
                <Button type="button" variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                className="min-w-21.25"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};
