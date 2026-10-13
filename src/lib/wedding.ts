export const BRIDE_NAME = 'Malisha';
export const GROOM_NAME = 'Chamath';

export const GUEST_PREFIXES = ['Mr.', 'Mrs.', 'Miss', 'Mr. & Mrs.', 'Family', 'Dear'] as const;
export type GuestPrefix = (typeof GUEST_PREFIXES)[number];

const MAX_GUEST_NAME_LENGTH = 80;

// "Dear" only selects the plain greeting style; the message itself supplies the word.
export function getDisplayName(prefix: GuestPrefix, guestName: string): string {
  const name = guestName.trim().replace(/\s+/g, ' ');
  if (!name) return '';
  if (prefix === 'Dear') return name;
  if (prefix === 'Family') return `${name} and Family`;
  return `${prefix} ${name}`;
}

export function getInvitationLink(baseUrl: string, displayName: string): string {
  return `${baseUrl.replace(/\/+$/, '')}/${encodeURIComponent(displayName)}`;
}

export function getInvitationMessage(displayName: string, link: string): string {
  return `Dear ${displayName} ❤️

With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.

Please view our wedding invitation and all the event details through the link below 🌐:

${link}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With love,
❤️ ${GROOM_NAME} & ${BRIDE_NAME}`;
}

// Reads the guest's display name from a personalized link such as /Mr.%20Sanjaya.
export function getGuestNameFromPath(pathname: string): string {
  const segment = pathname.replace(/^\/+|\/+$/g, '');
  if (!segment || segment.includes('/')) return '';

  try {
    return decodeURIComponent(segment).trim().replace(/\s+/g, ' ').slice(0, MAX_GUEST_NAME_LENGTH);
  } catch {
    return '';
  }
}
