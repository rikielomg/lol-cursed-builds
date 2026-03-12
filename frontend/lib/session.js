// Persist player session across page navigations

export function saveSession(player) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('lol_player', JSON.stringify(player));
}

export function loadSession() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('lol_player');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('lol_player');
}
