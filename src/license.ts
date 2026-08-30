const SLUG = 'invoice-evidence-pack';
const LICENSE_KEY = `sb_license:${SLUG}`;
const VERDICT_KEY = `sb_license_verdict:${SLUG}`;
const DAY = 86_400_000;
const BASE_URL = import.meta.env.VITE_BILLING_BASE_URL || 'https://api.sociobot.in/api/v1';

interface Verdict { valid: boolean; checkedAt: number; reason?: string }

export const checkoutUrl = `${BASE_URL}/products/${SLUG}/checkout`;
export const checkoutEnabled = import.meta.env.VITE_BILLING_ENABLED === 'true';

export function captureReturnedLicense(): void {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return;
  localStorage.setItem(LICENSE_KEY, token);
  localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: true, checkedAt: 0 }));
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export function storeLicense(token: string): void {
  localStorage.setItem(LICENSE_KEY, token.trim());
  localStorage.removeItem(VERDICT_KEY);
}

export function hasOptimisticLicense(): boolean {
  const token = localStorage.getItem(LICENSE_KEY);
  if (!token) return false;
  try {
    const verdict = JSON.parse(localStorage.getItem(VERDICT_KEY) || '{}') as Verdict;
    return verdict.valid !== false;
  } catch {
    return true;
  }
}

export async function verifyLicense(force = false): Promise<{ valid: boolean; reason?: string }> {
  const token = localStorage.getItem(LICENSE_KEY);
  if (!token) return { valid: false, reason: 'missing' };
  let cached: Verdict | undefined;
  try { cached = JSON.parse(localStorage.getItem(VERDICT_KEY) || '') as Verdict; } catch { cached = undefined; }
  if (!force && cached && Date.now() - cached.checkedAt < DAY) return cached;
  const response = await fetch(`${BASE_URL}/products/${SLUG}/verify?license=${encodeURIComponent(token)}`);
  if (!response.ok) throw new Error('The license server could not be reached. Your cached access is unchanged.');
  const result = await response.json() as { valid: boolean; reason?: string };
  localStorage.setItem(VERDICT_KEY, JSON.stringify({ ...result, checkedAt: Date.now() }));
  return result;
}
