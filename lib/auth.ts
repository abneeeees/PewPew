"use server";

import { signIn, signOut } from "../app/auth";
import { AuthError } from "next-auth";

export const loginGoogle = async () => {
  await signIn("google", { redirectTo: '/' });  
};

export const loginDiscord = async () => {
  await signIn("discord", { redirectTo: '/' });  
};

export const loginCredentials = async (values: any) => {
  try {
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirectTo: "/",
    });
  } catch (error: any) {
    if (error && error.type) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
};

export const logout = async () => {
  await signOut({ redirectTo: '/' });
};