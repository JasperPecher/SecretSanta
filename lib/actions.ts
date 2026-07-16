"use server";

import { prisma } from "./prisma";
import { hash, compare } from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes } from "crypto";
import { drawSecretSanta } from "./derangement";

type FormState = { error?: string } | undefined;

export async function createGroup(
  prevState: FormState,
  formData: FormData,
): Promise<{ error?: string } | undefined> {
  const groupName = formData.get("groupName") as string;
  const adminName = formData.get("adminName") as string;
  const password = formData.get("password") as string;
  const wishTitle = formData.get("wishTitle") as string;
  const wishComment = formData.get("wishComment") as string;

  let wishlistString = "";
  if (wishTitle) {
    wishlistString = JSON.stringify([
      {
        id: Math.random().toString(36).substring(2),
        title: wishTitle,
        comment: wishComment || "",
      },
    ]);
  }

  if (!groupName || !adminName || !password) {
    return { error: "Bitte fülle alle erforderlichen Felder aus." };
  }

  const hashedPassword = await hash(password, 10);

  let shortId = "";
  let isUnique = false;
  while (!isUnique) {
    shortId = randomBytes(3).toString("hex").toUpperCase();
    const existing = await prisma.group.findUnique({ where: { id: shortId } });
    if (!existing) {
      isUnique = true;
    }
  }

  const group = await prisma.group.create({
    data: {
      id: shortId,
      name: groupName,
      participants: {
        create: {
          name: adminName,
          password: hashedPassword,
          wishlist: wishlistString,
          isAdmin: true,
        },
      },
    },
    include: {
      participants: true,
    },
  });

  const admin = group.participants[0];

  const cookieStore = await cookies();
  cookieStore.set(`secretsanta_user_${group.id}`, admin.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  redirect(`/group/${group.id}`);
}

export async function joinGroup(
  groupId: string,
  prevState: FormState,
  formData: FormData,
): Promise<{ error?: string } | undefined> {
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  const wishTitle = formData.get("wishTitle") as string;
  const wishComment = formData.get("wishComment") as string;

  let wishlistString = "";
  if (wishTitle) {
    wishlistString = JSON.stringify([
      {
        id: Math.random().toString(36).substring(2),
        title: wishTitle,
        comment: wishComment || "",
      },
    ]);
  }

  if (!name || !password) {
    return { error: "Bitte fülle alle erforderlichen Felder aus." };
  }

  const group = await prisma.group.findUnique({
    where: { id: groupId },
  });

  if (!group) return { error: "Gruppe nicht gefunden." };
  if (group.isClosed) return { error: "Anmeldungen sind geschlossen." };

  // Check if name is taken
  const existing = await prisma.participant.findUnique({
    where: {
      groupId_name: {
        groupId,
        name,
      },
    },
  });

  if (existing) {
    return {
      error:
        "Dieser Name ist bereits vergeben. Bitte melde dich an oder wähle einen anderen Namen.",
    };
  }

  const hashedPassword = await hash(password, 10);

  const participant = await prisma.participant.create({
    data: {
      groupId,
      name,
      password: hashedPassword,
      wishlist: wishlistString,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(`secretsanta_user_${groupId}`, participant.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  redirect(`/group/${groupId}`);
}

export async function loginParticipant(
  groupId: string,
  prevState: FormState,
  formData: FormData,
): Promise<{ error?: string } | undefined> {
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;

  if (!name || !password) {
    return { error: "Bitte fülle alle Felder aus." };
  }

  const participant = await prisma.participant.findUnique({
    where: {
      groupId_name: {
        groupId,
        name,
      },
    },
  });

  if (!participant) {
    return { error: "Teilnehmer nicht gefunden." };
  }

  const isValid = await compare(password, participant.password);
  if (!isValid) {
    return { error: "Ungültiges Passwort." };
  }

  const cookieStore = await cookies();
  cookieStore.set(`secretsanta_user_${groupId}`, participant.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  redirect(`/group/${groupId}`);
}

export async function updateWishlist(
  participantId: string,
  groupId: string,
  prevState: FormState,
  formData: FormData,
): Promise<{ error?: string } | undefined> {
  const wishlist = formData.get("wishlist") as string;

  await prisma.participant.update({
    where: { id: participantId },
    data: { wishlist },
  });

  redirect(`/group/${groupId}`);
}

export async function drawNames(
  groupId: string,
  adminId: string,
): Promise<{ error?: string } | undefined> {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: { participants: true },
  });

  if (!group || group.isClosed)
    return { error: "Ungültige Gruppe oder es wurde bereits gezogen." };

  const admin = group.participants.find(
    (p: { id: string; isAdmin: boolean }) => p.id === adminId,
  );
  if (!admin || !admin.isAdmin) return { error: "Unbefugt." };

  if (group.participants.length < 3) {
    return { error: "Mindestens 3 Teilnehmer werden benötigt." };
  }

  const assignments = drawSecretSanta(
    group.participants.map((p: { id: string }) => p.id),
  );
  if (!assignments) {
    return {
      error:
        "Es konnte keine gültige Ziehung generiert werden. Bitte versuche es erneut.",
    };
  }

  // Transaction to update all participants
  await prisma.$transaction(async (tx) => {
    for (const [giverId, receiverId] of Object.entries(assignments)) {
      await tx.participant.update({
        where: { id: giverId },
        data: { assignedToId: receiverId },
      });
    }
    await tx.group.update({
      where: { id: groupId },
      data: { isClosed: true },
    });
  });

  redirect(`/group/${groupId}`);
}
