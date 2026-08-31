export function drawSecretSanta(
  participantIds: string[],
  exclusionsMap: Record<string, string[]> = {}
): Record<string, string> | null {
  if (participantIds.length < 2) return null;

  let assignments: Record<string, string> = {};
  let isValid = false;
  let attempts = 0;
  const MAX_ATTEMPTS = 5000;

  while (!isValid && attempts < MAX_ATTEMPTS) {
    attempts++;
    const receivers = [...participantIds];
    // Fisher-Yates shuffle
    for (let i = receivers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [receivers[i], receivers[j]] = [receivers[j], receivers[i]];
    }

    isValid = true;
    assignments = {};

    for (let i = 0; i < participantIds.length; i++) {
      const giverId = participantIds[i];
      const receiverId = receivers[i];
      if (giverId === receiverId || exclusionsMap[giverId]?.includes(receiverId)) {
        isValid = false;
        break;
      }
      assignments[giverId] = receiverId;
    }
  }

  return isValid ? assignments : null;
}
