"use server";

import { signIn, signOut } from "../app/auth";

export const loginGoogle = async () => {
  await signIn("google", { redirectTo: '/' });  
};

export const loginDiscord = async () => {
  await signIn("discord", { redirectTo: '/' });  
};

export const logout = async () => {
  await signOut({ redirectTo: '/' });
};