import Image from "next/image";

export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-5xl">
      {/* Cover */}
      <div className="relative h-56 w-full bg-zinc-800">
        <Image
          src="/cover.jpg"
          alt=""
          className="h-full w-full object-cover"
          height="50"
          width="50"
        />

        {/* Avatar */}
        <div className="absolute -bottom-16 left-6">
          <Image
            src="/avatar.jpg"
            alt="Profile"
            className="h-32 w-32 rounded-full border-4 border-black object-cover"
            height="50"
            width="50"
            />
        </div>
      </div>

      {/* Profile Info */}
      <section className="mt-20 px-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Avneesh Singh</h1>
            <p className="text-zinc-400">@avneesh</p>

            <p className="mt-4 max-w-2xl text-zinc-300">
              Full Stack Developer • Next.js • TypeScript • AI/ML • Open Source
            </p>

            <div className="mt-4 flex flex-wrap gap-5 text-sm text-zinc-400">
              <span>📍 Delhi, India</span>
              <span>🔗 avneesh.dev</span>
              <span>📅 Joined July 2026</span>
            </div>

            <div className="mt-4 flex gap-6">
              <span>
                <strong>234</strong> Following
              </span>

              <span>
                <strong>1.2K</strong> Followers
              </span>
            </div>
          </div>

          <button className="rounded-full border px-5 py-2 hover:bg-zinc-900">
            Edit Profile
          </button>
        </div>
      </section>

      {/* Tabs */}
      <nav className="mt-8 border-b">
        <ul className="flex">
          {["Posts", "Replies", "Media", "Likes"].map((tab) => (
            <li
              key={tab}
              className="cursor-pointer border-b-2 border-transparent px-6 py-4 hover:border-white"
            >
              {tab}
            </li>
          ))}
        </ul>
      </nav>

      {/* Feed */}
      <section className="divide-y">
        {[1, 2, 3].map((post) => (
          <article
            key={post}
            className="flex gap-4 p-6 hover:bg-zinc-950"
          >
            <Image
              src="/avatar.jpg"
              className="h-12 w-12 rounded-full"
              alt=""
              height="50"
              width="50"
              />

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  Avneesh Singh
                </span>

                <span className="text-zinc-500">
                  @avneesh · 2h
                </span>
              </div>

              <p className="mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>

              <div className="mt-4 flex gap-8 text-zinc-400">
                <button>💬 12</button>
                <button>🔁 6</button>
                <button>❤️ 84</button>
                <button>📊 1.2K</button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}