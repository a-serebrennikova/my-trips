"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  type RegisterFormValues,
  registerFormSchema,
} from "@/src/schemas/authForms";
import { registerUser } from "@/src/auth/registerUser";
import { notifyError } from "../common/Notification/notificationBus";
import { ErrorText } from "../common/ErrorText";

type RegisterFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenLogin: () => void;
};

const defaultValues: RegisterFormValues = {
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
  homeCity: "",
};

export function RegisterForm({
  open,
  onOpenChange,
  onOpenLogin,
}: RegisterFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormValues>({
    mode: "onSubmit",
    resolver: zodResolver(registerFormSchema),
    defaultValues,
  });

  const handleDialogChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset(defaultValues);
      setServerError(null);
    }

    onOpenChange(nextOpen);
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null);

    try {
      const result = await registerUser({
        email: data.email,
        password: data.password,
        name: data.name,
        homeCity: data.homeCity,
      });

      if (!result.ok) {
        if (result.error === "EMAIL_TAKEN") {
          setServerError("This email is already in use");
        } else {
          setServerError("Registration failed. Please try again");
        }

        return;
      }

      reset(defaultValues);
      onOpenChange(false);
    } catch {
      notifyError("Error registering user");
    }
  };

  const handleLoginClick = () => {
    reset(defaultValues);
    setServerError(null);
    onOpenLogin();
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleDialogChange}>
      <Dialog.Content maxWidth="460px" className="border border-teal-100">
        <Dialog.Title className="text-center text-3xl font-semibold text-slate-900">
          Register
        </Dialog.Title>
        <Dialog.Description
          size="2"
          mb="5"
          className="text-center text-slate-600"
        >
          Create your account details.
        </Dialog.Description>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Text as="label" size="2" weight="medium" className="block">
              Name
            </Text>
            <TextField.Root
              color={errors.name ? "red" : undefined}
              placeholder="Enter your name"
              {...register("name")}
            />
            {errors.name && <ErrorText error={errors.name.message} />}
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
            {errors.homeCity && <ErrorText error={errors.homeCity.message} />}
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
            {errors.email && <ErrorText error={errors.email.message} />}
          </div>

          <div className="space-y-1.5">
            <Text as="label" size="2" weight="medium" className="block">
              Password
            </Text>
            <TextField.Root
              type="password"
              placeholder="At least 8 characters"
              color={errors.password ? "red" : undefined}
              {...register("password")}
            />
            {errors.password && <ErrorText error={errors.password.message} />}
          </div>

          <div className="space-y-1.5">
            <Text as="label" size="2" weight="medium" className="block">
              Confirm password
            </Text>
            <TextField.Root
              type="password"
              placeholder="Repeat your password"
              color={errors.confirmPassword ? "red" : undefined}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <ErrorText error={errors.confirmPassword.message} />
            )}
          </div>

          {serverError && (
            <Text as="p" size="2" className=" text-red-500">
              {serverError}
            </Text>
          )}

          <Flex direction="column" gap="2" mt="3">
            <Button
              type="submit"
              size="3"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Register"}
            </Button>

            <Text as="p" size="2" className="text-center text-slate-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={handleLoginClick}
                className="font-semibold text-teal-700 transition hover:text-teal-600"
              >
                Login
              </button>
            </Text>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
