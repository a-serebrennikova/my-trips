"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type LoginFormValues, loginFormSchema } from "@/src/schemas/authForms";
import { signInUser } from "@/src/auth/signIn";
import { notifyError } from "../common/Notification/notificationBus";

type LoginFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenRegister: () => void;
};

const defaultValues: LoginFormValues = {
  email: "",
  password: "",
};

const invalidFieldClassName = "ring-1 ring-red-500";

export function LoginForm({
  open,
  onOpenChange,
  onOpenRegister,
}: LoginFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues,
  });

  const handleDialogChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset(defaultValues);
      setServerError(null);
    }

    onOpenChange(nextOpen);
  };

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);

    try {
      const result = await signInUser(values.email, values.password);

      if (!result || result.error) {
        setServerError("Incorrect email or password");
        return;
      }

      await getSession();

      reset(defaultValues);
      onOpenChange(false);
      
      router.push("/me");
      router.refresh();
    } catch {
      notifyError("Error during login");
    }
  };

  const handleRegisterClick = () => {
    reset(defaultValues);
    setServerError(null);
    onOpenRegister();
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleDialogChange}>
      <Dialog.Content maxWidth="460px" className="border border-teal-100">
        <Dialog.Title className="text-center text-3xl font-semibold text-slate-900">
          Login
        </Dialog.Title>
        <Dialog.Description
          size="2"
          mb="5"
          className="text-center text-slate-600"
        >
          Enter your account details to continue.
        </Dialog.Description>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              placeholder="Enter your password"
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
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>

            <Text as="p" size="2" className="text-center mt-4">
              Don&apos;t have an account?&nbsp;
              <button
                type="button"
                onClick={handleRegisterClick}
                className="font-semibold text-teal-700 transition hover:text-teal-600"
              >
                Register
              </button>
            </Text>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
