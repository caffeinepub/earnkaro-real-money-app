import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, LogOut, Shield, User } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useUserRole } from "../hooks/useQueries";
import { formatRupees, useAppStore } from "../store/appStore";

export function ProfileSection() {
  const { identity, clear } = useInternetIdentity();
  const { appData } = useAppStore();
  const { data: role } = useUserRole();
  const principal = identity?.getPrincipal().toString() ?? "";
  const shortPrincipal = principal
    ? `${principal.slice(0, 8)}...${principal.slice(-4)}`
    : "";

  const handleCopyPrincipal = () => {
    navigator.clipboard.writeText(principal);
    toast.success("Principal ID copied!");
  };

  return (
    <section
      className="py-8 px-4 max-w-2xl mx-auto"
      data-ocid="profile.section"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold uppercase tracking-wider">PROFILE</h2>
      </div>

      <motion.div
        className="bg-card rounded-xl p-6 card-shadow border border-border mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col items-center text-center mb-6">
          <Avatar className="w-20 h-20 mb-3">
            <AvatarFallback className="gradient-hero text-white text-2xl font-bold">
              <User className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="default" className="bg-secondary text-white">
              {role ?? "user"}
            </Badge>
          </div>
          <button
            type="button"
            onClick={handleCopyPrincipal}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-1"
            data-ocid="profile.copy.button"
          >
            <span className="font-mono">{shortPrincipal}</span>
            <Copy className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: "Wallet Balance",
              value: formatRupees(appData.walletBalance),
              color: "text-primary",
            },
            {
              label: "Total Earned",
              value: formatRupees(appData.totalEarned),
              color: "text-secondary",
            },
            {
              label: "Tasks Done",
              value: `${appData.completedTaskIds.length}`,
              color: "text-foreground",
            },
            {
              label: "Referrals",
              value: `${appData.referredUsers.length}`,
              color: "text-foreground",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-muted/50 rounded-lg p-3 text-center"
            >
              <div className={`text-lg font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="bg-card rounded-xl p-4 card-shadow border border-border mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-secondary" />
          <span className="text-sm font-semibold">Referral Code</span>
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-muted px-3 py-2 rounded-lg text-sm font-mono tracking-widest">
            {appData.referralCode}
          </code>
          <Button
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(appData.referralCode);
              toast.success("Copied!");
            }}
            className="bg-primary text-white hover:bg-primary/90"
            data-ocid="profile.referral.copy.button"
          >
            <Copy className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <Button
        onClick={() => clear()}
        variant="outline"
        className="w-full border-destructive text-destructive hover:bg-destructive/10"
        data-ocid="profile.logout.button"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </section>
  );
}
