import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { getItem } from "../utils/storageService";

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
};

const initialContextValue: AuthContextType = {
  isAuthenticated: false,
  setIsAuthenticated: () => {},
};
export const AuthContext = createContext<AuthContextType>(initialContextValue);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getItem("accessToken", "");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
