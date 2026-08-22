"use client";

import type { User } from "@/src/types";
import { MAX_AVATAR_SIZE_BYTES } from "@/src/consts/images";
import { updateUserProfileRequest } from "@/src/service/request";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
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

import { UploadAvatar } from "./components/UploadAvatar";

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
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm<ProfileFormValues>({
    mode: "onSubmit",
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      homeCity: user.homeCity,
    },
  });

  const submitHandler = handleSubmit(async (values: ProfileFormValues) => {
    const name = values.name.trim();
    const email = values.email.trim();
    const homeCity = values.homeCity.trim();

    const isUploadedFile = file instanceof File;
    const hasProfileChanged =
      name !== user.name ||
      email !== user.email ||
      homeCity !== user.homeCity ||
      isUploadedFile;

    if (!hasProfileChanged) {
      onOpenChange(false);
      return;
    }

    try {
      if (isUploadedFile) {
        const formData = new FormData();
        formData.append("avatar", file);
        formData.append("name", name);
        formData.append("email", email);
        formData.append("homeCity", homeCity);

        await updateUserProfileRequest(formData);
      } else {
        const payload: Record<string, string> = {
          name,
          email,
          homeCity,
        };

        await updateUserProfileRequest(payload);
      }

      setFile(null);
      router.refresh();
      notifySuccess("Profile updated successfully");
      onOpenChange(false);
    } catch {
      notifyError("Failed to update profile.");
    }
  });

  const onValueChange = (files: File[]) => {
    const file = files[0] ?? null;
    setFile(file);
  };

  const onFileValidate = useCallback((file: File): string | null => {
    if (!file.type.startsWith("image/")) {
      return "Only image files are allowed";
    }

    if (file.size > MAX_AVATAR_SIZE_BYTES) {
      return `File size must be less than ${MAX_AVATAR_SIZE_BYTES / (1024 * 1024)}MB`;
    }

    return null;
  }, []);

  const onFileReject = useCallback((file: File, message: string) => {
    setFileError(`"${file.name}" has been rejected: ${message}`);
  }, []);

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
                placeholder="Enter your name"
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
                placeholder="Enter your email"
                color={errors.email ? "red" : undefined}
                {...register("email")}
              />
              <ErrorText error={errors.email?.message} />
            </div>

            <div className="space-y-1.5">
              <Text as="label" size="2" weight="medium" className="block">
                Home city
              </Text>
              <TextField.Root
                placeholder="Enter your home city"
                color={errors.homeCity ? "red" : undefined}
                {...register("homeCity")}
              />
              <ErrorText error={errors.homeCity?.message} />
            </div>

            <UploadAvatar
              file={file}
              onFileValidate={onFileValidate}
              onValueChange={onValueChange}
              onFileReject={onFileReject}
              avatarUrl={user.avatarUrl}
            />
            {fileError && <ErrorText error={fileError} />}

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
