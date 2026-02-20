import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PasswordModal } from "@/components/PasswordModal";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  ArrowRightLeft,
  Eye,
  EyeOff,
  TrendingUp,
  Shield,
  CreditCard,
  IndianRupee,
} from "lucide-react";

const AnimatedCounter = ({ value, show }: { value: number; show: boolean }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!show) return;
    let start = 0;
    const end = value;
    const duration = 1000;
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(start + (end - start) * eased));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [value, show]);

  if (!show) return <span className="text-muted-foreground">••••••</span>;
  return <span>₹{display.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>;
};

const Dashboard = () => {
  const { user, verifyPassword, getBalance } = useAuth();
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(false);
  const [balanceValue, setBalanceValue] = useState(user?.balance || 0);
  const [passwordModal, setPasswordModal] = useState(false);
  const [balanceRevealed, setBalanceRevealed] = useState(false);

  const handleCheckBalance = () => {
    setPasswordModal(true);
  };

  const onPasswordSuccess = async () => {
    const bal = await getBalance();
    setBalanceValue(bal);
    setShowBalance(true);
    setBalanceRevealed(true);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">
            Welcome back, <span className="text-gradient">{user?.cname?.split(" ")[0]}</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Here's your financial overview</p>
        </motion.div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card-strong p-6 mb-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 gradient-primary opacity-[0.03]" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Total Balance</span>
              </div>
              <button
                onClick={() => {
                  if (balanceRevealed) setShowBalance(!showBalance);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              <AnimatedCounter value={balanceValue} show={showBalance} />
            </div>
            <div className="flex items-center gap-1 text-accent text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>Account Active</span>
            </div>
          </div>
        </motion.div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={handleCheckBalance}
            className="glass-card p-6 text-left hover-lift group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:glow-primary transition-shadow">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Check Balance</h3>
            <p className="text-xs text-muted-foreground">Securely view your current balance with password verification</p>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => navigate("/transfer")}
            className="glass-card p-6 text-left hover-lift group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:glow-accent transition-shadow">
              <ArrowRightLeft className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Transfer Money</h3>
            <p className="text-xs text-muted-foreground">Send money instantly to any Kodnest Bank account holder</p>
          </motion.button>
        </div>

        {/* View Transactions Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          onClick={() => navigate("/transactions")}
          className="w-full glass-card p-4 text-left hover-lift group cursor-pointer mb-8 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">View Transaction History</h3>
            <p className="text-xs text-muted-foreground">See all past transfers and receipts</p>
          </div>
        </motion.button>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-4"
        >
          {[
            { label: "Security", value: "256-bit", icon: Shield },
            { label: "Account Type", value: "Savings", icon: CreditCard },
            { label: "Currency", value: "INR (₹)", icon: IndianRupee },
          ].map((stat, i) => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <stat.icon className="w-4 h-4 text-primary mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-sm font-semibold text-foreground">{stat.value}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <PasswordModal
        isOpen={passwordModal}
        onClose={() => setPasswordModal(false)}
        onVerify={verifyPassword}
        onSuccess={onPasswordSuccess}
        title="Check Balance"
      />
    </DashboardLayout>
  );
};

export default Dashboard;
