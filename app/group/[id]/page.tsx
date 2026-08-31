import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import {
  JoinForm,
  LoginForm,
  WishlistForm,
  DrawButton,
  UpdateGroupForm,
  ExclusionsForm,
} from "@/components/forms";
import { notFound } from "next/navigation";
import {
  Gift,
  Lock,
  UserCheck,
  Snowflake,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { parseWishlist } from "@/lib/wishlist";

export default async function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const group = await prisma.group.findUnique({
    where: { id },
    include: {
      participants: {
        select: { id: true, name: true, isAdmin: true, exclusions: true },
        orderBy: { name: "asc" },
      },
    },
  });

  if (!group) return notFound();

  const cookieStore = await cookies();
  const userId = cookieStore.get(`secretsanta_user_${id}`)?.value;

  let me = null;
  let assignedTo = null;

  if (userId) {
    me = await prisma.participant.findUnique({
      where: { id: userId },
    });

    if (me?.assignedToId) {
      assignedTo = await prisma.participant.findUnique({
        where: { id: me.assignedToId },
        select: { name: true, wishlist: true },
      });
    }
  }

  const renderedWishlist = assignedTo ? parseWishlist(assignedTo.wishlist) : [];

  return (
    <main className="flex-1 flex flex-col items-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-4xl space-y-8 relative">
        <header className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-neutral-900 border border-neutral-800 rounded-2xl mb-2">
            <Gift className="w-5 h-5 text-neutral-400 mr-2" strokeWidth={1.5} />
            <span className="font-medium tracking-wide text-neutral-300">
              Wichtelgruppe
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-100">
            {group.name}
          </h1>
          {group.isClosed ? (
            <div className="inline-flex items-center text-neutral-400 bg-neutral-900 px-4 py-1.5 rounded-full text-sm font-medium border border-neutral-800">
              <Lock className="w-4 h-4 mr-2" />
              Anmeldungen geschlossen
            </div>
          ) : (
            <p className="text-neutral-400 text-base">
              Lade andere ein, indem du die URL teilst. Oder lass es...
            </p>
          )}

          {group.dueDate && (
            <div className="inline-flex items-center text-neutral-400 bg-neutral-900 px-4 py-1.5 rounded-full text-sm font-medium border border-neutral-800 mt-2">
              <Calendar className="w-4 h-4 mr-2" />
              Frist: {new Date(group.dueDate).toLocaleDateString("de-DE")}
            </div>
          )}
          {group.description && (
            <p className="text-neutral-300 text-base max-w-2xl mx-auto bg-neutral-900/50 p-4 rounded-xl border border-neutral-800 mt-4">
              {group.description}
            </p>
          )}
        </header>

        {!me ? (
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {!group.isClosed && (
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8">
                <h2 className="text-xl font-semibold mb-6 text-neutral-100 flex items-center">
                  <UserCheck className="w-5 h-5 mr-3 text-neutral-400" /> Gruppe
                  beitreten
                </h2>
                <JoinForm groupId={group.id} />
              </div>
            )}

            <div
              className={`bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 ${group.isClosed ? "md:col-span-2 max-w-md mx-auto w-full" : ""}`}
            >
              <h2 className="text-xl font-semibold mb-6 text-neutral-100 flex items-center">
                <Lock className="w-5 h-5 mr-3 text-neutral-400" /> Anmelden
              </h2>
              <LoginForm groupId={group.id} />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 md:p-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-neutral-100">
                  Willkommen,{" "}
                  <span className="relative inline-block px-2">
                    <span className="font-black text-3xl">{me.name}</span>
                  </span>
                  {/* <span
                    className="font-bold bg-gradient-to-r from-red-400 to-yellow-400
           bg-clip-text text-transparent"
                  >
                    {me.name}
                  </span> */}
                  !
                </h2>
              </div>

              {group.isClosed && assignedTo ? (
                <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-8 text-center relative overflow-hidden mb-8">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Snowflake className="w-32 h-32" />
                  </div>
                  <h3 className="text-base text-neutral-400 font-medium mb-2">
                    Du bist der Wichtel für:
                  </h3>
                  <div className="text-4xl font-bold text-neutral-100 mb-6 tracking-tight">
                    {assignedTo.name}
                  </div>

                  {renderedWishlist.length > 0 && (
                    <div className="max-w-lg mx-auto bg-neutral-950 rounded-xl p-6 border border-neutral-800 text-left">
                      <h4 className="text-sm text-neutral-500 uppercase tracking-wider font-semibold mb-4 flex items-center">
                        <Gift className="w-4 h-4 mr-2" /> Deren Wunschzettel
                      </h4>
                      <ul className="space-y-4">
                        {renderedWishlist.map((wish) => (
                          <li key={wish.id}>
                            <div className="flex items-start">
                              <span className="text-neutral-500 mr-2 mt-0.5 shrink-0">
                                •
                              </span>
                              <div className="min-w-0 flex-1">
                                <span className="font-medium text-neutral-200 wrap-break-word">
                                  {wish.title}
                                </span>
                                {wish.comment && (
                                  <p className="text-sm text-neutral-500 mt-1 whitespace-pre-wrap wrap-break-word">
                                    {wish.comment}
                                  </p>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-8 inline-flex items-center text-neutral-300 bg-neutral-800 px-4 py-2 rounded-lg text-sm font-medium border border-neutral-700">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-neutral-400" />
                  Du bist dabei! Warte, bis der Admin die Namen zieht.
                </div>
              )}

              <div
                className={`max-w-lg ${group.isClosed ? "pt-6 border-t border-neutral-800" : ""}`}
              >
                <WishlistForm
                  groupId={group.id}
                  participantId={me.id}
                  initialWishlist={me.wishlist}
                />
              </div>
            </div>
            <div>
              <h4 className="font-medium text-neutral-400 mb-2">
                Teilnehmer ({group.participants.length})
              </h4>
              <ul className="space-y-2 mb-6">
                {group.participants.map(
                  (p: {
                    id: string;
                    name: string;
                    isAdmin: boolean;
                    exclusions: string[];
                  }) => {
                    const excludedNames = p.exclusions
                      .map(
                        (id) =>
                          group.participants.find((p2) => p2.id === id)?.name,
                      )
                      .filter(Boolean);

                    return (
                      <li
                        key={p.id}
                        className="bg-neutral-900 px-3 py-2 rounded-lg border border-neutral-800 flex flex-col justify-center text-neutral-300"
                      >
                        <div className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-neutral-600 mr-3"></div>
                          {p.name}{" "}
                          {p.isAdmin && (
                            <span className="ml-2 text-xs text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
                              Admin
                            </span>
                          )}
                        </div>
                        {excludedNames.length > 0 && (
                          <div className="ml-5 mt-1 text-xs text-neutral-500">
                            Darf nicht ziehen: {excludedNames.join(", ")}
                          </div>
                        )}
                      </li>
                    );
                  },
                )}
              </ul>
            </div>

            {me.isAdmin && !group.isClosed && (
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 md:p-10">
                <h3 className="text-lg font-semibold mb-6 text-neutral-100 flex items-center">
                  <Lock className="w-5 h-5 mr-3 text-neutral-400" />{" "}
                  Admin-Bereich
                </h3>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-8">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                      <UpdateGroupForm
                        groupId={group.id}
                        adminId={me.id}
                        initialDescription={group.description}
                        initialDueDate={group.dueDate}
                      />
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                      <ExclusionsForm
                        groupId={group.id}
                        adminId={me.id}
                        participants={group.participants}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 text-center">
                      <p className="text-sm text-neutral-400 mb-4">
                        Sobald alle beigetreten sind, klicke unten, um die Lose
                        zu ziehen. Dies kann nicht rückgängig gemacht werden!
                      </p>
                      <DrawButton groupId={group.id} adminId={me.id} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
