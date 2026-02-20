import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ArrowUpRight, ArrowDownLeft, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 5;

const Transactions = () => {
  const { user, getAllTransactions } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Success" | "Failed">("All");
  const [page, setPage] = useState(1);

  const allTxns = getAllTransactions();
  const myTxns = user?.role === "Customer"
    ? allTxns.filter(t => t.sender_uid === user.cid || t.receiver_uid === user.cid)
    : allTxns;

  const filtered = useMemo(() => {
    return myTxns.filter(t => {
      const matchSearch = t.sender_name.toLowerCase().includes(search.toLowerCase()) ||
        t.receiver_name.toLowerCase().includes(search.toLowerCase()) ||
        t.amount.toString().includes(search);
      const matchStatus = statusFilter === "All" || t.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [myTxns, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Transaction History</h2>
          <p className="text-sm text-muted-foreground mt-1">View all your past transactions</p>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name or amount..."
              className="w-full bg-muted rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {(["All", "Success", "Failed"] as const).map(s => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === s
                  ? "gradient-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                {s}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card-strong overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">Date</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">Type</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-6 py-4">With</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-6 py-4">Amount</th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((t, i) => {
                  const isSender = t.sender_uid === user?.cid;
                  return (
                    <motion.tr key={t.txn_id}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {new Date(t.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 text-xs font-medium ${isSender ? "text-destructive" : "text-accent"}`}>
                          {isSender ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
                          {isSender ? "Sent" : "Received"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{isSender ? t.receiver_name : t.sender_name}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-right text-foreground">
                        {isSender ? "-" : "+"}₹{t.amount.toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold ${t.status === "Success"
                          ? "bg-accent/15 text-accent" : "bg-destructive/15 text-destructive"}`}>
                          {t.status}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
                {paginated.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-12 text-sm text-muted-foreground">No transactions found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;
