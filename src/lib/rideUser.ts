// Lightweight local-user identity for ride flow.
// This app doesn't have Supabase Auth wired up, so we mint a stable
// per-browser id and reuse the name from the Service auth dialog if present.

const ID_KEY = "rideUserId";
const NAME_KEY = "rideUserName";
const PHONE_KEY = "rideUserPhone";
const MODE_KEY = "rideMode"; // "passenger" | "driver"

export function getUserId(): string {
  if (typeof window === "undefined") return "anon";
  let id = localStorage.getItem(ID_KEY);
  if (!id) {
    id = (crypto as any).randomUUID ? crypto.randomUUID() : String(Date.now());
    localStorage.setItem(ID_KEY, id);
  }
  return id;
}

export function getUserName(): string {
  if (typeof window === "undefined") return "";
  return (
    localStorage.getItem(NAME_KEY) ||
    localStorage.getItem("serviceUserName") ||
    ""
  );
}

export function setUserName(v: string) {
  localStorage.setItem(NAME_KEY, v);
}

export function getUserPhone(): string {
  return typeof window !== "undefined" ? localStorage.getItem(PHONE_KEY) || "" : "";
}
export function setUserPhone(v: string) {
  localStorage.setItem(PHONE_KEY, v);
}

export function getMode(): "passenger" | "driver" {
  return (localStorage.getItem(MODE_KEY) as any) || "passenger";
}
export function setMode(m: "passenger" | "driver") {
  localStorage.setItem(MODE_KEY, m);
}
