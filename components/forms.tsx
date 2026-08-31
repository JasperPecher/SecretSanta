"use client";

import { useActionState, useState } from "react";
import {
  joinGroup,
  loginParticipant,
  updateWishlist,
  drawNames,
  createGroup,
  updateGroupDetails,
  updateExclusions,
} from "@/lib/actions";
import { Plus, Trash2 } from "lucide-react";
import { parseWishlist, stringifyWishlist, WishItem } from "@/lib/wishlist";

type FormState = { error?: string } | undefined;

function SubmitButton({ text }: { text: string }) {
  return (
    <button
      type="submit"
      className="w-full bg-neutral-100 hover:bg-white text-neutral-900 font-medium rounded-xl px-4 py-3 transition-colors active:scale-[0.98] disabled:opacity-50"
    >
      {text}
    </button>
  );
}

export function CreateGroupForm() {
  const [state, action, isPending] = useActionState<FormState, FormData>(
    createGroup,
    undefined,
  );

  return (
    <form action={action} className="space-y-5">
      {state?.error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm mb-4">
          {state.error}
        </div>
      )}

      <div>
        <label
          htmlFor="groupName"
          className="block text-sm font-medium text-neutral-300 mb-1"
        >
          Gruppenname
        </label>
        <input
          type="text"
          id="groupName"
          name="groupName"
          required
          className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 focus:outline-none transition-all mb-4"
          placeholder="z.B. Familie Fürchterlich"
        />

        <label
          htmlFor="description"
          className="block text-sm font-medium text-neutral-300 mb-1"
        >
          Beschreibung (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 focus:outline-none transition-all mb-4 text-sm"
          placeholder="z.B. Budget 50€, keine schlechten Geschenke bitte!"
          rows={3}
        />

        <label
          htmlFor="dueDate"
          className="block text-sm font-medium text-neutral-300 mb-1"
        >
          Frist (Optional)
        </label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 focus:outline-none transition-all"
        />
      </div>

      <div className="pt-4 border-t border-neutral-800">
        <h3 className="text-sm font-medium text-neutral-400 mb-4 tracking-wide">
          Deine Details (Admin)
        </h3>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="adminName"
              className="block text-sm font-medium text-neutral-300 mb-1"
            >
              Dein Name
            </label>
            <input
              type="text"
              id="adminName"
              name="adminName"
              required
              className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 focus:outline-none transition-all"
              placeholder="z.B. Matthias Claudius / Justus Jonas / Udo"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-300 mb-1"
            >
              Passwort (für den Login)
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 focus:outline-none transition-all"
              placeholder="Passwort erstellen"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-neutral-100 hover:bg-white text-neutral-900 font-medium rounded-xl px-4 py-3.5 transition-colors active:scale-[0.98] disabled:opacity-50"
      >
        {isPending ? "Wird erstellt..." : "Gruppe erstellen & Beitreten"}
      </button>
    </form>
  );
}

export function JoinForm({ groupId }: { groupId: string }) {
  const [state, action, isPending] = useActionState<FormState, FormData>(
    joinGroup.bind(null, groupId),
    undefined,
  );

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
          {state.error}
        </div>
      )}
      <div>
        <input
          type="text"
          name="name"
          required
          placeholder="Dein Name (z.B. Matthias Claudius)"
          className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 focus:outline-none transition-all text-sm"
        />
      </div>
      <div>
        <input
          type="password"
          name="password"
          required
          placeholder="Wähle ein Passwort"
          className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 focus:outline-none transition-all text-sm"
        />
      </div>

      <div className="pt-2">
        <label className="block text-sm font-medium text-neutral-300 mb-2">
          Erster Wunsch (Optional)
        </label>
        <div className="space-y-2">
          <input
            type="text"
            name="wishTitle"
            placeholder="Titel (z.B. Eine Flasche Oldesloer Korn)"
            className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 focus:outline-none transition-all text-sm"
          />
          <input
            type="text"
            name="wishComment"
            placeholder="Kommentar oder Link (Optional)"
            className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 focus:outline-none transition-all text-sm"
          />
        </div>
      </div>

      <SubmitButton text={isPending ? "Beitreten..." : "Gruppe beitreten"} />
    </form>
  );
}

