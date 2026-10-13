const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzX0Gk0Yn7W3f6qaNAqskXgKjU5Z2f0TPwvxh8QKrTi6l1xO0W4oUydJEL1qSPDjVpp5g/exec';

export type SheetType = 'rsvp' | 'wishes';

export async function submitToSheet(type: SheetType, data: Record<string, string>): Promise<void> {
  // text/plain keeps this a "simple" request, so the browser skips the CORS
  // preflight that Apps Script web apps cannot answer.
  const response = await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ type, ...data }),
  });

  const result = await response.json();
  if (!result.ok) {
    throw new Error(result.error || 'Submission failed.');
  }
}
