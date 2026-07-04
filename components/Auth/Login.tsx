"use client";
import { loginGoogle, loginDiscord } from "../../lib/auth";

export default function Login() {
  return (
    <div>
      <button onClick={() => loginGoogle()}>Sign In by google</button>
      {" "}
      <br />
      <br />
      <button onClick={() => loginDiscord()}>Sign In by discord</button>
    </div>
  );
}