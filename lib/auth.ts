"use server";

import { signIn, signOut } from "../app/auth";
import { AuthError } from "next-auth";

export const loginGoogle = async () => {
  await signIn("google", { redirectTo: "/" });  
};

export const loginDiscord = async () => {
  await signIn("discord", { redirectTo: "/" });  
};


export const loginCredentials = async (values: {
  email: string;
  password: string;
}) => {
  try {
    await signIn("credentials", {
      email: values.email.trim().toLowerCase(),
      password: values.password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { error: "Invalid email or password." };
      }

      return { error: "Something went wrong." };
    }

    throw error;
  }
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
};