export function LoginForm({ groupId }: { groupId: string }) {
  const [state, action, isPending] = useActionState<FormState, FormData>(
    loginParticipant.bind(null, groupId),
    undefined,
  );

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
          {state.error}
        </div>
      )}
      <div>
        <input
          type="text"
          name="name"
          required
          placeholder="Dein Name"
          className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 focus:outline-none transition-all text-sm"
        />
      </div>
      <div>
        <input
          type="password"
          name="password"
          required
          placeholder="Dein Passwort"
          className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 focus:outline-none transition-all text-sm"
        />
      </div>
      <SubmitButton text={isPending ? "Anmelden..." : "Anmelden"} />
    </form>
  );
}

export function WishlistForm({
  groupId,
  participantId,
  initialWishlist,
}: {
  groupId: string;
  participantId: string;
  initialWishlist: string;
}) {
  const [state, action, isPending] = useActionState<FormState, FormData>(
    updateWishlist.bind(null, participantId, groupId),
    undefined,
  );

  const [wishes, setWishes] = useState<WishItem[]>(() =>
    parseWishlist(initialWishlist),
  );

  const addWish = () => {
    setWishes([...wishes, { id: crypto.randomUUID(), title: "", comment: "" }]);
  };

  const removeWish = (id: string) => {
    setWishes(wishes.filter((w) => w.id !== id));
  };

  const updateWish = (
    id: string,
    field: "title" | "comment",
    value: string,
  ) => {
    setWishes(wishes.map((w) => (w.id === id ? { ...w, [field]: value } : w)));
  };

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
          {state.error}
        </div>
      )}

      <input type="hidden" name="wishlist" value={stringifyWishlist(wishes)} />

      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-4">
          Dein Wunschzettel
        </label>

        {wishes.length === 0 && (
          <p className="text-sm text-neutral-500 italic mb-4">
            Du hast noch keine Wünsche hinzugefügt.
          </p>
        )}

        <div className="space-y-3">
          {wishes.map((wish) => (
            <div
              key={wish.id}
              className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl relative"
            >
              <div className="flex gap-4">
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    value={wish.title}
                    onChange={(e) =>
                      updateWish(wish.id, "title", e.target.value)
                    }
                    placeholder="Wunsch (z.B. Eine Flasche Oldesloer Korn)"
                    required
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-100 focus:outline-none transition-all text-sm"
                  />
                  <input
                    type="text"
                    value={wish.comment}
                    onChange={(e) =>
                      updateWish(wish.id, "comment", e.target.value)
                    }
                    placeholder="Kommentar oder Link (Optional)"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-neutral-100 focus:outline-none transition-all text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeWish(wish.id)}
                  className="p-2 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors h-fit self-center"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addWish}
          className="mt-4 w-full py-3 border-2 border-dashed border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-neutral-300 rounded-xl flex items-center justify-center transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Wunsch hinzufügen
        </button>
      </div>

      <div className="pt-2">
        <SubmitButton
          text={isPending ? "Speichern..." : "Wunschzettel speichern"}
        />
      </div>
    </form>
  );
}

