export function logoutAndNotify(): void {
  try {
    localStorage.removeItem("lvup_user_session");
  } catch {}
  // Disparar un evento personalizado para que el código no relacionado con React DOM pueda reaccionar
  try {
    window.dispatchEvent(new CustomEvent("lvup:logout"));
  } catch {}
}

export function saveSession(session: any): void {
  try {
    localStorage.setItem("lvup_user_session", JSON.stringify(session));
    window.dispatchEvent(new CustomEvent("lvup:login", { detail: session }));
  } catch {}
}
