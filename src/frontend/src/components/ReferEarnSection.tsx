import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Copy, Share2, Users } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { formatRupees, useAppStore } from "../store/appStore";

export function ReferEarnSection() {
  const { identity } = useInternetIdentity();
  const { appData } = useAppStore();
  const isLoggedIn = !!identity;

  const handleCopy = () => {
    navigator.clipboard.writeText(appData.referralCode);
    toast.success("Referral code copied!");
  };

  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(`Join EarnMax and earn real money! Use my referral code ${appData.referralCode} to get ₹50 bonus. Download: ${window.location.origin}`)}`;
  const telegramLink = `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(`Join EarnMax! Use code ${appData.referralCode} for ₹50 bonus!`)}`;

  return (
    <section className="py-8 px-4 max-w-6xl mx-auto" data-ocid="refer.section">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold uppercase tracking-wider">
          REFER & EARN
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Invite friends and earn ₹100 per successful referral
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Invite Card */}
        <motion.div
          className="bg-card rounded-xl p-6 card-shadow border border-border"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-5">
            <div className="text-4xl mb-2">🎁</div>
            <h3 className="font-bold text-lg text-foreground">
              Invite Friends, Earn ₹100 per referral!
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Your friend also gets ₹50 welcome bonus
            </p>
          </div>

          {/* Referral Code */}
          <div className="invite-bg rounded-xl p-4 mb-5">
            <p className="text-xs text-center text-amber-800 mb-2 font-medium">
              YOUR REFERRAL CODE
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white rounded-lg px-4 py-3 text-center">
                <span className="font-bold text-lg tracking-widest text-foreground">
                  {isLoggedIn ? appData.referralCode : "LOGIN123"}
                </span>
              </div>
              <Button
                size="sm"
                onClick={handleCopy}
                className="bg-primary text-white hover:bg-primary/90 h-full"
                data-ocid="refer.copy.button"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center">
              Share via
            </p>
            <div className="flex gap-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors"
                data-ocid="refer.whatsapp.button"
              >
                <span className="text-base">📲</span>
                WhatsApp
              </a>
              <a
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors"
                data-ocid="refer.telegram.button"
              >
                <span className="text-base">✈️</span>
                Telegram
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex-1 border-border text-foreground"
                data-ocid="refer.share.button"
              >
                <Share2 className="w-4 h-4 mr-1" />
                Copy
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Referred Users */}
        <motion.div
          className="bg-card rounded-xl p-6 card-shadow border border-border"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <Users className="w-5 h-5 text-secondary" />
            <h3 className="font-bold text-foreground">
              Your Referrals ({appData.referredUsers.length})
            </h3>
          </div>

          {appData.referredUsers.length === 0 ? (
            <div
              className="text-center py-8"
              data-ocid="refer.referrals.empty_state"
            >
              <div className="text-4xl mb-2">👥</div>
              <p className="text-muted-foreground text-sm">
                No referrals yet. Share your code to start earning!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {appData.referredUsers.map((user, i) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  data-ocid={`refer.referrals.item.${i + 1}`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9">
                      <AvatarFallback className="bg-secondary text-white text-xs font-bold">
                        {user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        {user.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(user.joinedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-secondary">
                      +{formatRupees(user.earned)}
                    </div>
                    <div className="text-xs text-muted-foreground">earned</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Total Referral Earnings */}
          {appData.referredUsers.length > 0 && (
            <div className="mt-4 p-3 gradient-card rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">
                  Total Referral Bonus
                </span>
                <span className="font-bold text-primary">
                  {formatRupees(
                    appData.referredUsers.reduce((s, u) => s + u.earned, 0),
                  )}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
