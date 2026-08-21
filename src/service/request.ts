import { User } from "../types";

type RequestOptions = RequestInit & {
  errorMessage: string;
};

export async function requestJson<T>(
  url: string,
  { errorMessage, ...options }: RequestOptions,
): Promise<T> {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

export async function requestVoid(
  url: string,
  { errorMessage, ...options }: RequestOptions,
): Promise<void> {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(errorMessage);
  }
}

export async function updateUserAvatarRequest(
  formData: FormData,
): Promise<{ avatarUrl: string }> {
  return requestJson<{ avatarUrl: string }>("/api/users", {
    method: "PATCH",
    body: formData,
    errorMessage: "Unable to update user avatar.",
  });
}

export async function updateUserProfileRequest(
  data: Record<string, unknown> | FormData,
): Promise<{
  user: User;
}> {
  if (data instanceof FormData) {
    return requestJson<{
      user: User;
    }>("/api/users", {
      method: "PATCH",
      body: data,
      errorMessage: "Unable to update user profile.",
    });
  }

  return requestJson<{
    user: User;
  }>("/api/users", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    errorMessage: "Unable to update user profile.",
  });
}
