// Login ki jaankari browser mein save karna aur padhna

export function saveLogin(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function getSavedUser() {
  const text = localStorage.getItem("user");
  if (text === null) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (err) {
    return null;
  }
}

export function clearLogin() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// Login ke baad har role kahan jaayega
export const roleHome = {
  manager: "/",
  dispatch: "/create",
  guard: "/scanner",
};
