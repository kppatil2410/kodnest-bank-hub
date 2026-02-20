import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface User {
  cid: number;
  cname: string;
  email: string;
  balance: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, initialDeposit: number) => Promise<void>;
  logout: () => void;
  verifyPassword: (password: string) => Promise<boolean>;
  getBalance: () => Promise<number>;
  transfer: (receiverEmail: string, amount: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database for frontend demo
const mockUsers: Array<User & { password: string }> = [
  { cid: 1, cname: "John Doe", email: "john@example.com", password: "password123", balance: 25000.00 },
  { cid: 2, cname: "Jane Smith", email: "jane@example.com", password: "password123", balance: 18500.50 },
];

let nextId = 3;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("kodnest_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("kodnest_token"));

  const login = useCallback(async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 800));
    const found = mockUsers.find(u => u.email === email && u.password === password);
    if (!found) throw new Error("Invalid email or password");
    const mockToken = `jwt_${Date.now()}_${found.cid}`;
    const userData: User = { cid: found.cid, cname: found.cname, email: found.email, balance: found.balance };
    setUser(userData);
    setToken(mockToken);
    localStorage.setItem("kodnest_user", JSON.stringify(userData));
    localStorage.setItem("kodnest_token", mockToken);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string, initialDeposit: number) => {
    await new Promise(r => setTimeout(r, 800));
    if (mockUsers.find(u => u.email === email)) throw new Error("Email already registered");
    const newUser = { cid: nextId++, cname: name, email, password, balance: initialDeposit };
    mockUsers.push(newUser);
    const mockToken = `jwt_${Date.now()}_${newUser.cid}`;
    const userData: User = { cid: newUser.cid, cname: newUser.cname, email: newUser.email, balance: newUser.balance };
    setUser(userData);
    setToken(mockToken);
    localStorage.setItem("kodnest_user", JSON.stringify(userData));
    localStorage.setItem("kodnest_token", mockToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("kodnest_user");
    localStorage.removeItem("kodnest_token");
  }, []);

  const verifyPassword = useCallback(async (password: string) => {
    await new Promise(r => setTimeout(r, 500));
    if (!user) return false;
    const found = mockUsers.find(u => u.cid === user.cid);
    return found?.password === password;
  }, [user]);

  const getBalance = useCallback(async () => {
    await new Promise(r => setTimeout(r, 500));
    if (!user) throw new Error("Not authenticated");
    const found = mockUsers.find(u => u.cid === user.cid);
    if (!found) throw new Error("User not found");
    const updated = { ...user, balance: found.balance };
    setUser(updated);
    localStorage.setItem("kodnest_user", JSON.stringify(updated));
    return found.balance;
  }, [user]);

  const transfer = useCallback(async (receiverEmail: string, amount: number) => {
    await new Promise(r => setTimeout(r, 1000));
    if (!user) throw new Error("Not authenticated");
    const sender = mockUsers.find(u => u.cid === user.cid);
    const receiver = mockUsers.find(u => u.email === receiverEmail);
    if (!sender) throw new Error("Sender not found");
    if (!receiver) throw new Error("Receiver not found");
    if (sender.email === receiverEmail) throw new Error("Cannot transfer to yourself");
    if (sender.balance < amount) throw new Error("Insufficient balance");
    sender.balance -= amount;
    receiver.balance += amount;
    const updated = { ...user, balance: sender.balance };
    setUser(updated);
    localStorage.setItem("kodnest_user", JSON.stringify(updated));
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user && !!token, login, signup, logout, verifyPassword, getBalance, transfer }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
