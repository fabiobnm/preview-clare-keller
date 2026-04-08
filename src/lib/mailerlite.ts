// src/lib/mailerlite.ts
const ML_ENDPOINT = 'https://connect.mailerlite.com/api/subscribers';

export type MailerLiteSuccess = { id?: string; email?: string; status?: string };
export type MailerLiteErrorItem = { code?: string; message?: string; field?: string };
export type MailerLiteError = { error?: { message?: string }; errors?: MailerLiteErrorItem[] };

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}
function isMailerLiteError(data: unknown): data is MailerLiteError {
  if (!isRecord(data)) return false;
  const hasError = 'error' in data && isRecord((data as any).error ?? null);
  const hasErrorsArray = 'errors' in data && Array.isArray((data as any).errors);
  return Boolean(hasError || hasErrorsArray);
}
function extractMailerLiteErrorMessage(data: unknown, fallback = 'MAILERLITE_ERROR'): string {
  if (!isMailerLiteError(data)) return fallback;
  if (data.error?.message) return data.error.message!;
  if (Array.isArray(data.errors) && data.errors.length > 0) {
    const msgs = data.errors.map((it) => it?.message).filter((m): m is string => !!m);
    if (msgs.length) return msgs.join(', ');
  }
  return fallback;
}

export function getMailerLiteConfig() {
  const apiKey = process.env.MAILERLITE_API_KEY ?? '';
  const groupId = process.env.MAILERLITE_GROUP_ID ?? '';
  if (!apiKey || !groupId) {
    throw new Error('MAILERLITE_API_KEY o MAILERLITE_GROUP_ID mancanti (configura su Vercel).');
  }
  return { apiKey, groupId, endpoint: ML_ENDPOINT };
}

// 👉 Aggiunto city opzionale
export async function subscribeToMailerLite(params: { email: string; name?: string; city?: string }): Promise<MailerLiteSuccess> {
  const { apiKey, groupId, endpoint } = getMailerLiteConfig();

  // Costruisci i fields in modo dinamico
  const fields: Record<string, string> = {};
  if (params.name && params.name.trim()) fields.name = params.name.trim();

  // ATTENZIONE: il key deve combaciare col field in MailerLite (Audience → Fields)
  // Se il tuo field si chiama diversamente, cambia 'city' con il tuo key esatto.
  if (params.city && params.city.trim()) fields.city = params.city.trim();

  const payload: Record<string, unknown> = {
    email: params.email,
    groups: [groupId],
    ...(Object.keys(fields).length ? { fields } : {}),
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    const msg = extractMailerLiteErrorMessage(data, res.statusText || 'MAILERLITE_ERROR');
    throw new Error(msg);
  }

  return (data ?? {}) as MailerLiteSuccess;
}
