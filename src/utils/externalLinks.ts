export const SANTALI_KEYBOARD_URL = 'https://horkathasuite.pages.dev/';

/**
 * Safely opens the dedicated external Santali Keyboard web app
 * using an explicit anchor click instead of window.open so it works reliably
 * across browsers and preview environments.
 */
export function openExternalSantaliKeyboard(): void {
  if (typeof document === 'undefined') return;
  const link = document.createElement('a');
  link.href = SANTALI_KEYBOARD_URL;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
