const TOKEN_KEY = "marketplace_token";
const USER_KEY = "marketplace_user";
const REMEMBER_KEY = "marketplace_remember";

// Token management
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

export const setToken = (token, rememberMe = false) => {
  if (rememberMe) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REMEMBER_KEY, "true");
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem(REMEMBER_KEY);
  }
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REMEMBER_KEY);
};

export const isRememberMe = () => {
  return localStorage.getItem(REMEMBER_KEY) === "true";
};

// User management
export const getUser = () => {
  const user =
    localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setUser = (user, rememberMe = false) => {
  const userString = JSON.stringify(user);
  if (rememberMe) {
    localStorage.setItem(USER_KEY, userString);
  } else {
    sessionStorage.setItem(USER_KEY, userString);
  }
};

export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
};

// Clear all storage
export const clearStorage = () => {
  removeToken();
  removeUser();
};
