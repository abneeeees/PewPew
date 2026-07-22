import AppShell from "@/components/AppShell";
import { auth } from "../auth";
import Image from "next/image";
import SignOutButton from "../../components/Auth/SignOut";
import UserProfile from "@/components/Profie/UserProfile"

export default async function Profile() {
  const session = await auth();

  return (
    <AppShell>
      <div className="flex flex-col">
        {/*{session &&
          <div>
            <p>You are signed in as {session.user?.name}</p >
            <p>You are signed in as {session.user?.email}</p >
            {session.user?.image &&
              <Image
                src={session?.user?.image}
                width={50}
                height={50}
                alt="some" />
            }

            <SignOutButton />
          </div>
        }*/}
        {<UserProfile/>}
      </div>
    </AppShell>
  );
}