export function DrawButton({
  groupId,
  adminId,
}: {
  groupId: string;
  adminId: string;
}) {
  const [state, action, isPending] = useActionState<FormState, FormData>(
    drawNames.bind(null, groupId, adminId),
    undefined,
  );

  return (
    <form action={action}>
      {state?.error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm mb-4">
          {state.error}
        </div>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700 font-medium rounded-xl px-4 py-4 transition-colors active:scale-[0.98] disabled:opacity-50"
      >
        {isPending
          ? "Lose werden gezogen..."
          : "Anmeldungen schließen & Namen ziehen"}
      </button>
    </form>
  );
}

export function UpdateGroupForm({
  groupId,
  adminId,
  initialDescription,
  initialDueDate,
}: {
  groupId: string;
  adminId: string;
  initialDescription?: string | null;
  initialDueDate?: Date | null;
}) {
  const [state, action, isPending] = useActionState<FormState, FormData>(
    updateGroupDetails.bind(null, groupId, adminId),
    undefined,
  );

  const formattedDate = initialDueDate
    ? new Date(initialDueDate).toISOString().split("T")[0]
    : "";

  return (
    <form action={action} className="space-y-4 mt-6">
      <h4 className="font-medium text-neutral-400 mb-2">
        Gruppendetails bearbeiten
      </h4>
      {state?.error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm mb-4">
          {state.error}
        </div>
      )}

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-neutral-300 mb-1"
        >
          Beschreibung
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={initialDescription || ""}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-100 focus:outline-none transition-all mb-4 text-sm"
          placeholder="z.B. Budget 50€, keine schlechten Geschenke bitte!"
          rows={3}
        />

        <label
          htmlFor="dueDate"
          className="block text-sm font-medium text-neutral-300 mb-1"
        >
          Frist
        </label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          defaultValue={formattedDate}
          className="block w-full min-w-0 appearance-none bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-base text-neutral-100 focus:outline-none transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700 font-medium rounded-xl px-4 py-3.5 transition-colors active:scale-[0.98] disabled:opacity-50"
      >
        {isPending ? "Speichern..." : "Gruppendetails aktualisieren"}
      </button>
    </form>
  );
}

export function ExclusionsForm({
  groupId,
  adminId,
  participants,
}: {
  groupId: string;
  adminId: string;
  participants: { id: string; name: string; exclusions: string[] }[];
}) {
  const [state, action, isPending] = useActionState<FormState, FormData>(
    updateExclusions.bind(null, groupId, adminId),
    undefined,
  );

  // Local state to manage checkbox changes before submit
  const [exclusionsState, setExclusionsState] = useState<
    Record<string, string[]>
  >(() => {
    const init: Record<string, string[]> = {};
    participants.forEach((p) => {
      init[p.id] = p.exclusions || [];
    });
    return init;
  });

  const toggleExclusion = (participantId: string, excludedId: string) => {
    setExclusionsState((prev) => {
      const current = prev[participantId] || [];
      const newExclusions = current.includes(excludedId)
        ? current.filter((id) => id !== excludedId)
        : [...current, excludedId];
      return { ...prev, [participantId]: newExclusions };
    });
  };

  return (
    <form action={action} className="space-y-4 mt-6">
      <h4 className="font-medium text-neutral-400 mb-2">
        Ungewünschte Paarungen
      </h4>
      <p className="text-sm text-neutral-500 mb-4">
        Lege fest, wer wen nicht ziehen darf (z.B. Partner).
      </p>

      {state?.error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm mb-4">
          {state.error}
        </div>
      )}

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {participants.map((p) => (
          <div
            key={p.id}
            className="bg-neutral-950 border border-neutral-800 rounded-xl p-4"
          >
            <h5 className="font-medium text-neutral-200 mb-3">
              {p.name} darf nicht ziehen:
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {participants
                .filter((other) => other.id !== p.id)
                .map((other) => (
                  <label
                    key={other.id}
                    className="flex items-center space-x-2 text-sm text-neutral-300"
                  >
                    <input
                      type="checkbox"
                      checked={(exclusionsState[p.id] || []).includes(other.id)}
                      onChange={() => toggleExclusion(p.id, other.id)}
                      className="rounded border-neutral-700 bg-neutral-900 text-neutral-100 focus:ring-neutral-500"
                    />
                    <span>{other.name}</span>
                  </label>
                ))}
            </div>
            {/* Hidden input to pass the JSON stringified array to the form action */}
            <input
              type="hidden"
              name={`exclusions_${p.id}`}
              value={JSON.stringify(exclusionsState[p.id] || [])}
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700 font-medium rounded-xl px-4 py-3.5 transition-colors active:scale-[0.98] disabled:opacity-50 mt-4"
      >
        {isPending ? "Speichern..." : "Paarungen speichern"}
      </button>
    </form>
  );
}
