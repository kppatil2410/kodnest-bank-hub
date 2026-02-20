import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Users, ArrowRightLeft, IndianRupee, Search, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

const ManagerDashboard = () => {
  const { getAllUsers, getAllTransactions } = useAuth();
  const [search, setSearch] = useState("");

  const users = getAllUsers();
  const transactions = getAllTransactions();
  const totalBalance = users.reduce((s, u) => s + u.balance, 0);
  const successTxns = transactions.filter(t => t.status === "Success");

  const filteredUsers = users.filter(u =>
    u.cname.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Chart data - daily transaction volume (last 7 days)
  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const day = d.toLocaleDateString("en-IN", { weekday: "short" });
    const dayTxns = successTxns.filter(t => new Date(t.created_at).toDateString() === d.toDateString());
    return { day, count: dayTxns.length, volume: dayTxns.reduce((s, t) => s + t.amount, 0) };
  });

  const statCards = [
    { label: "Total Users", value: users.length, icon: Users, color: "text-primary" },
    { label: "Total Transactions", value: transactions.length, icon: ArrowRightLeft, color: "text-accent" },
    { label: "Total Bank Balance", value: `₹${totalBalance.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-primary" },
    { label: "Success Rate", value: `${transactions.length ? Math.round((successTxns.length / transactions.length) * 100) : 0}%`, icon: TrendingUp, color: "text-accent" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">Manager Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">Overview of bank operations</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }} className="glass-card p-5">
              <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-lg font-bold text-foreground mt-1">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="glass-card-strong p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Daily Transactions</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dailyData}>
                <XAxis dataKey="day" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(222 47% 9%)", border: "1px solid hsl(217 33% 22%)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" fill="hsl(217 91% 53%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="glass-card-strong p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Transfer Volume (₹)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dailyData}>
                <CartesianGrid stroke="hsl(217 33% 18%)" strokeDasharray="3 3" />
                <XAxis dataKey="day" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(222 47% 9%)", border: "1px solid hsl(217 33% 22%)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="volume" stroke="hsl(160 84% 39%)" strokeWidth={2} dot={{ fill: "hsl(160 84% 39%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Users Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-card-strong overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">All Users</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
                className="w-full bg-muted rounded-lg pl-10 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {["ID", "Name", "Email", "Role", "Balance", "Joined"].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-muted-foreground px-6 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
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
                    <td className="px-6 py-3 text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;
