import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Trash2, ShieldCheck, Users, Key, Database, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { user, getAllUsers, getAllTransactions, deleteUser, promoteUser, getAllTokens, revokeToken } = useAuth();
  const { toast } = useToast();
  const [tab, setTab] = useState<"users" | "tokens" | "stats">("users");
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate(n => n + 1);

  const users = getAllUsers();
  const transactions = getAllTransactions();
  const tokens = getAllTokens();

  const handleDelete = (uid: number) => {
    if (uid === user?.cid) { toast({ title: "Cannot delete yourself", variant: "destructive" }); return; }
    deleteUser(uid);
    toast({ title: "User deleted" });
    refresh();
  };

  const handlePromote = (uid: number, role: UserRole) => {
    promoteUser(uid, role);
    toast({ title: `User promoted to ${role}` });
    refresh();
  };

  const handleRevoke = (tid: number) => {
    revokeToken(tid);
    toast({ title: "Token revoked" });
    refresh();
  };

  const tabs = [
    { key: "users" as const, label: "Users", icon: Users },
    { key: "tokens" as const, label: "Tokens", icon: Key },
    { key: "stats" as const, label: "System Stats", icon: Database },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Admin Panel</h2>
          <p className="text-sm text-muted-foreground mt-1">Full system control</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? "gradient-primary text-primary-foreground" : "glass-card text-muted-foreground hover:text-foreground"}`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {tab === "users" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card-strong overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {["ID", "Name", "Email", "Role", "Balance", "Actions"].map(h => (
                      <th key={h} className="text-left text-xs font-medium text-muted-foreground px-6 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.cid} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-3 text-xs text-muted-foreground">#{u.cid}</td>
                      <td className="px-6 py-3 text-sm text-foreground font-medium">{u.cname}</td>
                      <td className="px-6 py-3 text-xs text-muted-foreground">{u.email}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${u.role === "Admin" ? "bg-destructive/15 text-destructive" : u.role === "Manager" ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-foreground">₹{u.balance.toLocaleString("en-IN")}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          {u.role === "Customer" && (
                            <button onClick={() => handlePromote(u.cid, "Manager")}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-medium hover:bg-primary/20 transition-colors">
                              <ShieldCheck className="w-3 h-3" /> Promote
                            </button>
                          )}
                          {u.cid !== user?.cid && (
                            <button onClick={() => handleDelete(u.cid)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-destructive/10 text-destructive text-[10px] font-medium hover:bg-destructive/20 transition-colors">
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Tokens Tab */}
        {tab === "tokens" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card-strong overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {["TID", "User", "Token", "Expiry", "Actions"].map(h => (
                      <th key={h} className="text-left text-xs font-medium text-muted-foreground px-6 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tokens.map(t => (
                    <tr key={t.tid} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-3 text-xs text-muted-foreground">#{t.tid}</td>
                      <td className="px-6 py-3 text-sm text-foreground">{t.username}</td>
                      <td className="px-6 py-3 text-xs text-muted-foreground font-mono truncate max-w-[200px]">{t.token}</td>
                      <td className="px-6 py-3 text-xs text-muted-foreground">{new Date(t.expiry).toLocaleString("en-IN")}</td>
                      <td className="px-6 py-3">
                        <button onClick={() => handleRevoke(t.tid)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-destructive/10 text-destructive text-[10px] font-medium hover:bg-destructive/20 transition-colors">
                          <AlertCircle className="w-3 h-3" /> Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                  {tokens.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-12 text-sm text-muted-foreground">No active tokens</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Stats Tab */}
        {tab === "stats" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Total Users", value: users.length },
              { label: "Customers", value: users.filter(u => u.role === "Customer").length },
              { label: "Managers", value: users.filter(u => u.role === "Manager").length },
              { label: "Admins", value: users.filter(u => u.role === "Admin").length },
              { label: "Total Transactions", value: transactions.length },
              { label: "Successful Txns", value: transactions.filter(t => t.status === "Success").length },
              { label: "Failed Txns", value: transactions.filter(t => t.status === "Failed").length },
              { label: "Active Tokens", value: tokens.length },
              { label: "Total Bank Balance", value: `₹${users.reduce((s, u) => s + u.balance, 0).toLocaleString("en-IN")}` },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} className="glass-card p-5">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold text-foreground mt-2">{s.value}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
