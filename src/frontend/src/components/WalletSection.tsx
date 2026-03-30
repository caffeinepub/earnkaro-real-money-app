import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowDownToLine,
  CheckCircle2,
  History,
  Loader2,
  Plus,
  TrendingUp,
  Wallet,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  ADMIN_WITHDRAWAL_KEY,
  formatRupees,
  loadAdminWithdrawals,
  useAppStore,
} from "../store/appStore";

export function WalletSection() {
  const { identity } = useInternetIdentity();
  const { appData, updateAppData } = useAppStore();
  const { actor } = useActor();
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"wallet" | "transactions">(
    "wallet",
  );

  const principal = identity?.getPrincipal().toString() ?? "";
  const userName = principal ? `User_${principal.slice(-4)}` : "Guest";

  const handleWithdraw = () => {
    const amtRupees = Number.parseFloat(withdrawAmount);
    if (!amtRupees || amtRupees < 10) {
      toast.error("Minimum withdrawal is ₹10");
      return;
    }
    const amtPaise = Math.floor(amtRupees * 100);
    if (amtPaise > appData.walletBalance) {
      toast.error("Insufficient wallet balance");
      return;
    }
    if (!upiId.trim()) {
      toast.error("Please enter a valid UPI ID");
      return;
    }

    const request = {
      id: `w_${Date.now()}`,
      userId: principal,
      userName,
      amount: amtPaise,
      upiId: upiId.trim(),
      status: "pending" as const,
      timestamp: Date.now(),
    };

    updateAppData((prev) => {
      const newTx = {
        id: `tx_${Date.now()}`,
        type: "debit" as const,
        description: `Withdrawal Request to ${upiId.trim()}`,
        amount: amtPaise,
        timestamp: Date.now(),
        status: "pending" as const,
      };
      return {
        ...prev,
        walletBalance: prev.walletBalance - amtPaise,
        transactions: [newTx, ...prev.transactions],
        withdrawalRequests: [request, ...prev.withdrawalRequests],
      };
    });

    const adminWithdrawals = loadAdminWithdrawals();
    adminWithdrawals.unshift(request);
    localStorage.setItem(
      ADMIN_WITHDRAWAL_KEY,
      JSON.stringify(adminWithdrawals),
    );

    toast.success(`Withdrawal of ${formatRupees(amtPaise)} submitted!`, {
      description: "Processing within 24 hours",
    });
    setShowWithdraw(false);
    setWithdrawAmount("");
    setUpiId("");
  };

  const handleDeposit = async () => {
    const amtRupees = Number.parseFloat(depositAmount);
    if (!amtRupees || amtRupees < 10) {
      toast.error("Minimum deposit is ₹10");
      return;
    }
    if (!actor) {
      toast.error("Not connected to backend");
      return;
    }
    setIsSubmitting(true);
    try {
      const paise = Math.floor(amtRupees * 100);
      const successUrl = `${window.location.origin}/?deposit=success&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/?deposit=cancel`;
      const url = await actor.createCheckoutSession(
        [
          {
            productName: "Wallet Top-up",
            currency: "inr",
            quantity: 1n,
            priceInCents: BigInt(paise),
            productDescription: "Add money to EarnMax wallet",
          },
        ],
        successUrl,
        cancelUrl,
      );
      window.location.href = url;
    } catch (_e) {
      toast.error(
        "Failed to create payment session. Stripe may not be configured.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-8 px-4 max-w-6xl mx-auto" data-ocid="wallet.section">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold uppercase tracking-wider">
          WALLET & EARNINGS
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Your financial dashboard
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab("wallet")}
          data-ocid="wallet.wallet.tab"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "wallet"
              ? "bg-secondary text-white"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <Wallet className="w-4 h-4 inline mr-1.5" />
          Wallet
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("transactions")}
          data-ocid="wallet.transactions.tab"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "transactions"
              ? "bg-secondary text-white"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <History className="w-4 h-4 inline mr-1.5" />
          Transactions
        </button>
      </div>

      {activeTab === "wallet" ? (
        <>
          {/* Metrics */}
          <motion.div
            className="bg-card rounded-xl p-6 card-shadow border border-border mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-3 gap-4 divide-x divide-border">
              <div className="text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Wallet Balance
                </div>
                <div className="text-xl md:text-2xl font-bold text-primary">
                  {formatRupees(appData.walletBalance)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Today's Earnings
                </div>
                <div className="text-xl md:text-2xl font-bold text-secondary">
                  {formatRupees(appData.todayEarnings)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Total Earned
                </div>
                <div className="text-xl md:text-2xl font-bold text-foreground">
                  {formatRupees(appData.totalEarned)}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button
              size="lg"
              onClick={() => setShowWithdraw(true)}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold h-12"
              data-ocid="wallet.withdraw.button"
            >
              <ArrowDownToLine className="w-4 h-4 mr-2" />
              WITHDRAW MONEY
            </Button>
            <Button
              size="lg"
              onClick={() => setShowDeposit(true)}
              variant="outline"
              className="border-secondary text-secondary hover:bg-secondary/10 font-bold h-12"
              data-ocid="wallet.deposit.button"
            >
              <Plus className="w-4 h-4 mr-2" />
              ADD MONEY
            </Button>
          </div>

          {/* Withdrawal Step Indicator */}
          <div className="bg-card rounded-xl p-5 card-shadow border border-border">
            <h3 className="text-sm font-bold uppercase tracking-wide mb-4 text-center">
              Instant Withdrawal Process
            </h3>
            <div className="flex items-center justify-between">
              {[
                { step: "1", label: "Select Bank/UPI", icon: "🏦" },
                { step: "2", label: "Enter Amount", icon: "💰" },
                { step: "3", label: "Instant Payout", icon: "⚡" },
              ].map((s, i) => (
                <div key={s.step} className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center text-white font-bold text-sm">
                      {s.icon}
                    </div>
                    <span className="text-xs text-center mt-1 text-muted-foreground">
                      {s.label}
                    </span>
                  </div>
                  {i < 2 && (
                    <div className="flex-1 h-0.5 bg-muted mx-2 mt-[-16px]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Transactions */
        <div
          className="bg-card rounded-xl card-shadow border border-border overflow-hidden"
          data-ocid="wallet.transactions.table"
        >
          {appData.transactions.length === 0 ? (
            <div
              className="py-12 text-center"
              data-ocid="wallet.transactions.empty_state"
            >
              <TrendingUp className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">
                No transactions yet. Start earning!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {appData.transactions.map((tx, i) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between px-4 py-3"
                  data-ocid={`wallet.transactions.item.${i + 1}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        tx.type === "credit"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      {tx.type === "credit" ? "↑" : "↓"}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {tx.description}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(tx.timestamp).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-bold text-sm ${
                        tx.type === "credit" ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {tx.type === "credit" ? "+" : "-"}
                      {formatRupees(tx.amount)}
                    </div>
                    <Badge
                      variant={
                        tx.status === "completed"
                          ? "default"
                          : tx.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                      className="text-[10px] h-4 px-1.5"
                    >
                      {tx.status === "completed" ? (
                        <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />
                      ) : tx.status === "pending" ? null : (
                        <XCircle className="w-2.5 h-2.5 mr-0.5" />
                      )}
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Withdraw Modal */}
      <Dialog open={showWithdraw} onOpenChange={setShowWithdraw}>
        <DialogContent data-ocid="wallet.withdraw.modal">
          <DialogHeader>
            <DialogTitle>Withdraw Money</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="upiId">UPI ID / Phone Number</Label>
              <Input
                id="upiId"
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="mt-1"
                data-ocid="wallet.withdraw.input"
              />
            </div>
            <div>
              <Label htmlFor="withdrawAmt">Amount (₹)</Label>
              <Input
                id="withdrawAmt"
                type="number"
                placeholder="Min ₹10"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="mt-1"
                data-ocid="wallet.withdraw.amount.input"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Available: {formatRupees(appData.walletBalance)}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowWithdraw(false)}
              data-ocid="wallet.withdraw.cancel.button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleWithdraw}
              className="bg-secondary text-white hover:bg-secondary/90"
              data-ocid="wallet.withdraw.submit.button"
            >
              <ArrowDownToLine className="w-4 h-4 mr-1" /> Withdraw
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deposit Modal */}
      <Dialog open={showDeposit} onOpenChange={setShowDeposit}>
        <DialogContent data-ocid="wallet.deposit.modal">
          <DialogHeader>
            <DialogTitle>Add Money to Wallet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="depositAmt">Amount (₹)</Label>
              <Input
                id="depositAmt"
                type="number"
                placeholder="Enter amount (Min ₹10)"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="mt-1"
                data-ocid="wallet.deposit.input"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Powered by Stripe. Secure payment gateway.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeposit(false)}
              data-ocid="wallet.deposit.cancel.button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeposit}
              disabled={isSubmitting}
              className="bg-primary text-white hover:bg-primary/90"
              data-ocid="wallet.deposit.submit.button"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-1" />
              )}
              {isSubmitting ? "Redirecting..." : "Pay via Stripe"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
