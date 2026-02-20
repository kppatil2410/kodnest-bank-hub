import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type UserRole = "Customer" | "Manager" | "Admin";

export interface User {
  cid: number;
  cname: string;
  email: string;
  balance: number;
  phone: string;
  role: UserRole;
  created_at: string;
}

export interface Transaction {
  txn_id: number;
  sender_uid: number;
  receiver_uid: number;
  sender_name: string;
  receiver_name: string;
  amount: number;
  status: "Success" | "Failed";
  created_at: string;
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
  getAllUsers: () => User[];
  getAllTransactions: () => Transaction[];
  deleteUser: (uid: number) => void;
  promoteUser: (uid: number, role: UserRole) => void;
  getAllTokens: () => Array<{ tid: number; token: string; uid: number; username: string; expiry: string }>;
  revokeToken: (tid: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type MockUser = User & { password: string };

const mockUsers: MockUser[] = [
  { cid: 1, cname: "John Doe", email: "john@example.com", password: "password123", balance: 25000.00, phone: "9876543210", role: "Customer", created_at: "2025-01-15T10:00:00Z" },
  { cid: 2, cname: "Jane Smith", email: "jane@example.com", password: "password123", balance: 18500.50, phone: "9876543211", role: "Customer", created_at: "2025-02-01T10:00:00Z" },
  { cid: 3, cname: "Manager Singh", email: "manager@kodbank.com", password: "manager123", balance: 50000.00, phone: "9876543212", role: "Manager", created_at: "2024-12-01T10:00:00Z" },
  { cid: 4, cname: "Admin Kumar", email: "admin@kodbank.com", password: "admin123", balance: 100000.00, phone: "9876543213", role: "Admin", created_at: "2024-11-01T10:00:00Z" },
];

const mockTransactions: Transaction[] = [
  { txn_id: 1, sender_uid: 1, receiver_uid: 2, sender_name: "John Doe", receiver_name: "Jane Smith", amount: 5000, status: "Success", created_at: "2025-02-18T14:30:00Z" },
  { txn_id: 2, sender_uid: 2, receiver_uid: 1, sender_name: "Jane Smith", receiver_name: "John Doe", amount: 2500, status: "Success", created_at: "2025-02-17T11:00:00Z" },
  { txn_id: 3, sender_uid: 1, receiver_uid: 2, sender_name: "John Doe", receiver_name: "Jane Smith", amount: 100000, status: "Failed", created_at: "2025-02-16T09:15:00Z" },
  { txn_id: 4, sender_uid: 2, receiver_uid: 1, sender_name: "Jane Smith", receiver_name: "John Doe", amount: 1200, status: "Success", created_at: "2025-02-15T16:45:00Z" },
];

const mockTokens = [
  { tid: 1, token: "jwt_1708300000_1", uid: 1, username: "John Doe", expiry: "2025-02-20T11:00:00Z" },
  { tid: 2, token: "jwt_1708300000_2", uid: 2, username: "Jane Smith", expiry: "2025-02-20T12:00:00Z" },
  { tid: 3, token: "jwt_1708300000_3", uid: 3, username: "Manager Singh", expiry: "2025-02-20T13:00:00Z" },
];

let nextId = 5;
let nextTxnId = 5;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("kodbank_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("kodbank_token"));

  const login = useCallback(async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 800));
    const found = mockUsers.find(u => u.email === email && u.password === password);
    if (!found) throw new Error("Invalid email or password");
    const mockToken = `jwt_${Date.now()}_${found.cid}`;
    const { password: _, ...userData } = found;
    setUser(userData);
    setToken(mockToken);
    localStorage.setItem("kodbank_user", JSON.stringify(userData));
    localStorage.setItem("kodbank_token", mockToken);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string, initialDeposit: number) => {
    await new Promise(r => setTimeout(r, 800));
    if (mockUsers.find(u => u.email === email)) throw new Error("Email already registered");
    const newUser: MockUser = {
      cid: nextId++, cname: name, email, password, balance: initialDeposit,
      phone: "", role: "Customer", created_at: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    const mockToken = `jwt_${Date.now()}_${newUser.cid}`;
    const { password: _, ...userData } = newUser;
    setUser(userData);
    setToken(mockToken);
    localStorage.setItem("kodbank_user", JSON.stringify(userData));
    localStorage.setItem("kodbank_token", mockToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("kodbank_user");
    localStorage.removeItem("kodbank_token");
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
    const { password: _, ...updated } = found;
    setUser(updated);
    localStorage.setItem("kodbank_user", JSON.stringify(updated));
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
    if (sender.balance < amount) {
      mockTransactions.push({
        txn_id: nextTxnId++, sender_uid: sender.cid, receiver_uid: receiver.cid,
        sender_name: sender.cname, receiver_name: receiver.cname,
        amount, status: "Failed", created_at: new Date().toISOString(),
      });
      throw new Error("Insufficient balance");
    }
    sender.balance -= amount;
    receiver.balance += amount;
    mockTransactions.push({
      txn_id: nextTxnId++, sender_uid: sender.cid, receiver_uid: receiver.cid,
      sender_name: sender.cname, receiver_name: receiver.cname,
      amount, status: "Success", created_at: new Date().toISOString(),
    });
    const { password: _, ...updated } = sender;
    setUser(updated);
    localStorage.setItem("kodbank_user", JSON.stringify(updated));
  }, [user]);

  const getAllUsers = useCallback(() => mockUsers.map(({ password: _, ...u }) => u), []);
  const getAllTransactions = useCallback(() => [...mockTransactions].reverse(), []);
  const deleteUser = useCallback((uid: number) => {
    const idx = mockUsers.findIndex(u => u.cid === uid);
    if (idx !== -1) mockUsers.splice(idx, 1);
  }, []);
  const promoteUser = useCallback((uid: number, role: UserRole) => {
    const u = mockUsers.find(u => u.cid === uid);
    if (u) u.role = role;
  }, []);
  const getAllTokens = useCallback(() => [...mockTokens], []);
  const revokeToken = useCallback((tid: number) => {
    const idx = mockTokens.findIndex(t => t.tid === tid);
    if (idx !== -1) mockTokens.splice(idx, 1);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, token, isAuthenticated: !!user && !!token,
      login, signup, logout, verifyPassword, getBalance, transfer,
      getAllUsers, getAllTransactions, deleteUser, promoteUser, getAllTokens, revokeToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
