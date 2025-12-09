import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authAPI } from "../services/api";
import {
  getToken,
  setToken,
  removeToken,
  getUser,
  setUser,
  removeUser,
  isRememberMe,
} from "../utils/storage";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      const storedUser = getUser();

      if (token && storedUser) {
        setUserState(storedUser);
        // Optionally verify token by fetching profile
        try {
          const response = await authAPI.getProfile();
          if (response.data.success) {
            const userData = response.data.data;
            setUserState(userData);
            setUser(userData, isRememberMe());
          }
        } catch (err) {
          // Token might be expired
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (email, password, rememberMe = false) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(email, password);

      if (response.data.success) {
        const { user: userData, token } = response.data.data;
        setToken(token, rememberMe);
        setUser(userData, rememberMe);
        setUserState(userData);
        return { success: true, user: userData };
      }

      throw new Error(response.data.message || "Login failed");
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Login failed";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.register(userData);

      if (response.data.success) {
        const { user: newUser, token } = response.data.data;
        setToken(token, false);
        setUser(newUser, false);
        setUserState(newUser);
        return { success: true, user: newUser };
      }

      throw new Error(response.data.message || "Registration failed");
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Registration failed";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    removeToken();
    removeUser();
    setUserState(null);
    setError(null);
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.updateProfile(profileData);

      if (response.data.success) {
        const updatedUser = response.data.data;
        setUser(updatedUser, isRememberMe());
        setUserState(updatedUser);
        return { success: true, user: updatedUser };
      }

      throw new Error(response.data.message || "Update failed");
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Update failed";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
