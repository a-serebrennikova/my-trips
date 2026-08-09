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

const invalidFieldClassName = "ring-1 ring-red-500";

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
              placeholder="Your name"
              color={errors.name ? "red" : undefined}
              {...register("name")}
              className={errors.name ? invalidFieldClassName : undefined}
            />
            {errors.name && (
              <Text as="p" size="1" className="text-red-600">
                {errors.name.message}
              </Text>
            )}
          </div>

          <div className="space-y-1.5">
            <Text as="label" size="2" weight="medium" className="block">
              Home city
            </Text>
            <TextField.Root
              placeholder="Lisbon"
              color={errors.homeCity ? "red" : undefined}
              {...register("homeCity")}
              className={errors.homeCity ? invalidFieldClassName : undefined}
            />
            {errors.homeCity && (
              <Text as="p" size="1" className="text-red-600">
                {errors.homeCity.message}
              </Text>
            )}
          </div>

          <div className="space-y-1.5">
            <Text as="label" size="2" weight="medium" className="block">
              Email
            </Text>
            <TextField.Root
              type="email"
              placeholder="name@example.com"
              color={errors.email ? "red" : undefined}
              {...register("email")}
              className={errors.email ? invalidFieldClassName : undefined}
            />
            {errors.email && (
              <Text as="p" size="1" className="text-red-600">
                {errors.email.message}
              </Text>
            )}
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
              className={errors.password ? invalidFieldClassName : undefined}
            />
            {errors.password && (
              <Text as="p" size="1" className="text-red-600">
                {errors.password.message}
              </Text>
            )}
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
              className={
                errors.confirmPassword ? invalidFieldClassName : undefined
              }
            />
            {errors.confirmPassword && (
              <Text as="p" size="1" className="text-red-600">
                {errors.confirmPassword.message}
              </Text>
            )}
          </div>

          {serverError && (
            <Text
              as="p"
              size="2"
              className="rounded-xl bg-red-50 px-3 py-2 text-red-700"
            >
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
